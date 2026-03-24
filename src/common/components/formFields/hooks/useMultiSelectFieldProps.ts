import { FormikHandlers, useField } from 'formik';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../../types';
import { getErrorText } from '../../../../utils/validationUtils';

type UseMultiSelectFieldPropsState = {
  errorText: string;
  handleBlur: () => void;
  handleClose: (selectedOptions: OptionType[]) => void;
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

  const handleClose = (selectedOptions: OptionType[]) => {
    // Defer change handling to avoid Android infinite-loop issues when value changes.
    queueMicrotask(() => {
      onChange({
        target: {
          id: name,
          value: selectedOptions.map((item) => item.value),
        },
      });
    });
  };

  return { errorText, handleBlur, handleClose };
};

export default useMultiSelectFieldProps;
