export interface ICurrency {
  currency: string;
  date: string;
  price?: number;
}

export interface ICurrencyOption {
  label: string;
  value: string;
  rate: number;
  date: string;
}
