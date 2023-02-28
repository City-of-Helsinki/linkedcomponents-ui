import { FieldProps } from 'formik';
import React from 'react';

import SingleKeywordSelector, {
  SingleKeywordSelectorProps,
} from '../../singleKeywordSelector/SingleKeywordSelector';
import useComboboxFieldProps from '../hooks/useComboboxFieldProps';

type Props = SingleKeywordSelectorProps & FieldProps<string>;

const SingleKeywordSelectorField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  form,
  helper,
  ...rest
}) => {
  const { errorText, handleBlur, handleChange } = useComboboxFieldProps({
    name,
    onBlur,
    onChange,
    value,
  });

  return (
    <SingleKeywordSelector
      {...rest}
      {...field}
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
