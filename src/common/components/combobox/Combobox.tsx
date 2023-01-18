import classNames from 'classnames';
import {
  Combobox as BaseCombobox,
  ComboboxProps,
  MultiSelectProps,
  SingleSelectProps,
} from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../domain/app/theme/Theme';
import { OptionType } from '../../../types';
import {
  getA11ySelectionMessage,
  getA11yStatusMessage,
} from '../../../utils/accessibilityUtils';
import styles from './combobox.module.scss';

type FilterFunction<OptionType> = (
  options: OptionType[],
  search: string
) => OptionType[];

type CommonComboboxProps = {
  'aria-describedby'?: string;
  catchEscapeKey?: boolean;
  filter?: FilterFunction<OptionType>;
  showToggleButton?: boolean;
  toggleButtonAriaLabel: string;
};

export type MultiComboboxProps<ValueType> = Omit<
  MultiSelectProps<OptionType>,
  'aria-labelledby' | 'options' | 'value'
> &
  CommonComboboxProps & {
    name: string;
    value: ValueType[];
  };

export type SingleComboboxProps<ValueType> = Omit<
  SingleSelectProps<OptionType>,
  'aria-labelledby' | 'options' | 'value'
> &
  CommonComboboxProps & {
    name: string;
    value: ValueType;
  };

const Combobox: React.FC<ComboboxProps<OptionType>> = ({
  className,
  ...rest
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <BaseCombobox
      {...rest}
      className={classNames(className, styles.combobox)}
      getA11yStatusMessage={(options) => getA11yStatusMessage(options, t)}
      getA11ySelectionMessage={
        /* istanbul ignore next */
        (options) => getA11ySelectionMessage(options, t)
      }
      theme={theme.select}
      virtualized={true}
    />
  );
};

export default Combobox;
