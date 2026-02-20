import { FieldProps } from 'formik';
import React from 'react';

import { SelectPropsWithValue } from '../../select/Select';
import SingleKeywordSelector from '../../singleKeywordSelector/SingleKeywordSelector';
import useSingleSelectFieldProps from '../hooks/useSingleSelectFieldProps';

type Props = SelectPropsWithValue<string> & FieldProps<string>;

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

  const memoizedTexts = React.useMemo(
    () => ({ ...texts, error: errorText }),
    [texts, errorText]
  );

  return (
    <SingleKeywordSelector
      {...rest}
      {...field}
      disabled={disabled}
      name={name}
      onBlur={handleBlur}
      onChange={handleChange}
      value={value}
      texts={memoizedTexts}
      invalid={!!errorText}
    />
  );
};

export default SingleKeywordSelectorField;
