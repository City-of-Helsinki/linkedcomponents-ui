import { FieldProps } from 'formik';
import React from 'react';

import UserSelector, {
  UserSelectorProps,
} from '../../userSelector/UserSelector';
import useMultiSelectFieldProps from '../hooks/useMultiSelectFieldProps';

type Props = UserSelectorProps & FieldProps;

const UserSelectorField: React.FC<Props> = ({
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
    <UserSelector
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

export default UserSelectorField;
