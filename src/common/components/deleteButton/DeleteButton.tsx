import classNames from 'classnames';
import { css } from 'emotion';
import { IconMinusCircle } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import styles from './deleteButton.module.scss';

type Props = {
  className?: string;
  label: string;
  onClick: () => void;
} & React.ComponentPropsWithoutRef<'button'>;

const DeleteButton: React.FC<Props> = ({
  className,
  label,
  onClick,
  type = 'button',
  ...rest
}) => {
  const { theme } = useTheme();
  return (
    <button
      {...rest}
      aria-label={label}
      className={classNames(
        styles.deleteButton,
        className,
        css(theme.deleteButton)
      )}
      onClick={onClick}
      type={type}
    >
      <IconMinusCircle size="s" />
    </button>
  );
};

export default DeleteButton;
