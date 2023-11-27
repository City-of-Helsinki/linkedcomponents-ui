import classNames from 'classnames';
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
        <div
          className={classNames(className, styles.loadingSpinnerWrapper)}
          data-testid={testIds.loadingSpinner}
        >
          <HdsLoadingSpinner
            {...rest}
            className={classNames(styles.loadingSpinner, {
              [styles.large]: !small,
            })}
            loadingText={loadingText || t('common.loading')}
            loadingFinishedText={
              loadingFinishedText || t('common.loadingFinished')
            }
            theme={theme.loadingSpinner}
            small={small}
          />
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default LoadingSpinner;
