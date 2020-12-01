import classNames from 'classnames';
import { css } from 'emotion';
import React from 'react';

import { ReactComponent as SpinnerSvg } from '../../../assets/images/svg/spinner.svg';
import { useTheme } from '../../../domain/app/theme/Theme';
import styles from './loadingSpinner.module.scss';

export const testId = 'loading-spinner';

interface Props {
  className?: string;
  isLoading: boolean;
}

const LoadingSpinner: React.FC<Props> = ({
  children,
  className,
  isLoading,
}) => {
  const { theme } = useTheme();
  return (
    <>
      {isLoading ? (
        <div
          className={classNames(styles.loadingSpinnerWrapper, className)}
          data-testid={testId}
        >
          <div
            className={classNames(
              styles.loadingSpinner,
              css(theme.loadingSpinner)
            )}
          >
            <SpinnerSvg />
          </div>
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default LoadingSpinner;
