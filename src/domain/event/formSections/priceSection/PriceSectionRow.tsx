import React from 'react';

import styles from './priceSectionRow.module.scss';

type Props = {
  button?: React.ReactNode;
  input: React.ReactNode;
};

const PriceSectionRow: React.FC<Props> = ({ button, input }) => {
  return (
    <div className={styles.priceSectionRow}>
      <div className={styles.inputWrapper}>{input}</div>
      <div className={styles.buttonWrapper}>{button}</div>
    </div>
  );
};

export default PriceSectionRow;
