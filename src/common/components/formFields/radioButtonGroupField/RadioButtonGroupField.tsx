import classNames from 'classnames';
import { FieldProps } from 'formik';
import React from 'react';

import { OptionType } from '../../../../types';
import RadioButton from '../../radioButton/RadioButton';
import { RequiredIndicator } from '../../requiredIndicator/RequiredIndicator';
import styles from './radioButtonGroupField.module.scss';

type Columns = 1 | 2 | 3 | 4;

type Props = {
  className?: string;
  columns: Columns;
  label?: string;
  options: OptionType[];
  required?: boolean;
} & FieldProps &
  React.HTMLProps<HTMLFieldSetElement>;

const RadioButtonGroupField: React.FC<Props> = ({
  className,
  columns = 2,
  field: { name, value, ...field },
  label,
  form,
  options,
  required,
  ...rest
}) => {
  return (
    <fieldset
      className={classNames(styles.radioButtonGroup, className)}
      {...rest}
    >
      <legend className={styles.label}>
        {label} {required && <RequiredIndicator />}
      </legend>
      <div
        className={classNames(
          styles.radioButtonsWrapper,
          styles[`columns${columns}`]
        )}
      >
        {options.map((option, index) => (
          <RadioButton
            key={index}
            {...field}
            id={`${name}-${option.value}`}
            name={name}
            checked={value === option.value}
            value={option.value}
            label={option.label}
          />
        ))}
      </div>
    </fieldset>
  );
};

export default RadioButtonGroupField;
