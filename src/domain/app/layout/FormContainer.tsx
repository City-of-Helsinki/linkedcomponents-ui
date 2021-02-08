import classNames from 'classnames';
import React from 'react';

import styles from './formContainer.module.scss';

interface Props {
  className?: string;
}

const FormContainer: React.FC<Props> = ({ children, className }) => {
  return (
    <div className={styles.formContainer}>
      <div className={classNames(styles.contentWrapper, className)}>
        {children}
      </div>
    </div>
  );
};

export default FormContainer;
