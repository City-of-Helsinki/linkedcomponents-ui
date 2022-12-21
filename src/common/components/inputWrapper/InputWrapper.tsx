import classNames from 'classnames';
import React, { FocusEvent } from 'react';

import FieldLabel from '../fieldLabel/FieldLabel';
import styles from './inputWrapper.module.scss';

export type InputWrapperProps = {
  children?: React.ReactNode;
  className?: string;
  errorText?: string;
  hasIcon?: boolean;
  helperText?: string;
  hideLabel?: boolean;
  id: string;
  invalid?: boolean;
  isAriaLabelledBy?: boolean;
  label?: string | React.ReactNode;
  labelId?: string;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  style?: React.CSSProperties;
  successText?: string;
  infoText?: string;
  tooltipLabel?: string;
  tooltipText?: string;
  tooltipButtonLabel?: string;
};

const InputWrapper: React.FC<InputWrapperProps> = ({
  children,
  className = '',
  errorText,
  hasIcon = false,
  helperText,
  hideLabel = false,
  id,
  invalid = false,
  isAriaLabelledBy = false,
  label,
  labelId,
  onBlur,
  required = false,
  style,
  successText,
  infoText,
  tooltipLabel,
  tooltipText,
  tooltipButtonLabel,
}) => (
  <div
    onBlur={onBlur}
    className={classNames(
      styles.root,
      {
        [styles.hasIcon]: hasIcon,
        [styles.invalid]: invalid,
        [styles.success]: successText,
      },
      className
    )}
    style={style}
  >
    {label && (
      <FieldLabel
        id={labelId}
        inputId={id}
        isAriaLabelledBy={isAriaLabelledBy}
        hidden={hideLabel}
        label={label}
        required={required}
        tooltipLabel={tooltipLabel}
        tooltipButtonLabel={tooltipButtonLabel}
        tooltipText={tooltipText}
      />
    )}
    <div className={classNames(styles.inputWrapper)}>{children}</div>
    {errorText && (
      <div className={styles.errorText} id={`${id}-error`}>
        {errorText}
      </div>
    )}
    {successText && (
      <div className={styles.successText} id={`${id}-success`}>
        {successText}
      </div>
    )}
    {infoText && (
      <div className={styles.infoText} id={`${id}-info`}>
        {infoText}
      </div>
    )}
    {helperText && (
      <div className={styles.helperText} id={`${id}-helper`}>
        {helperText}
      </div>
    )}
  </div>
);

export default InputWrapper;
