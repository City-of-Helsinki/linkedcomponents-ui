import classNames from 'classnames';
import capitalize from 'lodash/capitalize';
import React from 'react';

import { INPUT_MAX_WIDTHS } from '../../../constants';
import styles from './fieldColumn.module.scss';

type MaxWidth = INPUT_MAX_WIDTHS.MEDIUM | INPUT_MAX_WIDTHS.LARGE;

type Props = {
  button?: React.ReactNode;
  className?: string;
  maxWidth?: MaxWidth;
};

const FieldColumn: React.FC<Props> = ({
  button,
  children,
  className,
  maxWidth = INPUT_MAX_WIDTHS.MEDIUM,
}) => {
  return (
    <div className={classNames(styles.fieldColumn, className)}>
      <div className={styles[`maxWidth${capitalize(maxWidth)}`]}>
        {children}
      </div>
      {button && <div>{button}</div>}
    </div>
  );
};

export default FieldColumn;
