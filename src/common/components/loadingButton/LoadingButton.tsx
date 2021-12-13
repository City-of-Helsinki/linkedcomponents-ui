import { ButtonProps } from 'hds-react';
import React from 'react';

import Button from '../button/Button';
import LoadingSpinner from '../loadingSpinner/LoadingSpinner';
import styles from './loadingButton.module.scss';

type Props = { icon: React.ReactNode; loading: boolean } & ButtonProps;

const LoadingButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ children, icon, loading, ...rest }, ref) => {
    return (
      <Button
        {...rest}
        ref={ref}
        iconLeft={
          loading ? (
            <LoadingSpinner
              className={styles.loadingSpinner}
              isLoading={true}
              small={true}
            />
          ) : (
            icon
          )
        }
      >
        {children}
      </Button>
    );
  }
);

export default LoadingButton;
