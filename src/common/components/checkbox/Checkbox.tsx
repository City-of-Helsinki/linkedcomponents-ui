import classNames from 'classnames';
import { css } from 'emotion';
import { Checkbox as BaseCheckbox, CheckboxProps } from 'hds-react';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';

const Checkbox: React.FC<CheckboxProps> = ({ className, ...rest }) => {
  const { theme } = useTheme();
  return (
    <BaseCheckbox
      {...rest}
      className={classNames(className, css(theme.checkbox))}
    />
  );
};

export default Checkbox;
