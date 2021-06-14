import { css } from '@emotion/css';
import classNames from 'classnames';
import { Combobox as BaseCombobox, ComboboxProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../domain/app/theme/Theme';
import { OptionType } from '../../../types';
import {
  getA11ySelectionMessage,
  getA11yStatusMessage,
} from '../../../utils/accessibilityUtils';
import styles from '../select/select.module.scss';

const Combobox: React.FC<ComboboxProps<OptionType>> = ({
  className,
  ...rest
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <BaseCombobox
      {...rest}
      className={classNames(className, styles.combobox, css(theme.select))}
      getA11yStatusMessage={(options) => getA11yStatusMessage(options, t)}
      getA11ySelectionMessage={
        /* istanbul ignore next */
        (options) => getA11ySelectionMessage(options, t)
      }
      virtualized={true}
    />
  );
};

export default Combobox;
