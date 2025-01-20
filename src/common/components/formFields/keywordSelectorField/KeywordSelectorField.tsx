import { FieldProps } from 'formik';
import React from 'react';

import KeywordSelector from '../../keywordSelector/KeywordSelector';
import { MultiSelectPropsWithValue } from '../../select/Select';
import useMultiSelectFieldProps from '../hooks/useMultiSelectFieldProps';

type Props = MultiSelectPropsWithValue<string> & FieldProps;

const KeywordSelectorField: React.FC<Props> = ({
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
    <KeywordSelector
      {...rest}
      {...field}
      disabled={disabled}
      name={name}
      onBlur={handleBlur}
      handleClose={handleClose}
      value={value}
      texts={{ ...texts, error: errorText }}
      invalid={!!errorText}
    />
  );
};

export default KeywordSelectorField;
