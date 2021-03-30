import classNames from 'classnames';
import { css } from 'emotion';
import { Checkbox as BaseCheckbox, CheckboxProps } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import styles from './checkbox.module.scss';

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...rest }, ref) => {
    const { theme } = useTheme();
    return (
      <BaseCheckbox
        {...rest}
        className={classNames(className, styles.checkbox, css(theme.checkbox))}
        ref={ref}
      />
    );
  }
);

export default Checkbox;
