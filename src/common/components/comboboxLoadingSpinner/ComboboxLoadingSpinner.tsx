import React from 'react';

import LoadingSpinner from '../loadingSpinner/LoadingSpinner';
import styles from './comboboxLoadingSpinner.module.scss';

type Props = {
  children: React.ReactNode;
  isLoading: boolean;
};

const ComboboxLoadingSpinner = ({
  children,
  isLoading,
}: Props): React.ReactElement => {
  return (
    <div className={styles.comboboxLoadingSpinner}>
      {children}
      {isLoading && (
        <div className={styles.loadingSpinnerWrapper}>
          <LoadingSpinner
            className={styles.loadingSpinner}
            isLoading={isLoading}
            small={true}
          />
        </div>
      )}
    </div>
  );
};

export default ComboboxLoadingSpinner;
