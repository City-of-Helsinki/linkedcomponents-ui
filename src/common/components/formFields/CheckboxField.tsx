import { FieldProps } from 'formik';
import { CheckboxProps } from 'hds-react';
import React from 'react';

import { OptionType } from '../../../types';
import Checkbox from '../checkbox/Checkbox';

type Props = {
  options: OptionType[];
  visibleOptionAmount?: number;
} & FieldProps &
  CheckboxProps;

const LanguageCheckboxGroupField: React.FC<Props> = ({
  field: { name, value, ...field },
  form,
  label,
  options,
  visibleOptionAmount,
  ...rest
}) => {
  return (
    <Checkbox
      {...rest}
      {...field}
      id={`${name}`}
      name={name}
      checked={value}
      value={value}
      label={label}
    />
  );
};

export default LanguageCheckboxGroupField;
