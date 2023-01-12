import classNames from 'classnames';
import React from 'react';

import LoadingSpinner from '../loadingSpinner/LoadingSpinner';
import styles from './comboboxLoadingSpinner.module.scss';

type Props = {
  alignedLabel?: boolean;
  children: React.ReactNode;
  isLoading: boolean;
};

const ComboboxLoadingSpinner = ({
  alignedLabel,
  children,
  isLoading,
}: Props): React.ReactElement => {
  return (
    <div className={styles.comboboxLoadingSpinner}>
      {children}
      {isLoading && (
        <div
          className={classNames(styles.loadingSpinnerWrapper, {
            [styles.alignedLabel]: alignedLabel,
          })}
        >
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
