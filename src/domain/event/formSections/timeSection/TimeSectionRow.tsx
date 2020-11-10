import React from 'react';

import styles from './timeSectionRow.module.scss';

type Props = {
  button?: React.ReactNode;
  input: React.ReactNode;
};

const TimeSectionRow: React.FC<Props> = ({ button, input }) => {
  return (
    <div className={styles.timeSectionRow}>
      <div className={styles.inputWrapper}>{input}</div>
      <div className={styles.buttonWrapper}>{button}</div>
    </div>
  );
};

export default TimeSectionRow;
