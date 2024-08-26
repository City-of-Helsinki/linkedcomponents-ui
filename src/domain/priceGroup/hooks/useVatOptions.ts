import useLocale from '../../../hooks/useLocale';
import { OptionType } from '../../../types';

const VAT_PERCENTAGES = [25.5, 14, 10, 0];

const useVatOptions = (): OptionType[] => {
  const locale = useLocale();

  return VAT_PERCENTAGES.map((vat) => ({
    label: `${vat.toLocaleString(locale)} %`,
    value: vat.toFixed(2),
  }));
};

export default useVatOptions;
