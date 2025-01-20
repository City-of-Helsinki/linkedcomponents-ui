import { FieldProps } from 'formik';
import React from 'react';

import { SingleComboboxProps } from '../../combobox/Combobox';
import PublisherSelector from '../../publisherSelector/PublisherSelector';
import useSingleSelectFieldProps from '../hooks/useSingleSelectFieldProps';

type Props = SingleComboboxProps<string | null> & FieldProps<string>;

const PublisherSelectorField: React.FC<Props> = ({
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
    <PublisherSelector
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

export default PublisherSelectorField;
