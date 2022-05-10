import classNames from 'classnames';
import capitalize from 'lodash/capitalize';
import React from 'react';

import { INPUT_MAX_WIDTHS } from '../../../constants';
import styles from './fieldColumn.module.scss';

type MaxWidth = INPUT_MAX_WIDTHS.MEDIUM | INPUT_MAX_WIDTHS.LARGE;

type Props = {
  className?: string;
  maxWidth?: MaxWidth;
};

const FieldColumn: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  className,
  maxWidth = INPUT_MAX_WIDTHS.MEDIUM,
}) => {
  return (
    <div className={classNames(styles.fieldColumn, className)}>
      <div className={styles[`maxWidth${capitalize(maxWidth)}`]}>
        {children}
      </div>
    </div>
  );
};

export default FieldColumn;
