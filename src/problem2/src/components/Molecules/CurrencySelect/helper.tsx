import { ICurrencyOption } from "@/interfaces/ICurrency";
import { getCurrencyImgSrc } from "@/utils/currency";
import dayjs from "dayjs";

export const renderOption = (option: ICurrencyOption) => (
  <span className="flex items-center py-1">
    <span className="mr-2">
      <img
        className="object-contain object-center"
        src={getCurrencyImgSrc(option.value as string)}
        width={24}
        height={24}
      />
    </span>
    <span className="flex flex-col">
      <span className="title-medium">{option.label}</span>
      {option.date && <span className="body-small">Last updated: {dayjs(option.date).format("DD MMMM YYYY")}</span>}
    </span>
  </span>
);
