import classNames from 'classnames';
import { FC, PropsWithChildren } from 'react';

import LoadingSpinner from '../loadingSpinner/LoadingSpinner';
import styles from './comboboxLoadingSpinner.module.scss';

export type ComboboxLoadingSpinnerProps = {
  alignedLabel?: boolean;
  isLoading?: boolean;
};

const ComboboxLoadingSpinner: FC<
  PropsWithChildren<ComboboxLoadingSpinnerProps>
> = ({ alignedLabel, children, isLoading }) => {
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
