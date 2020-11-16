import classNames from 'classnames';
import capitalize from 'lodash/capitalize';
import React from 'react';

import { INPUT_MAX_WIDTHS } from '../../../constants';
import styles from './fieldArrayRow.module.scss';

type InputWidth = INPUT_MAX_WIDTHS.MEDIUM | INPUT_MAX_WIDTHS.LARGE;

type Props = {
  button?: React.ReactNode;
  input: React.ReactNode;
  inputWidth: InputWidth;
};

const FieldArrayRow: React.FC<Props> = ({ button, input, inputWidth }) => {
  return (
    <div
      className={classNames(
        styles.fieldArrayRow,
        styles[`inputWidth${capitalize(inputWidth)}`]
      )}
    >
      <div className={styles.inputWrapper}>{input}</div>
      <div className={styles.buttonWrapper}>{button}</div>
    </div>
  );
};

export default FieldArrayRow;
