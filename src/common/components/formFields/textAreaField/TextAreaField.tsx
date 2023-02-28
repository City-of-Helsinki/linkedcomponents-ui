import { FieldProps } from 'formik';
import { TextAreaProps } from 'hds-react';
import React from 'react';

import TextArea from '../../textArea/TextArea';
import useCommonTextInputProps from '../hooks/useCommonTextInputProps';

type Props = FieldProps<string> & TextAreaProps;

const TextAreaField: React.FC<Props> = ({
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
    <TextArea
      {...rest}
      {...field}
      id={name}
      name={name}
      value={value}
      errorText={errorText}
      helperText={helperText || charsLeftText}
      invalid={!!errorText}
      maxLength={maxLength}
    />
  );
};

export default TextAreaField;
