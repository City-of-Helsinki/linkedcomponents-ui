import classNames from 'classnames';
import { css } from 'emotion';
import { Button as BaseButton, ButtonProps } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...rest }, ref) => {
    const { theme } = useTheme();
    return (
      <BaseButton
        variant={variant as any}
        className={classNames(className, css(theme.button[variant]))}
        ref={ref}
        {...rest}
      />
    );
  }
);

export default Button;
