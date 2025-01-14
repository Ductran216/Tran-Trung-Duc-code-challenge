import CurrencyConvertForm from "@/components/Organisms/CurrencyConvertForm";

const CurrencyConvertPage: React.FC = () => {
  return (
    <div className="mx-auto w-96">
      <p className="headline-large text-center mb-10">Currency Converter</p>
      <CurrencyConvertForm />
    </div>
  );
};

export default CurrencyConvertPage;
