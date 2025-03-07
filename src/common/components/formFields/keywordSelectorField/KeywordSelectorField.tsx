import { FieldProps } from 'formik';
import React from 'react';

import { MultiComboboxProps } from '../../combobox/Combobox';
import KeywordSelector from '../../keywordSelector/KeywordSelector';
import useMultiSelectFieldProps from '../hooks/useMultiSelectFieldProps';

type Props = MultiComboboxProps<string> & FieldProps;

const KeywordSelectorField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  form,
  texts,
  disabled,
  ...rest
}) => {
  const { errorText, handleBlur, handleChange } = useMultiSelectFieldProps({
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
      texts={{ ...texts, error: errorText }}
      invalid={!!errorText}
    />
  );
};

export default KeywordSelectorField;
