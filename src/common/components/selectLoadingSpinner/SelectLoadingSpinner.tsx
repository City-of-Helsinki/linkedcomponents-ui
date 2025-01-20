import classNames from 'classnames';
import { FC, PropsWithChildren } from 'react';

import LoadingSpinner from '../loadingSpinner/LoadingSpinner';
import styles from './selectLoadingSpinner.module.scss';

export type SelectLoadingSpinnerProps = {
  alignedLabel?: boolean;
  isLoading?: boolean;
};

const SelectLoadingSpinner: FC<
  PropsWithChildren<SelectLoadingSpinnerProps>
> = ({ alignedLabel, children, isLoading }) => {
  return (
    <div className={styles.selectLoadingSpinner}>
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

export default SelectLoadingSpinner;
