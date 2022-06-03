import React from 'react';

import styles from '../datepicker.module.scss';

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const MonthNavButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  ...props
}) => (
  <button
    className={styles.monthNavButton}
    onClick={onClick}
    type="button"
    {...props}
  >
    {children}
  </button>
);

export default MonthNavButton;
