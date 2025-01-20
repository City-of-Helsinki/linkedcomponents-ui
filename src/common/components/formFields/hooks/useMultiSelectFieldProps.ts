import { FormikHandlers, useField } from 'formik';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../../types';
import { getErrorText } from '../../../../utils/validationUtils';

type UseMultiSelectFieldPropsState = {
  errorText: string;
  handleBlur: () => void;
  handleChange: (selectedOptions: OptionType[]) => void;
};

export type UseMultiSelectFieldPropsProps = {
  name: string;
  onBlur: FormikHandlers['handleBlur'];
  onChange: FormikHandlers['handleChange'];
  value: string[];
};
const useMultiSelectFieldProps = ({
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

  const handleChange = (selectedOptions: OptionType[]) => {
    // TODO: HDS Combobox component allowes to remove value even if component
    // is disabled. Remove if statement when that behaviour is fixed to HDS

    // Set timeout to prevent Android devices to end up to an infinite loop when changing value
    setTimeout(() => {
      onChange({
        target: {
          id: name,
          value: selectedOptions.map((item) => item.value),
        },
      });
    }, 5);
  };

  return { errorText, handleBlur, handleChange };
};

export default useMultiSelectFieldProps;
