import { FieldProps } from 'formik';
import { TextInputProps } from 'hds-react';
import React from 'react';

import sanitizeElementId from '../../../../utils/sanitizeElementId';
import TextInput from '../../textInput/TextInput';
import useCommonTextInputProps from '../hooks/useCommonTextInputProps';

type Props = FieldProps & TextInputProps;

const TextInputField: React.FC<Props> = ({
  field: { name, value, ...field },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  form,
  helperText,
  maxLength,
  ...rest
}) => {
  const fieldId = sanitizeElementId(name);
  const { errorText, charsLeftText } = useCommonTextInputProps({
    maxLength,
    name,
    value,
  });

  return (
    <TextInput
      {...rest}
      {...field}
      id={fieldId}
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
