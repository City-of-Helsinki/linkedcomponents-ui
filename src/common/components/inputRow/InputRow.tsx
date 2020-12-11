import classNames from 'classnames';
import React from 'react';

import styles from './inputRow.module.scss';

type InfoColumns = 4 | 5;

interface Props {
  children: React.ReactNode;
  className?: string;
  info?: React.ReactElement;
  infoColumns?: InfoColumns;
}

const InputRow: React.FC<Props> = ({
  children,
  className,
  info,
  infoColumns = 4,
}) => {
  return (
    <div
      className={classNames(
        styles.inputRow,
        styles[`infoColumns${infoColumns}`],
        className
      )}
    >
      {info && <div className={styles.infoColumn}>{info}</div>}
      <div className={styles.inputColumn}>{children}</div>
    </div>
  );
};

export default InputRow;
