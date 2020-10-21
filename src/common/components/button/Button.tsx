import classNames from 'classnames';
import { css } from 'emotion';
import { Button as BaseButton, ButtonProps } from 'hds-react/components/Button';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';

const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'primary',
  ...rest
}) => {
  const { theme } = useTheme();
  return (
    <BaseButton
      variant={variant}
      {...rest}
      className={classNames(className, css(theme.button[variant]))}
    />
  );
};

export default Button;
