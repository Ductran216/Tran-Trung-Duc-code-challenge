# Refactor Detailed Analysis

## 1. Identified Issues

### Duplicate interfaces with similar structure

- **Problem**: The `WalletBalance` and `FormattedWalletBalance` interfaces are nearly identical, with both containing `currency` and `amount` properties, but `FormattedWalletBalance` adds an extra `formatted` property.
- **Impact**: This creates redundancy in the code, which can lead to confusion and maintenance issues. If the `formatted` property is frequently added in various places, it may lead to repetitive code and potential inconsistencies.
- **Why it's a bad practice**: Duplicate or nearly identical interfaces increase code duplication, making the code harder to maintain and refactor. It can also lead to errors when keeping the structures in sync if they need to be modified later.
- **How to fix**: Consider using a single interface with optional properties or extending one interface to avoid duplication.

### Lack of Proper Types for Props Interface

- **Problem**: The Props interface extends BoxProps but doesn't add any additional properties or functionality.
- **Impact**: This creates unnecessary duplication, as Props and BoxProps are effectively the same, leading to confusion and redundant code.
- **Why it's a bad practice**: It goes against the purpose of extends, which is to add new properties or modify existing ones. This approach doesn't provide any benefits and makes the code harder to maintain.
- **How to fix**: Remove the Props interface or extend it with additional properties or methods if needed, rather than duplicating BoxProps without changes.

### Unnecessary use of Rest Operator and unused `children` prop

- **Problem**: The `children` prop is destructured from `props` but not used in the JSX output, and the `rest` operator is used to spread the remaining props onto the `<div>` without explicit validation.
- **Impact**:
  - Destructuring `children` without using it introduces unnecessary complexity and makes the code less readable.
  - Spreading all `rest` props without validation can lead to unexpected behavior or passing unwanted props to the `<div>`, potentially causing bugs.
- **Why it's a bad practice**:
  - Destructuring unused props goes against clean and efficient code practices, making the code more difficult to maintain and understand.
  - Spreading props indiscriminately can result in unexpected or invalid attributes being passed to the DOM, which might break functionality or cause unexpected UI behavior.
- **How to fix**:
  - Remove the `children` destructuring if it's not needed.
  - Instead of spreading `rest` blindly, explicitly pass the necessary props to the component or validate them to avoid passing unwanted props.

### Issues with `getPriority` Function

- **Problem**:
  - The `blockchain` parameter uses the `any` type, which bypasses TypeScript's type checking and makes the function less reliable.
  - The function contains hardcoded values for blockchain priorities, which can make the code harder to update and maintain.
  - The function is defined inside a component, which can lead to unnecessary re-renders if the component updates frequently, reducing performance.
- **Impact**:
  - The use of `any` can lead to runtime errors due to unexpected inputs.
  - Hardcoded values make it difficult to adapt to changes, such as adding or updating blockchain priorities.
  - Placing the function inside a component causes it to be recreated on every render, wasting computational resources.
- **Why it's a bad practice**:
  - Hardcoded logic and lack of type safety reduce code maintainability and readability.
  - Repeated function creation within a component leads to performance degradation in large applications.
- **How to fix**:
  - Use a `Blockchain` enum to define valid blockchain values and their priorities.
  - Move the function outside of the component to prevent unnecessary re-renders.
  - Use the enum to map priorities dynamically instead of relying on hardcoded `switch` statements.

```typescript
// Define a Blockchain enum with priorities
export enum Blockchain {
  Osmosis = 100,
  Ethereum = 50,
  Arbitrum = 30,
  Zilliqa = 20,
  Neo = 20,
  Unknown = -99,
}

// getPriority function refactored
export const getPriority = (blockchain: Blockchain): number => {
  return Blockchain[blockchain] ?? Blockchain.Unknown; // Use enum mapping
};
```

### Inefficient logic and incorrect use of `useMemo`

- **Problem**:
  - The `useMemo` block contains redundant filtering and sorting logic, with hard-to-read conditions that make it difficult to maintain. Additionally, the dependency array not only does not account for all variables used within the useMemo block but also includes the unnecessary variable prices, which can lead to stale values.
  - The `WalletBalance` interface lacks a `blockchain` property, which is required by the `getPriority` function. This causes a type error or reliance on implicit typing.
- **Impact**:
  - The redundant filtering and sorting logic makes the code less efficient and harder to understand.
  - Incorrect dependencies in `useMemo` can cause the memoized value to be recalculated unnecessarily or not updated when relevant values change.
  - The logic mixing priorities and balance conditions is unclear and prone to errors.
  - Missing properties in the `WalletBalance` interface reduce the benefits of TypeScript's type safety.
- **Why it's a bad practice**:
  - Overcomplicated logic reduces code readability and maintainability.
  - Incorrect dependencies defeat the purpose of `useMemo`, potentially leading to subtle bugs or performance issues.
  - Missing types reduce maintainability and increase the risk of bugs.
- **How to fix**:
  - Simplify the filtering and sorting logic.
  - Ensure all variables used in the `useMemo` block are added to the dependency array.
  - Use helper functions for clarity and maintainability.
  - Add the missing `blockchain` property to the `WalletBalance` interface and ensure type safety.

```typescript
interface WalletBalance {
  currency: string;
  amount: number;
  // Add missing property
  blockchain: string;
}

// Improved helper functions
const isValidBalance = (balance: WalletBalance): boolean => {
  const balancePriority = getPriority(balance.blockchain);
  return balancePriority > BlockchainPriority.Unknown && balance.amount <= 0;
};

const comparePriorities = (lhs: WalletBalance, rhs: WalletBalance): number => {
  const leftPriority = getPriority(lhs.blockchain);
  const rightPriority = getPriority(rhs.blockchain);
  return rightPriority - leftPriority; // Sort descending
};

// Simplified useMemo logic
const sortedBalances = useMemo(() => {
  return balances
    .filter(isValidBalance) // Use helper function for clarity
    .sort(comparePriorities); // Use helper function for sorting
}, [balances]); // Include correct dependencies
```

### Inefficient formattedBalances and rows arrays creation

- **Problem**:
  - The `formattedBalances` and `rows` arrays are recomputed on every render.
  - The logic to format amounts is written in the `formattedBalances` is unnecessary and can be written directly in `rows`
- **Impact**: This could trigger unnecessary re-renders of child components (`WalletRow`) even when the data has not changed.
- **Why it's a bad practice**: Re-rendering unnecessary components can lead to performance degradation, especially when dealing with a large list of rows.
- **How to fix**:
  - Use `useMemo` to memoize the `rows` array, ensuring that it only updates when necessary.
  - Remove `formattedBalances` array creation, consolidate the formatting logic into `rows`

### `rows` incorrectly assumes `sortedBalances` is of type `FormattedWalletBalance`

- **Problem**: `rows` incorrectly assumes `sortedBalances` is of type `FormattedWalletBalance`, leading to potential type errors.
- **Impact**: **Type Errors**: Type mismatches could lead to runtime errors or invalid component rendering.
- **Why it's a bad practice**: Violates clean code principles by coupling dynamic object creation with insufficient type definitions.
- **How to fix**:
  - Use `WalletBalance` interface for `rows`.
  - Remove unnecessary interface `FormattedWalletBalance`

### Potential issues in mapping and rendering rows

- **Problem**:
  - The code uses `prices[balance.currency]` without checking if the value exists, which could lead to a `NaN` value if the currency doesn't have a corresponding price.
  - The `key` for each element in the `rows` is set to the `index` of the array.
- **Impact**:
  - If `prices[balance.currency]` is undefined or null, it will result in an incorrect `usdValue` calculation, causing unexpected rendering behavior.
  - Using `index` as a `key` can negatively affect performance and cause issues when items are re-ordered or removed from the list.
- **Why it's a bad practice**:
  - Not validating external data like `prices` can introduce bugs and lead to inconsistent UI behavior, especially when working with dynamic or user-generated data.
  - React uses the `key` to identify which items have changed, are added, or are removed, and using `index` can lead to inefficient re-rendering and potential UI issues.
- **How to fix**:
  - Add a validation to check if `prices[balance.currency]` exists before performing the multiplication, and consider using a fallback value for undefined prices.
  - Use a unique and stable identifier for the `key`, such as `balance.id` or another unique property, instead of relying on the `index`.

## 2. Refactored Code

```tsx
interface WalletBalance {
  currency: string;
  amount: number;
  // Add missing property
  id: string;
  blockchain: string;
}

// Define an enum for blockchain priorities
enum BlockchainPriority {
  Osmosis = 100,
  Ethereum = 50,
  Arbitrum = 30,
  Zilliqa = 20,
  Neo = 20,
  Unknown = -99,
}

// Function outside of component to avoid re-renders. Clearly define type for parameters
const getPriority = (blockchain: string): number => {
  return BlockchainPriority[blockchain as keyof typeof BlockchainPriority] ?? BlockchainPriority.Unknown;
};

// Improved helper functions
const isValidBalance = (balance: WalletBalance): boolean => {
  const balancePriority = getPriority(balance.blockchain);
  return balancePriority > BlockchainPriority.Unknown && balance.amount <= 0;
};

const comparePriorities = (lhs: WalletBalance, rhs: WalletBalance): number => {
  const leftPriority = getPriority(lhs.blockchain);
  const rightPriority = getPriority(rhs.blockchain);
  return rightPriority - leftPriority; // Sort descending
};

const WalletPage: React.FC<BoxProps> = (props: BoxProps) => {
  // Example 1 valid prop here
  const { onClick } = props;

  // Example classes definition
  const classes = useStyles();
  const balances = useWalletBalances();
  const prices = usePrices();

  // Simplified useMemo logic
  const sortedBalances = useMemo(
    () =>
      // Fallback
      (balances || [])
        .filter(isValidBalance) // Use helper function for clarity
        .sort(comparePriorities), // Use helper function for sorting
    [balances] // Include correct dependencies
  );

  const rows = useMemo(
    () =>
      // Fallback
      (sortedBalances || []).map((balance: WalletBalance) => {
        // Validate and provide a fallback here
        const usdValue = prices && prices[balance.currency] ? prices[balance.currency] * balance.amount : 0;
        return (
          <WalletRow
            className={classes.row}
            key={balance.id}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.amount.toFixed()}
          />
        );
      }),
    [sortedBalances, prices]
  );

  return <div onClick={onClick}>{rows}</div>;
};
```
