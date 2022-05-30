import classNames from 'classnames';
import React from 'react';

import styles from './titleRow.module.scss';

type TitleRowProps = {
  button?: React.ReactElement;
  buttonWrapperClassName?: string;
  editingInfo?: React.ReactElement;
  title: string;
};

const TitleRow = ({
  button,
  buttonWrapperClassName,
  editingInfo,
  title,
}: TitleRowProps): React.ReactElement => {
  return (
    <div className={styles.titleRow}>
      <div className={styles.title}>
        <h1>{title}</h1>
        {editingInfo}
      </div>
      {button && (
        <div
          className={classNames(styles.buttonWrapper, buttonWrapperClassName)}
        >
          {button}
        </div>
      )}
    </div>
  );
};

export default TitleRow;
