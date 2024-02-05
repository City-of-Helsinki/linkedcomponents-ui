import classNames from 'classnames';
import React, { PropsWithChildren } from 'react';

import {
  DEFAULT_SPLITTED_ROW_TYPE,
  SPLITTED_ROW_TYPE,
} from '../../../../constants';
import styles from './splittedRow.module.scss';

type SplittedRowProps = {
  className?: string;
  type?: SPLITTED_ROW_TYPE;
};

const SplittedRow: React.FC<PropsWithChildren<SplittedRowProps>> = ({
  children,
  className,
  type = DEFAULT_SPLITTED_ROW_TYPE,
}) => {
  return (
    <div className={classNames(styles.splittedRow, styles[type], className)}>
      {children}
    </div>
  );
};

export default SplittedRow;
