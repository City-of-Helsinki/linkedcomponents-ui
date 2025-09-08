import { FieldProps } from 'formik';
import React from 'react';

import { SelectPropsWithValue } from '../../select/Select';
import SingleOrganizationClassSelector from '../../singleOrganizationClassSelector/SingleOrganizationClassSelector';
import useSingleSelectFieldProps from '../hooks/useSingleSelectFieldProps';

type Props = SelectPropsWithValue<string | null> & FieldProps<string>;

const SingleOrganizationClassSelectorField: React.FC<Props> = ({
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

  return (
    <SingleOrganizationClassSelector
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

export default SingleOrganizationClassSelectorField;
