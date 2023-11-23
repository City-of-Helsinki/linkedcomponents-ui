import { FieldProps, useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { getErrorText } from '../../../../utils/validationUtils';
import DateInput, { DateInputProps } from '../../dateInput/DateInput';

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

  const handleChange = (val: Date | null) => {
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
      disableConfirmation
      errorText={errorText}
      helperText={helperText}
      invalid={Boolean(errorText)}
      onBlur={handleBlur}
      onChange={handleChange}
      // Value can be string if it's restored from the session storage in FormikPersist
      // Convert value to date in such case
      value={typeof value === 'string' ? new Date(value) : value}
    />
  );
};

export default DateInputField;
