import { ICurrency } from "@/interfaces/ICurrency";
import api from "@/utils/api";
import { mockPopularCurrencies } from "./mockData";
import { transformCurrenciesToOptions } from "@/utils/currency";

export const getAllCurrencies = async () => {
  try {
    const url = "https://interview.switcheo.com/prices.json";
    const res = await api.get<ICurrency[]>(url);
    return transformCurrenciesToOptions(res.data);
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Fake API call
export const getPopularCurrencies = () => {
  return new Promise<string[]>((resolve) => {
    setTimeout(() => {
      resolve(mockPopularCurrencies);
    }, 1000);
  });
};
