import { FormikHandlers, useField } from 'formik';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../../types';
import getValue from '../../../../utils/getValue';
import { getErrorText } from '../../../../utils/validationUtils';

type UseSingleSelectFieldPropsState = {
  errorText: string;
  handleBlur: () => void;
  handleChange: (selected: OptionType | null) => void;
};

export type UseSingleSelectFieldPropsProps = {
  disabled?: boolean;
  name: string;
  onBlur: FormikHandlers['handleBlur'];
  onChange: FormikHandlers['handleChange'];
  onChangeCb?: (val: string | null) => void;
  value: string;
};
const useSingleSelectFieldProps = ({
  disabled,
  name,
  onBlur,
  onChange,
  onChangeCb,
  value,
}: UseSingleSelectFieldPropsProps): UseSingleSelectFieldPropsState => {
  const { t } = useTranslation();
  const [, { touched, error }] = useField(name);

  const errorText = getErrorText(error, touched, t);

  const handleBlur = () => {
    onBlur({ target: { id: name, value } });
  };

  const handleChange = (selected: OptionType | null) => {
    // TODO: HDS Combobox component allowes to remove value even if component
    // is disabled. Remove if statement when that behaviour is fixed to HDS
    if (!disabled) {
      const newValue = getValue(selected?.value, null);
      onChange({
        target: { id: name, value: newValue },
      });

      if (onChangeCb) {
        onChangeCb(newValue);
      }
    }
  };

  return { errorText, handleBlur, handleChange };
};

export default useSingleSelectFieldProps;
