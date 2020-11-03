import classNames from 'classnames';
import React from 'react';

import styles from './formGroup.module.scss';

type Props = {
  children: React.ReactNode;
  className?: string;
};

const FormGroup: React.FC<Props> = ({ children, className }) => {
  return (
    <div className={classNames(styles.formGroup, className)}>{children}</div>
  );
};

export default FormGroup;
