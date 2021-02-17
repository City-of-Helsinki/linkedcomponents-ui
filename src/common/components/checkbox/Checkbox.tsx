import classNames from 'classnames';
import { css } from 'emotion';
import { Checkbox as BaseCheckbox, CheckboxProps } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...rest }, ref) => {
    const { theme } = useTheme();
    return (
      <BaseCheckbox
        {...rest}
        className={classNames(className, css(theme.checkbox))}
        ref={ref}
      />
    );
  }
);

export default Checkbox;
