import { FormikHandlers, useField } from 'formik';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../../types';
import getValue from '../../../../utils/getValue';
import { getErrorText } from '../../../../utils/validationUtils';

type UseComboboxFieldPropsState = {
  errorText: string;
  handleBlur: () => void;
  handleChange: (selected: OptionType | null) => void;
};

type Props = {
  name: string;
  onBlur: FormikHandlers['handleBlur'];
  onChange: FormikHandlers['handleChange'];
  value: string;
};
const useComboboxFieldProps = ({
  name,
  onBlur,
  onChange,
  value,
}: Props): UseComboboxFieldPropsState => {
  const { t } = useTranslation();
  const [, { touched, error }] = useField(name);

  const errorText = getErrorText(error, touched, t);

  const handleBlur = () => {
    onBlur({ target: { id: name, value } });
  };

  const handleChange = (selected: OptionType | null) => {
    onChange({ target: { id: name, value: getValue(selected?.value, null) } });
  };

  return { errorText, handleBlur, handleChange };
};

export default useComboboxFieldProps;
