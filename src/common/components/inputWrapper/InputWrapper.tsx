import classNames from 'classnames';
import React from 'react';

import FieldLabel from '../fieldLabel/FieldLabel';
import styles from './inputWrapper.module.scss';

type InputWrapperProps = {
  children?: React.ReactNode;
  className?: string;
  hasIcon?: boolean;
  helperText?: string;
  hideLabel?: boolean;
  id: string;
  invalid?: boolean;
  label?: string | React.ReactNode;
  labelText?: string;
  required?: boolean;
  style?: React.CSSProperties;
  tooltipLabel?: string;
  tooltipText?: string;
  tooltipButtonLabel?: string;
};

const InputWrapper = ({
  children,
  className = '',
  hasIcon = false,
  helperText,
  hideLabel = false,
  id,
  invalid = false,
  label,
  labelText,
  required = false,
  style,
  tooltipLabel,
  tooltipText,
  tooltipButtonLabel,
}: InputWrapperProps) => (
  <div
    className={classNames(
      styles.root,
      { [styles.hasIcon]: hasIcon, [styles.invalid]: invalid },
      className
    )}
    style={style}
  >
    {(label || labelText) && (
      <FieldLabel
        inputId={id}
        hidden={hideLabel}
        label={label || labelText}
        required={required}
        tooltipLabel={tooltipLabel}
        tooltipButtonLabel={tooltipButtonLabel}
        tooltipText={tooltipText}
      />
    )}
    <div className={classNames(styles.inputWrapper)}>{children}</div>
    {helperText && <div className={styles.helperText}>{helperText}</div>}
  </div>
);

export default InputWrapper;
