export const getTruncatedValue = (val: string) => {
  if (val.length > 10) {
    return `${val.slice(0, 10)}...`;
  }
  return val;
};
