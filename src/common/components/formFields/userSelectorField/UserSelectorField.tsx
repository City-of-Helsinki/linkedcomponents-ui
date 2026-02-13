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

  const memoizedTexts = React.useMemo(
    () => ({ ...texts, error: errorText }),
    [texts, errorText]
  );

  return (
    <UserSelector
      {...rest}
      {...field}
      disabled={disabled}
      name={name}
      onBlur={handleBlur}
      onClose={handleClose}
      value={value}
      texts={memoizedTexts}
      invalid={!!errorText}
    />
  );
};

export default UserSelectorField;
