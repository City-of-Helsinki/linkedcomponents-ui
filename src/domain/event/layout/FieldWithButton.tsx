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
  inputMaxWidth?: InputWidth;
};

const FieldWithButton: React.FC<Props> = ({
  button,
  children,
  hasLabel = true,
  inputMaxWidth = INPUT_MAX_WIDTHS.MEDIUM,
}) => {
  return (
    <div
      className={classNames(
        styles.fieldWithButton,
        styles[`width${capitalize(inputMaxWidth)}`],
        { [styles.hasLabel]: hasLabel }
      )}
    >
      <div className={styles.inputColumn}>{children}</div>
      <div className={styles.buttonColumn}>{button}</div>
    </div>
  );
};

export default FieldWithButton;
