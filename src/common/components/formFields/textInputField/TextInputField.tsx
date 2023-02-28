import { FieldProps } from 'formik';
import { TextInputProps } from 'hds-react';
import React from 'react';

import TextInput from '../../textInput/TextInput';
import useCommonTextInputProps from '../hooks/useCommonTextInputProps';

type Props = FieldProps & TextInputProps;

const TextInputField: React.FC<Props> = ({
  field: { name, value, ...field },
  form,
  helperText,
  maxLength,
  ...rest
}) => {
  const { errorText, charsLeftText } = useCommonTextInputProps({
    maxLength,
    name,
    value,
  });

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
