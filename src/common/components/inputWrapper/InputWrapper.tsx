import classNames from 'classnames';
import { Tooltip } from 'hds-react';
import React, { CSSProperties, FC, ReactNode } from 'react';

import styles from './inputWrapper.module.scss';

export type InputWrapperProps = {
  children?: ReactNode;
  className?: string;
  hasIcon?: boolean;
  helperText?: string;
  hideLabel?: boolean;
  id: string;
  invalid?: boolean;
  labelId?: string;
  labelText?: string;
  style?: CSSProperties;
  tooltipLabel?: string;
  tooltipText?: string;
  tooltipButtonLabel?: string;
  required?: boolean;
};

const InputWrapper: FC<InputWrapperProps> = React.forwardRef<
  HTMLDivElement,
  InputWrapperProps
>(
  (
    {
      children,
      className = '',
      hasIcon = false,
      helperText,
      hideLabel = false,
      id,
      invalid = false,
      labelId,
      labelText,
      style,
      tooltipLabel,
      tooltipText,
      tooltipButtonLabel,
      required,
    },
    ref
  ) => (
    <div
      className={classNames(
        styles.root,
        hasIcon && styles.hasIcon,
        invalid && styles.invalid,
        className
      )}
      ref={ref}
      style={style}
    >
      {labelText && (
        <label
          id={labelId}
          htmlFor={id}
          className={`${styles.label} ${hideLabel ? styles.hiddenLabel : ''}`}
        >
          {labelText}
          {required && <span className={styles.requiredIndicator}>*</span>}
        </label>
      )}
      {tooltipText && (
        <Tooltip
          buttonLabel={tooltipButtonLabel || ''}
          tooltipLabel={tooltipLabel || ''}
        >
          {tooltipText}
        </Tooltip>
      )}
      <div className={classNames(styles.inputWrapper)}>{children}</div>
      {helperText && <div className={styles.helperText}>{helperText}</div>}
    </div>
  )
);

export default InputWrapper;
