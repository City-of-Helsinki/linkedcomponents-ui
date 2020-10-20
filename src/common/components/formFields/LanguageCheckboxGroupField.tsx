import { FieldProps } from 'formik';
import { Checkbox, CheckboxProps } from 'hds-react';
import React from 'react';

import { OptionType } from '../../../types';

type Props = {
  options: OptionType[];
} & FieldProps &
  CheckboxProps;

const LanguageCheckboxGroupField: React.FC<Props> = ({
  field: { name, value, ...field },
  form,
  options,
  ...rest
}) => {
  return (
    <>
      {options.map((option, index) => {
        const checked = value.includes(option.value);
        const disabled = checked && value.length === 1;
        return (
          <Checkbox
            key={index}
            {...rest}
            {...field}
            id={`${name}-${option.value}`}
            name={name}
            checked={value.includes(option.value)}
            disabled={disabled}
            value={option.value}
            label={option.label}
          />
        );
      })}
    </>
  );
};

export default LanguageCheckboxGroupField;
