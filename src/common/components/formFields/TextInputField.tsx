import { FieldProps, useField } from 'formik';
import { TextInputProps } from 'hds-react';
import isNil from 'lodash/isNil';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { getErrorText } from '../../../utils/validationUtils';
import TextInput from '../textInput/TextInput';

type Props = FieldProps & TextInputProps;

const TextInputField: React.FC<Props> = ({
  field: { name, value, ...field },
  form,
  helperText,
  maxLength,
  ...rest
}) => {
  const { t } = useTranslation();
  const [, { touched, error }] = useField(name);

  const errorText = getErrorText(error, touched, t);

  const charsLeft = !isNil(maxLength) ? maxLength - value.length : undefined;
  const charsLeftText = !isNil(charsLeft)
    ? t('form.validation.string.charsLeft', { count: charsLeft })
    : undefined;

  return (
    <TextInput
      {...rest}
      {...field}
      id={name}
      name={name}
      value={value}
      errorText={errorText}
      helperText={helperText || charsLeftText}
      invalid={Boolean(errorText)}
      maxLength={maxLength}
    />
  );
};

export default TextInputField;
