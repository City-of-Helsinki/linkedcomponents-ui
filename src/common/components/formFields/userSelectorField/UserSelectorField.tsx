import { FieldProps } from 'formik';
import React from 'react';

import { MultiComboboxProps } from '../../combobox/Combobox';
import UserSelector from '../../userSelector/UserSelector';
import useMultiSelectFieldProps from '../hooks/useMultiSelectFieldProps';

type Props = MultiComboboxProps<string> & FieldProps;

const UserSelectorField: React.FC<Props> = ({
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
    <UserSelector
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

export default UserSelectorField;
