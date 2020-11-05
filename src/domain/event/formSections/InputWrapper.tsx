import classNames from 'classnames';
import React from 'react';

import styles from './inputWrapper.module.scss';

type Columns = 6 | 10;
type InputColumns = 4 | 5 | 6 | 7 | 8;
type Offset = 0 | 1 | 2;

type Props = {
  button?: React.ReactNode;
  columns: Columns;
  inputColumns: InputColumns;
  minWidth?: string;
  offset?: Offset;
};

const InputWrapper: React.FC<Props> = ({
  button,
  children,
  columns,
  inputColumns,
  minWidth,
  offset = 0,
}) => {
  return (
    <div
      className={classNames(styles.inputWrapper, styles[`columns${columns}`])}
    >
      <div
        className={classNames(
          styles[`inputColumns${inputColumns}`],
          styles[`offset${offset}`]
        )}
        style={{ minWidth }}
      >
        {children}
      </div>
      {button && <div>{button}</div>}
    </div>
  );
};

export default InputWrapper;
