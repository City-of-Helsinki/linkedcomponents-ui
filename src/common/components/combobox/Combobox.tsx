import classNames from 'classnames';
import { css } from 'emotion';
import {
  Combobox as BaseCombobox,
  ComboboxProps,
} from 'hds-react/components/Combobox';
import React from 'react';

import { useTheme } from '../../../domain/app/theme/Theme';
import { OptionType } from '../../../types';

const Combobox: React.FC<ComboboxProps<OptionType>> = ({
  className,
  ...rest
}) => {
  const { theme } = useTheme();
  return (
    <BaseCombobox
      {...rest}
      className={classNames(className, css(theme.select))}
    />
  );
};

export default Combobox;
