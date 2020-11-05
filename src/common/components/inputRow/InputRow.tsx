import classNames from 'classnames';
import React from 'react';

import styles from './inputRow.module.scss';

type InfoWidth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

interface Props {
  children: React.ReactNode;
  info?: React.ReactElement;
  infoWidth?: InfoWidth;
}

const InputRow: React.FC<Props> = ({ children, info, infoWidth = 4 }) => {
  return (
    <div
      className={classNames(styles.inputRow, styles[`infoWidth${infoWidth}`])}
    >
      {info && <div className={styles.infoColumn}>{info}</div>}
      <div className={styles.inputColumn}>{children}</div>
    </div>
  );
};

export default InputRow;
