import React from 'react';

import styles from './formContainer.module.scss';

const FormContainer: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return <div className={styles.formContainer}>{children}</div>;
};

export default FormContainer;
