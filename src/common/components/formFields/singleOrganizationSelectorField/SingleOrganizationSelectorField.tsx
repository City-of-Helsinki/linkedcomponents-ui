import { FieldProps } from 'formik';
import React from 'react';

import SingleOrganizationSelector, {
  SingleOrganizationSelectorProps,
} from '../../singleOrganizationSelector/SingleOrganizationSelector';
import useComboboxFieldProps from '../hooks/useComboboxFieldProps';

type Props = SingleOrganizationSelectorProps & FieldProps;

const SingleOrganizationSelectorField: React.FC<Props> = ({
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
    <SingleOrganizationSelector
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

export default SingleOrganizationSelectorField;
