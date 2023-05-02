import { FieldProps } from 'formik';
import React from 'react';

import TextEditor, { TextEditorProps } from '../../textEditor/TextEditor';
import useCommonTextInputProps from '../hooks/useCommonTextInputProps';

type Props = { maxLength?: number } & FieldProps<string> & TextEditorProps;

const TextEditorField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
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

  const handleBlur = () => {
    onBlur({ target: { id: name, value } });
  };

  const handleChange = (value: string) => {
    onChange({ target: { id: name, value } });
  };

  return (
    <TextEditor
      {...rest}
      {...field}
      id={name}
      onBlur={handleBlur}
      onChange={handleChange}
      value={value}
      errorText={errorText}
      helperText={helperText || charsLeftText}
      invalid={!!errorText}
    />
  );
};

export default TextEditorField;
