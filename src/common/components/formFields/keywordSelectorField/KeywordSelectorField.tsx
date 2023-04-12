import { FieldProps } from 'formik';
import React from 'react';

import KeywordSelector, {
  KeywordSelectorProps,
} from '../../keywordSelector/KeywordSelector';
import useMultiSelectFieldProps from '../hooks/useMultiSelectFieldProps';

type Props = KeywordSelectorProps & FieldProps;

const KeywordSelectorField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  form,
  helper,
  disabled,
  ...rest
}) => {
  const { errorText, handleBlur, handleChange } = useMultiSelectFieldProps({
    disabled,
    name,
    onBlur,
    onChange,
    value,
  });

  return (
    <KeywordSelector
      {...rest}
      {...field}
      disabled={disabled}
      name={name}
      onBlur={handleBlur}
      onChange={handleChange}
      value={value}
      helper={helper}
      error={errorText}
      invalid={!!errorText}
    />
  );
};

export default KeywordSelectorField;
