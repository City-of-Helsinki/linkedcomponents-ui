import React from 'react';

import styles from './titleRow.module.scss';

type TitleRowProps = {
  button?: React.ReactElement;
  editingInfo?: React.ReactElement;
  title: string;
};

const TitleRow = ({
  button,
  editingInfo,
  title,
}: TitleRowProps): React.ReactElement => {
  return (
    <div className={styles.titleRow}>
      <div className={styles.title}>
        <h1>{title}</h1>
        {editingInfo}
      </div>
      {button && <div className={styles.buttonWrapper}>{button}</div>}
    </div>
  );
};

export default TitleRow;
