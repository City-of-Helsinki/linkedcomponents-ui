import classNames from 'classnames';
import capitalize from 'lodash/capitalize';
import React from 'react';

import { INPUT_MAX_WIDTHS } from '../../../constants';
import styles from './fieldWithButton.module.scss';

type InputWidth = INPUT_MAX_WIDTHS.MEDIUM | INPUT_MAX_WIDTHS.LARGE;

type Props = {
  button?: React.ReactNode;
  children: React.ReactNode;
  hasLabel?: boolean;
  labelMaxWidth?: InputWidth;
};

const FieldWithButton: React.FC<Props> = ({
  button,
  children,
  hasLabel = true,
  labelMaxWidth = INPUT_MAX_WIDTHS.MEDIUM,
}) => {
  return (
    <div
      className={classNames(
        styles.fieldWithButton,
        styles[`width${capitalize(labelMaxWidth)}`],
        { [styles.hasLabel]: hasLabel }
      )}
    >
      <div className={styles.fieldColumn}>{children}</div>
      <div className={styles.buttonColumn}>{button}</div>
    </div>
  );
};

export default FieldWithButton;
