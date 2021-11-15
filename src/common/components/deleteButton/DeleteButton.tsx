import { css } from '@emotion/css';
import classNames from 'classnames';
import { IconMinusCircle } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../domain/app/theme/Theme';
import Button from '../button/Button';
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
    <Button
      {...rest}
      aria-label={ariaLabel}
      className={classNames(
        styles.deleteButton,
        className,
        css(theme.deleteButton)
      )}
      iconLeft={<IconMinusCircle aria-hidden={true} />}
      onClick={onClick}
      type={type}
      variant="supplementary"
    >
      <span className={styles.label}>{t('common.delete')}</span>
    </Button>
  );
};

export default DeleteButton;
