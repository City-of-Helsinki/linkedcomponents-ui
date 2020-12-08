import classNames from 'classnames';
import { FieldProps } from 'formik';
import { RadioButtonProps } from 'hds-react';
import React from 'react';

import { OptionType } from '../../../types';
import RadioButton from '../radioButton/RadioButton';
import styles from './radioButtonGroupField.module.scss';

type Columns = 2 | 3 | 4;

type Props = {
  columns: Columns;
  options: OptionType[];
} & FieldProps &
  RadioButtonProps;

const RadioButtonGroupField: React.FC<Props> = ({
  columns = 2,
  field: { name, value, ...field },
  form,
  options,
  ...rest
}) => {
  return (
    <div
      className={classNames(
        styles.radioButtonsWrapper,
        styles[`columns${columns}`]
      )}
    >
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
