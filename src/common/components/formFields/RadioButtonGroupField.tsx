import { FieldProps } from 'formik';
import { RadioButton, RadioButtonProps } from 'hds-react';
import React from 'react';

import { OptionType } from '../../../types';
import styles from './radioButtonGroupField.module.scss';

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
    <div className={styles.radioButtonsWrapper}>
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
    </div>
  );
};

export default RadioButtonGroupField;
