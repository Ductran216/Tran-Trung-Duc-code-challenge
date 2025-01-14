import { ICurrency, ICurrencyOption } from "@/interfaces/ICurrency";
import dayjs from "dayjs";

export const getCurrencyImgSrc = (currencyCode: string) =>
  `https://raw.githubusercontent.com/Switcheo/token-icons/refs/heads/main/tokens/${currencyCode}.svg`;

export const transformCurrenciesToOptions = (currencies: ICurrency[]): ICurrencyOption[] => {
  const map = new Map<string, ICurrencyOption>();

  currencies.forEach((item) => {
    if (!item.price || !item.currency) return;

    const existing = map.get(item.currency);
    if (!existing || dayjs(item.date).isAfter(dayjs(existing.date))) {
      map.set(item.currency, {
        label: item.currency,
        value: item.currency,
        rate: item.price,
        date: item.date,
      });
    }
  });

  return Array.from(map.values());
};
