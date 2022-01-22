import React from 'react';

import styles from './titleRow.module.scss';

type TitleRowProps = {
  button: React.ReactElement;
  title: string;
};

const TitleRow = ({ button, title }: TitleRowProps): React.ReactElement => {
  return (
    <div className={styles.titleRow}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.buttonWrapper}>{button}</div>
    </div>
  );
};

export default TitleRow;
