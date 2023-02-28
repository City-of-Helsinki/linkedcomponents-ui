import { FieldProps } from 'formik';
import React from 'react';

import SingleOrganizationClassSelector, {
  SingleOrganizationClassSelectorProps,
} from '../../singleOrganizationClassSelector/SingleOrganizationClassSelector';
import useComboboxFieldProps from '../hooks/useComboboxFieldProps';

type Props = SingleOrganizationClassSelectorProps & FieldProps<string>;

const SingleOrganizationClassSelectorField: React.FC<Props> = ({
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
    <SingleOrganizationClassSelector
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

export default SingleOrganizationClassSelectorField;
