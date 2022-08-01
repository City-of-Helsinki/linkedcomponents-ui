import { ClassNames } from '@emotion/react';
import { Checkbox as BaseCheckbox, CheckboxProps } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import styles from './checkbox.module.scss';

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...rest }, ref) => {
    const { theme } = useTheme();
    return (
      <ClassNames>
        {({ css, cx }) => (
          <BaseCheckbox
            {...rest}
            className={cx(className, styles.checkbox, css(theme.checkbox))}
            ref={ref}
          />
        )}
      </ClassNames>
    );
  }
);

export default Checkbox;
