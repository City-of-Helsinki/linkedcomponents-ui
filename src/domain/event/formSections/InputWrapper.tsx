import classNames from 'classnames';
import capitalize from 'lodash/capitalize';
import React from 'react';

import { INPUT_MAX_WIDTHS } from '../../../constants';
import styles from './inputWrapper.module.scss';

type Columns = 5 | 6 | 7 | 8 | 9 | 10;
type InputColumns = 4 | 5 | 6 | 7 | 8;
type MaxWidth = INPUT_MAX_WIDTHS.MEDIUM | INPUT_MAX_WIDTHS.LARGE;
type Offset = 0 | 1 | 2;

type Props = {
  button?: React.ReactNode;
  className?: string;
  columns: Columns;
  inputColumns: InputColumns;
  maxWidth?: MaxWidth;
  offset?: Offset;
};

const InputWrapper: React.FC<Props> = ({
  button,
  children,
  className,
  columns,
  inputColumns,
  maxWidth,
  offset = 0,
}) => {
  return (
    <div
      className={classNames(
        styles.inputWrapper,
        styles[`columns${columns}`],
        className
      )}
    >
      <div
        className={classNames(
          styles[`inputColumns${inputColumns}`],
          styles[`offset${offset}`],
          maxWidth && styles[`maxWidth${capitalize(maxWidth)}`]
        )}
        style={{ maxWidth }}
      >
        {children}
      </div>
      {button && <div>{button}</div>}
    </div>
  );
};

export default InputWrapper;
