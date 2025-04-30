import { FieldProps } from 'formik';
import React from 'react';

import SingleKeywordSelector, {
  SingleKeywordSelectorProps,
} from '../../singleKeywordSelector/SingleKeywordSelector';
import useSingleSelectFieldProps from '../hooks/useSingleSelectFieldProps';

type Props = SingleKeywordSelectorProps & FieldProps<string>;

const SingleKeywordSelectorField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  form,
  helper,
  disabled,
  ...rest
}) => {
  const { errorText, handleBlur, handleChange } = useSingleSelectFieldProps({
    disabled,
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
      helper={helper}
      error={errorText}
      invalid={!!errorText}
    />
  );
};

export default SingleKeywordSelectorField;
