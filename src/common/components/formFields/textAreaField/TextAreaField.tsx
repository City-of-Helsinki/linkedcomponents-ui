import { FieldProps } from 'formik';
import { TextAreaProps } from 'hds-react';
import React from 'react';

import sanitizeElementId from '../../../../utils/sanitizeElementId';
import TextArea from '../../textArea/TextArea';
import useCommonTextInputProps from '../hooks/useCommonTextInputProps';

type Props = FieldProps<string> & TextAreaProps;

const TextAreaField: React.FC<Props> = ({
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
    <TextArea
      {...rest}
      {...field}
      id={fieldId}
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
