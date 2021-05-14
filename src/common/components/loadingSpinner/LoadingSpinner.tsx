import { css } from '@emotion/css';
import classNames from 'classnames';
import {
  LoadingSpinner as HdsLoadingSpinner,
  LoadingSpinnerProps,
} from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../domain/app/theme/Theme';
import styles from './loadingSpinner.module.scss';

export const testId = 'loading-spinner';

type Props = {
  className?: string;
  isLoading: boolean;
} & LoadingSpinnerProps;

const LoadingSpinner: React.FC<Props> = ({
  children,
  className,
  isLoading,
  loadingFinishedText,
  loadingText,
  small,
  ...rest
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  return (
    <>
      {isLoading ? (
        <div
          className={classNames(className, styles.loadingSpinnerWrapper)}
          data-testid={testId}
        >
          <HdsLoadingSpinner
            {...rest}
            className={classNames(
              styles.loadingSpinner,
              {
                [styles.loadingSpinnerSmall]: small,
              },
              css(theme.loadingSpinner)
            )}
            loadingText={loadingText || t('common.loading')}
            loadingFinishedText={
              loadingFinishedText || t('common.loadingFinished')
            }
          />
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default LoadingSpinner;
