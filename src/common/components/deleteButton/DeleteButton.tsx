import classNames from 'classnames';
import { css } from 'emotion';
import { IconMinusCircle } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../domain/app/theme/Theme';
import styles from './deleteButton.module.scss';

type Props = {
  ariaLabel: string;
  className?: string;
  label?: string;
  onClick: () => void;
} & React.ComponentPropsWithoutRef<'button'>;

const DeleteButton: React.FC<Props> = ({
  ariaLabel,
  className,
  label,
  onClick,
  type = 'button',
  ...rest
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <button
      {...rest}
      aria-label={ariaLabel}
      className={classNames(
        styles.deleteButton,
        className,
        css(theme.deleteButton)
      )}
      onClick={onClick}
      type={type}
    >
      <IconMinusCircle size="s" />
      <span className={styles.label}>{t('common.delete')}</span>
    </button>
  );
};

export default DeleteButton;
