import { FieldProps, useField } from 'formik';
import isNil from 'lodash/isNil';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { getErrorText } from '../../../utils/validationUtils';
import TextEditor, { TextEditorProps } from '../textEditor/TextEditor';

type Props = { maxLength?: number } & FieldProps & TextEditorProps;

const TextEditorField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
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
