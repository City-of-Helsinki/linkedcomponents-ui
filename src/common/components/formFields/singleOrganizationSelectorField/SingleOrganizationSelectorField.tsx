import { FieldProps } from 'formik';
import React from 'react';

import SingleOrganizationSelector, {
  SingleOrganizationSelectorProps,
} from '../../singleOrganizationSelector/SingleOrganizationSelector';
import useSingleSelectFieldProps from '../hooks/useSingleSelectFieldProps';

type Props = SingleOrganizationSelectorProps & FieldProps;

const SingleOrganizationSelectorField: React.FC<Props> = ({
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
    <SingleOrganizationSelector
      {...rest}
      {...field}
      name={name}
      onBlur={handleBlur}
      onChange={handleChange}
      disabled={disabled}
      value={value}
      helper={helper}
      error={errorText}
      invalid={!!errorText}
    />
  );
};

export default SingleOrganizationSelectorField;
