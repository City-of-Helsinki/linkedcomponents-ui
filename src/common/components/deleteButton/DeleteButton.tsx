import { ClassNames } from '@emotion/react';
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
    <ClassNames>
      {({ css, cx }) => (
        <Button
          {...rest}
          aria-label={ariaLabel}
          className={cx(
            styles.deleteButton,
            className,
            css(theme.deleteButton)
          )}
          iconLeft={<IconMinusCircle aria-hidden={true} />}
          onClick={onClick}
          type={type}
          variant="supplementary"
        >
          <span className={styles.label}>{label ?? t('common.delete')}</span>
        </Button>
      )}
    </ClassNames>
  );
};

export default DeleteButton;
