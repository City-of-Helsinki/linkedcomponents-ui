import { FieldProps, useField } from 'formik';
import { TextInputProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { getStringErrorText } from '../../../utils/validationUtils';
import Datepicker from '../datepicker/Datepicker';

type Props = {
  maxBookingDate?: Date;
  minBookingDate?: Date;
} & FieldProps &
  Omit<TextInputProps, 'form'>;

const DatepickerField: React.FC<Props> = ({
  field: { name, onChange, onBlur, ...field },
  form,
  helperText,
  ...rest
}) => {
  const { t } = useTranslation();
  const [, { touched, error }] = useField(name);

  const errorText = React.useMemo(() => getStringErrorText(error, touched, t), [
    error,
    t,
    touched,
  ]);

  const handleBlur = React.useCallback(() => {
    onBlur({
      target: {
        id: name,
      },
    });
  }, [name, onBlur]);

  const handleChange = (val?: Date | null) => {
    onChange({
      target: {
        id: name,
        value: val,
      },
    });
  };

  return (
    <Datepicker
      {...field}
      {...rest}
      id={name}
      name={name}
      onBlur={handleBlur}
      onChange={handleChange}
      helperText={errorText || helperText}
      invalid={!!errorText}
    />
  );
};

export default DatepickerField;
