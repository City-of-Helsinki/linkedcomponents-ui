import { Tooltip } from 'hds-react';
import React from 'react';

import { RequiredIndicator } from '../requiredIndicator/RequiredIndicator';
import styles from './fieldLabel.module.scss';

type FieldLabelProps = {
  hidden?: boolean;
  id?: string;
  inputId: string;
  isAriaLabelledBy?: boolean;
  label: string | React.ReactNode;
  required?: boolean;
  tooltipLabel?: string;
  tooltipButtonLabel?: string;
  tooltipText?: string;
};

const FieldLabel: React.FC<FieldLabelProps> = ({
  hidden,
  id,
  inputId,
  isAriaLabelledBy,
  label,
  required,
  tooltipLabel,
  tooltipButtonLabel,
  tooltipText,
  ...rest
}) => (
  <>
    <label
      id={id}
      {...((!isAriaLabelledBy || !id) && { htmlFor: inputId })}
      className={`${styles.label} ${hidden ? styles.hidden : ''}`}
      {...rest}
    >
      {label}
      {required && <RequiredIndicator />}
    </label>
    {tooltipText && (
      <Tooltip
        buttonClassName={styles.tooltipButton}
        tooltipLabel={tooltipLabel}
        buttonLabel={tooltipButtonLabel}
      >
        {tooltipText}
      </Tooltip>
    )}
  </>
);

export default FieldLabel;
