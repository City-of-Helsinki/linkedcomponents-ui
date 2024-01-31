import { OptionType } from '../../../types';

const VAT_PERCENTAGES = [24, 14, 10, 0];

const useVatOptions = (): OptionType[] => {
  return VAT_PERCENTAGES.map((vat) => ({
    label: `${vat} %`,
    value: `${vat}.00`,
  }));
};

export default useVatOptions;
