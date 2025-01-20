import classNames from 'classnames';
import { IconCross, IconSize } from 'hds-react';
import React from 'react';

import styles from './closeButton.module.scss';

type Props = {
  className?: string;
  label: string;
  onClick: (event: React.MouseEvent) => void;
} & React.ComponentPropsWithoutRef<'button'>;

const CloseButton: React.FC<Props> = ({
  className,
  label,
  onClick,
  type = 'button',
  ...rest
}) => {
  return (
    <button
      {...rest}
      aria-label={label}
      className={classNames(styles.closeButton, className)}
      onClick={onClick}
      type={type}
    >
      <IconCross size={IconSize.Small} />
    </button>
  );
};

export default CloseButton;
