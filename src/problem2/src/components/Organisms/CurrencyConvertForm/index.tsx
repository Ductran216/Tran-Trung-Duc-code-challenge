import { BaseInputNumber } from "@/components/Atoms/BaseInputNumber";
import { BaseLoading } from "@/components/Atoms/BaseLoading";
import BaseReadOnlyInput from "@/components/Atoms/BaseReadOnlyInput";
import CurrencySelect from "@/components/Molecules/CurrencySelect";
import { SwapButton } from "@/components/Molecules/SwapButton";
import useCurrencyConvert from "@/hooks/useCurrencyConvert";
import useDebounce from "@/hooks/useDebounce";
import { Form } from "antd";
import { useEffect } from "react";

const CurrencyConvertForm = () => {
  const [form] = Form.useForm();
  const fromCurrency = Form.useWatch("fromCurrency", form);
  const toCurrency = Form.useWatch("toCurrency", form);
  const fromAmount = Form.useWatch("fromAmount", form);

  const fromAmountDebounce = useDebounce(fromAmount, 500);

  const { loading, toAmount } = useCurrencyConvert({
    fromCurrency,
    fromAmount: fromAmountDebounce,
    toCurrency,
  });

  useEffect(() => {
    form.setFieldsValue({ toAmount });
  }, [toAmount, form]);

  const handleSwap = () => {
    form.setFieldsValue({
      fromCurrency: toCurrency,
      toCurrency: fromCurrency,
    });
  };
  return (
    <>
      <Form form={form}>
        <div className="relative">
          <div className="bg-black rounded-2xl p-6 pb-16">
            <p className="body-extra-large text-white m-0 mb-6">You pay</p>
            <div className="flex items-center justify-between">
              <CurrencySelect name="fromCurrency" />
              <BaseInputNumber name="fromAmount" variant="borderless" width={160} placeholder="Enter amount..." />
            </div>
          </div>

          <div className="absolute flex top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
            <SwapButton loading={loading} onClick={handleSwap} />
          </div>

          <div className="bg-[#b78fff] rounded-2xl mt-16 p-6 pb-16">
            <p className="body-extra-large text-white m-0 mb-6">You receive</p>
            <div className="flex items-center justify-between">
              <CurrencySelect name="toCurrency" />
              {loading ? (
                <div className="flex-grow pl-5">
                  <BaseLoading />
                </div>
              ) : (
                <BaseReadOnlyInput variant="borderless" width={140} value={toAmount.toString()} />
              )}
            </div>
          </div>
        </div>
      </Form>
    </>
  );
};

export default CurrencyConvertForm;
