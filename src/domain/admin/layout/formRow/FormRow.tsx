import classNames from 'classnames';
import React from 'react';

import styles from './formRow.module.scss';

interface Props {
  className?: string;
  withBorder?: boolean;
}

const FormRow: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  className,
  withBorder,
}) => {
  return (
    <div
      className={classNames(
        styles.formRow,
        { [styles.withBorder]: withBorder },
        className
      )}
    >
      <div className={styles.input}>{children}</div>
    </div>
  );
};

export default FormRow;
