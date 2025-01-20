import { FieldProps } from 'formik';
import React from 'react';

import { MultiSelectPropsWithValue } from '../../select/Select';
import UserSelector from '../../userSelector/UserSelector';
import useMultiSelectFieldProps from '../hooks/useMultiSelectFieldProps';

type Props = MultiSelectPropsWithValue<string> & FieldProps;

const UserSelectorField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  form,
  texts,
  disabled,
  ...rest
}) => {
  const { errorText, handleBlur, handleClose } = useMultiSelectFieldProps({
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
      onClose={handleClose}
      value={value}
      texts={{ ...texts, error: errorText }}
      invalid={!!errorText}
    />
  );
};

export default UserSelectorField;
