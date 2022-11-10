import { ClassNames } from '@emotion/react';
import {
  LoadingSpinner as HdsLoadingSpinner,
  LoadingSpinnerProps,
} from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { testIds } from '../../../constants';
import { useTheme } from '../../../domain/app/theme/Theme';
import styles from './loadingSpinner.module.scss';

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
        <ClassNames>
          {({ css, cx }) => (
            <div
              className={cx(className, styles.loadingSpinnerWrapper)}
              data-testid={testIds.loadingSpinner}
            >
              <HdsLoadingSpinner
                {...rest}
                className={cx(
                  styles.loadingSpinner,
                  { [styles.loadingSpinnerSmall]: small },
                  css(theme.loadingSpinner)
                )}
                loadingText={loadingText || t('common.loading')}
                loadingFinishedText={
                  loadingFinishedText || t('common.loadingFinished')
                }
              />
            </div>
          )}
        </ClassNames>
      ) : (
        children
      )}
    </>
  );
};

export default LoadingSpinner;
