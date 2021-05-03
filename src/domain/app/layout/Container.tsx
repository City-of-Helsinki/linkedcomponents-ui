import classNames from 'classnames';
import React from 'react';

import styles from './container.module.scss';

interface Props {
  className?: string;
  contentWrapperClassName?: string;
  withOffset?: boolean;
}

const Container: React.FC<Props> = ({
  children,
  className,
  contentWrapperClassName,
  withOffset = false,
}) => {
  return (
    <div
      className={classNames(styles.container, className, {
        [styles.withOffset]: withOffset,
      })}
    >
      <div
        className={classNames(styles.contentWrapper, contentWrapperClassName)}
      >
        {children}
      </div>
    </div>
  );
};

export default Container;
