import { FieldProps, useField } from 'formik';
import { PhoneInputProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { getErrorText } from '../../../utils/validationUtils';
import PhoneInput from '../phoneInput/PhoneInput';

type Props = FieldProps & PhoneInputProps;

const PhoneInputField: React.FC<Props> = ({
  field: { name, value, ...field },
  form,
  helperText,
  ...rest
}) => {
  const { t } = useTranslation();
  const [, { touched, error }] = useField(name);

  const errorText = getErrorText(error, touched, t);

  return (
    <PhoneInput
      {...rest}
      {...field}
      id={name}
      name={name}
      value={value}
      errorText={errorText}
      helperText={helperText}
      invalid={Boolean(errorText)}
    />
  );
};

export default PhoneInputField;
