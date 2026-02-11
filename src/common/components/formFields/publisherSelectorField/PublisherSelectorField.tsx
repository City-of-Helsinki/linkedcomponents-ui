import { FieldProps } from 'formik';
import React from 'react';

import PublisherSelector from '../../publisherSelector/PublisherSelector';
import { SelectPropsWithValue } from '../../select/Select';
import useSingleSelectFieldProps from '../hooks/useSingleSelectFieldProps';

type Props = SelectPropsWithValue<string | null> & FieldProps<string>;

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

  const memoizedTexts = React.useMemo(
    () => ({ ...texts, error: errorText }),
    [texts, errorText]
  );

  return (
    <PublisherSelector
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

export default PublisherSelectorField;
