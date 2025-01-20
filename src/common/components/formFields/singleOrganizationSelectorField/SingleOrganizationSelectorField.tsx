import { FieldProps } from 'formik';
import React from 'react';

import { SingleComboboxProps } from '../../combobox/Combobox';
import SingleOrganizationSelector from '../../singleOrganizationSelector/SingleOrganizationSelector';
import useSingleSelectFieldProps from '../hooks/useSingleSelectFieldProps';

type Props = SingleComboboxProps<string | null> & FieldProps;

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

  return (
    <SingleOrganizationSelector
      {...rest}
      {...field}
      name={name}
      onBlur={handleBlur}
      onChange={handleChange}
      disabled={disabled}
      value={value}
      texts={{ ...texts, error: errorText }}
      invalid={!!errorText}
    />
  );
};

export default SingleOrganizationSelectorField;
