import { FieldProps } from 'formik';
import React from 'react';

import { SelectPropsWithValue } from '../../select/Select';
import SingleOrganizationSelector from '../../singleOrganizationSelector/SingleOrganizationSelector';
import useSingleSelectFieldProps from '../hooks/useSingleSelectFieldProps';

type Props = SelectPropsWithValue<string | null> & FieldProps;

const SingleOrganizationSelectorField: React.FC<Props> = ({
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
    <SingleOrganizationSelector
      {...rest}
      {...field}
      name={name}
      onBlur={handleBlur}
      onChange={handleChange}
      disabled={disabled}
      value={value}
      texts={memoizedTexts}
      invalid={!!errorText}
    />
  );
};

export default SingleOrganizationSelectorField;
