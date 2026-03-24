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

      // Defer change handling to avoid Android infinite-loop issues when value changes.
      queueMicrotask(() => {
        onChange({
          target: { id: name, value: newValue },
        });

        if (onChangeCb) {
          onChangeCb(newValue);
        }
      });
    },
    [name, onChange, onChangeCb]
  );

  return { errorText, handleBlur, handleChange };
};

export default useSingleSelectFieldProps;
