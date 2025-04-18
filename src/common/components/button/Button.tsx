import { ClassNames } from '@emotion/react';
import { Button as BaseButton, ButtonProps, ButtonVariant } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import styles from './button.module.scss';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = ButtonVariant.Primary, ...rest }, ref) => {
    const { theme } = useTheme();
    return (
      <ClassNames>
        {({ css, cx }) => (
          <BaseButton
            variant={variant as Exclude<ButtonVariant, 'supplementary'>}
            className={cx(className, styles.button, css(theme.button[variant]))}
            ref={ref}
            {...rest}
          />
        )}
      </ClassNames>
    );
  }
);

export default Button;
