import { FormikHandlers, useField } from 'formik';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../../types';
import { getErrorText } from '../../../../utils/validationUtils';

type UseMultiSelectFieldPropsState = {
  errorText: string;
  handleBlur: () => void;
  handleChange: (selected: OptionType[]) => void;
};

export type UseMultiSelectFieldPropsProps = {
  disabled?: boolean;
  name: string;
  onBlur: FormikHandlers['handleBlur'];
  onChange: FormikHandlers['handleChange'];
  value: string[];
};
const useMultiSelectFieldProps = ({
  disabled,
  name,
  onBlur,
  onChange,
  value,
}: UseMultiSelectFieldPropsProps): UseMultiSelectFieldPropsState => {
  const { t } = useTranslation();
  const [, { touched, error }] = useField(name);

  const errorText = getErrorText(error, touched, t);

  const handleBlur = () => {
    onBlur({ target: { id: name, value } });
  };

  const handleChange = (selected: OptionType[]) => {
    // TODO: HDS Combobox component allowes to remove value even if component
    // is disabled. Remove if statement when that behaviour is fixed to HDS
    if (!disabled) {
      // Set timeout to prevent Android devices to end up to an infinite loop when changing value
      setTimeout(() => {
        onChange({
          target: { id: name, value: selected.map((item) => item.value) },
        });
      }, 5);
    }
  };

  return { errorText, handleBlur, handleChange };
};

export default useMultiSelectFieldProps;
