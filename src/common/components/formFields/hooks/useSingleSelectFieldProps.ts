import { FormikHandlers, useField } from 'formik';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { OptionType } from '../../../../types';
import getValue from '../../../../utils/getValue';
import { getErrorText } from '../../../../utils/validationUtils';

type UseSingleSelectFieldPropsState = {
  errorText: string;
  handleBlur: () => void;
  handleChange: (
    selectedOptions: OptionType[],
    clickedOption: OptionType
  ) => void;
};

export type UseSingleSelectFieldPropsProps = {
  name: string;
  onBlur: FormikHandlers['handleBlur'];
  onChange: FormikHandlers['handleChange'];
  onChangeCb?: (val: string | null) => void;
  value: string;
};
const useSingleSelectFieldProps = ({
  name,
  onBlur,
  onChange,
  onChangeCb,
  value,
}: UseSingleSelectFieldPropsProps): UseSingleSelectFieldPropsState => {
  const { t } = useTranslation();
  const [, { touched, error }] = useField(name);

  const errorText = getErrorText(error, touched, t);

  const handleBlur = useCallback(() => {
    onBlur({ target: { id: name, value } });
  }, [name, onBlur, value]);

  const handleChange = useCallback(
    (_selectedOptions: OptionType[], clickedOption: OptionType) => {
      const newValue = getValue(clickedOption?.value, null);

      // Set timeout to prevent Android devices to end up to an infinite loop when changing value
      setTimeout(() => {
        onChange({
          target: { id: name, value: newValue },
        });

        if (onChangeCb) {
          onChangeCb(newValue);
        }
      }, 5);
    },
    [name, onChange, onChangeCb]
  );

  return { errorText, handleBlur, handleChange };
};

export default useSingleSelectFieldProps;
