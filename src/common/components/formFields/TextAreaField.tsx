import { FieldProps, useField } from 'formik';
import { TextAreaProps } from 'hds-react';
import isNil from 'lodash/isNil';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { getErrorText } from '../../../utils/validationUtils';
import TextArea from '../textArea/TextArea';

type Props = FieldProps & TextAreaProps;

const TextAreaField: React.FC<Props> = ({
  field: { name, value, ...field },
  form,
  helperText,
  maxLength,
  ...rest
}) => {
  const { t } = useTranslation();
  const [, { touched, error }] = useField(name);

  const errorText = React.useMemo(() => getErrorText(error, touched, t), [
    error,
    t,
    touched,
  ]);

  const charsLeft = !isNil(maxLength) ? maxLength - value.length : undefined;
  const charsLeftText = !isNil(charsLeft)
    ? t('form.validation.string.charsLeft', { count: charsLeft })
    : undefined;

  return (
    <TextArea
      {...rest}
      {...field}
      id={name}
      name={name}
      value={value}
      helperText={errorText || helperText || charsLeftText}
      invalid={!!errorText}
      maxLength={maxLength}
    />
  );
};

export default TextAreaField;
