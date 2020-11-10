import classNames from 'classnames';
import { css } from 'emotion';
import {
  Combobox as BaseCombobox,
  ComboboxProps,
} from 'hds-react/components/Combobox';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../domain/app/theme/Theme';
import { OptionType } from '../../../types';
import {
  getA11ySelectionMessage,
  getA11yStatusMessage,
} from '../../../utils/accessibilityUtils';

const Combobox: React.FC<ComboboxProps<OptionType>> = ({
  className,
  ...rest
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <BaseCombobox
      {...rest}
      className={classNames(className, css(theme.select))}
      getA11yStatusMessage={(options) => getA11yStatusMessage(options, t)}
      getA11ySelectionMessage={(options) => getA11ySelectionMessage(options, t)}
    />
  );
};

export default Combobox;
