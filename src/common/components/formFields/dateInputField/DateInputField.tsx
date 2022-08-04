import { FieldProps, useField } from 'formik';
import { DateInputProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { getErrorText } from '../../../../utils/validationUtils';
import DateInput from '../../dateInput/DateInput';

type Props = FieldProps & DateInputProps;

const DateInputField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  form,
  helperText,
  ...rest
}) => {
  const { t } = useTranslation();
  const [, { touched, error }] = useField(name);

  const errorText = getErrorText(error, touched, t);

  const handleBlur = () => {
    onBlur({ target: { id: name, value } });
  };

  const handleChange = (val: string) => {
    onChange({
      target: { id: name, value: val },
    });
  };

  return (
    <DateInput
      {...rest}
      {...field}
      id={name}
      name={name}
      errorText={errorText}
      helperText={helperText}
      invalid={Boolean(errorText)}
      onBlur={handleBlur}
      onChange={handleChange}
      value={value}
      disableConfirmation
    />
  );
};

export default DateInputField;
