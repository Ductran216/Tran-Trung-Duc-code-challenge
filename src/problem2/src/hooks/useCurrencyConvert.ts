import { QUERY_KEY } from "@/constants/query";
import { CurrencyService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";

type UseCurrencyConvertParams = {
  fromCurrency?: string;
  toCurrency?: string;
  fromAmount?: number;
};

type UseCurrencyConvertReturn = {
  toAmount: number;
  loading: boolean;
};
const useCurrencyConvert = ({
  fromCurrency,
  toCurrency,
  fromAmount,
}: UseCurrencyConvertParams): UseCurrencyConvertReturn => {
  const { data } = useQuery({
    queryKey: [QUERY_KEY.ALL_CURRENCIES],
    queryFn: CurrencyService.getAllCurrencies,
  });

  const [loading, setLoading] = useState(false);
  const [toAmount, setToAmount] = useState<number>(0);

  const fromRate = useMemo(() => data?.find((item) => item.value === fromCurrency)?.rate, [data, fromCurrency]);
  const toRate = useMemo(() => data?.find((item) => item.value === toCurrency)?.rate, [data, toCurrency]);

  useEffect(() => {
    if (!(fromAmount && fromRate && toRate)) {
      setToAmount(0);
      return;
    }

    // fake API call delay
    setLoading(true);
    const timeoutId = setTimeout(() => {
      setToAmount(parseFloat(((fromAmount * toRate) / fromRate).toFixed(2)));
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [fromRate, toRate, fromAmount]);

  return {
    loading,
    toAmount,
  };
};

export default useCurrencyConvert;
