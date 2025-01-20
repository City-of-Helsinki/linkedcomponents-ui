import { FieldProps } from 'formik';
import React from 'react';

import { SingleComboboxProps } from '../../combobox/Combobox';
import SingleKeywordSelector from '../../singleKeywordSelector/SingleKeywordSelector';
import useSingleSelectFieldProps from '../hooks/useSingleSelectFieldProps';

type Props = SingleComboboxProps<string> & FieldProps<string>;

const SingleKeywordSelectorField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  form,
  texts,
  disabled,
  ...rest
}) => {
  const { errorText, handleBlur, handleChange } = useSingleSelectFieldProps({
    name,
    onBlur,
    onChange,
    value,
  });

  return (
    <SingleKeywordSelector
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

export default SingleKeywordSelectorField;
