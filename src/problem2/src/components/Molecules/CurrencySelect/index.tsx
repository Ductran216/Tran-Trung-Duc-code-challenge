import { BaseSelect } from "@/components/Atoms/BaseSelect";
import { QUERY_KEY } from "@/constants/query";
import { CurrencyService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { filter, includes } from "lodash";
import { Form, Select } from "antd";
import { renderOption } from "./helper";
import { getCurrencyImgSrc } from "@/utils/currency";
import { BaseIconSkeleton } from "@/components/Atoms/BaseIconSkeleton";

const { Option, OptGroup } = Select;

const CurrencySelect = ({ name }: { name: string }) => {
  const form = Form.useFormInstance();
  const selectedValue = Form.useWatch(name, form);
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEY.ALL_CURRENCIES],
    queryFn: CurrencyService.getAllCurrencies,
  });

  const { data: dataPopular, isLoading: isLoadingPopular } = useQuery({
    queryKey: [QUERY_KEY.POPULAR_CURRENCIES],
    queryFn: CurrencyService.getPopularCurrencies,
  });

  const popularOptions = useMemo(() => {
    if (!(data?.length && dataPopular?.length)) return [];
    return filter(data, (item) => includes(dataPopular, item.value));
  }, [dataPopular, data]);

  useEffect(() => {
    if (!popularOptions?.length) return;
    form.setFieldsValue({ [name]: popularOptions[0].value });
  }, [popularOptions, form, name]);

  return (
    <div className="flex items-center">
      {selectedValue ? (
        <img src={getCurrencyImgSrc(selectedValue as string)} width={48} height={48} />
      ) : (
        <BaseIconSkeleton active />
      )}

      <BaseSelect
        name={name}
        width={130}
        dropdownWidth={250}
        variant="borderless"
        loading={isLoading || isLoadingPopular}
        labelRender={(option) => <p className="title-large text-white">{option.value}</p>}
        showSearch // Enables a search box in the dropdown for easier filtering, especially useful for large datasets
        virtual // Activates virtualization for the dropdown, rendering only the visible options to improve performance with large datasets
        filterOption={(input, option) => {
          return ((option?.value as string) ?? "").toLowerCase().includes(input.toLowerCase());
        }}
      >
        <OptGroup label="Most popular">
          {popularOptions.map((option) => (
            <Option key={`popular-${option.value}`} value={option.value}>
              {renderOption(option)}
            </Option>
          ))}
        </OptGroup>
        <OptGroup label="All currencies">
          {data?.map((option) => (
            <Option key={option.value} value={option.value}>
              {renderOption(option)}
            </Option>
          ))}
        </OptGroup>
      </BaseSelect>
    </div>
  );
};

export default CurrencySelect;
