import classNames from 'classnames';
import { css } from 'emotion';
import { Button as BaseButton, ButtonProps, ButtonVariant } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import styles from './button.module.scss';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...rest }, ref) => {
    const { theme } = useTheme();
    return (
      <BaseButton
        variant={variant as Exclude<ButtonVariant, 'supplementary'>}
        className={classNames(
          className,
          styles.button,
          css(theme.button[variant])
        )}
        ref={ref}
        {...rest}
      />
    );
  }
);

export default Button;
