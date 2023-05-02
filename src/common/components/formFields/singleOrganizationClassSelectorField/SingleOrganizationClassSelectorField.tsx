import { FieldProps } from 'formik';
import React from 'react';

import SingleOrganizationClassSelector, {
  SingleOrganizationClassSelectorProps,
} from '../../singleOrganizationClassSelector/SingleOrganizationClassSelector';
import useSingleSelectFieldProps from '../hooks/useSingleSelectFieldProps';

type Props = SingleOrganizationClassSelectorProps & FieldProps<string>;

const SingleOrganizationClassSelectorField: React.FC<Props> = ({
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
    <SingleOrganizationClassSelector
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

export default SingleOrganizationClassSelectorField;
