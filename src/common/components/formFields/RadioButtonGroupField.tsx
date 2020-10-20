import { FieldProps } from 'formik';
import { RadioButton, RadioButtonProps } from 'hds-react';
import React from 'react';

import { OptionType } from '../../../types';

type Props = {
  options: OptionType[];
} & FieldProps &
  RadioButtonProps;

const RadioButtonGroupField: React.FC<Props> = ({
  field: { name, value, ...field },
  form,
  options,
  ...rest
}) => {
  return (
    <>
      {options.map((option, index) => (
        <RadioButton
          key={index}
          {...rest}
          {...field}
          id={`${name}-${option.value}`}
          name={name}
          checked={value === option.value}
          value={option.value}
          label={option.label}
        />
      ))}
    </>
  );
};

export default RadioButtonGroupField;
