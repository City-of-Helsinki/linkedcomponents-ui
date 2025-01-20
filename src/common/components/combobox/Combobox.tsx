/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames';
import { Select, SelectProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../domain/app/theme/Theme';
// import { OptionType } from '../../../types';
// import {
//   getA11ySelectionMessage,
//   getA11yStatusMessage,
// } from '../../../utils/accessibilityUtils';
import ComboboxLoadingSpinner, {
  ComboboxLoadingSpinnerProps,
} from '../comboboxLoadingSpinner/ComboboxLoadingSpinner';
import styles from './combobox.module.scss';

// type FilterFunction<OptionType> = (
//   options: OptionType[],
//   search: string
// ) => OptionType[];

// type CommonComboboxProps = {
//   'aria-describedby'?: string;
//   catchEscapeKey?: boolean;
//   showToggleButton?: boolean;
//   toggleButtonAriaLabel: string;
// } & ComboboxLoadingSpinnerProps;

// export type MultiComboboxProps<ValueType> = Omit<
//   MultiSelectProps<OptionType>,
//   'aria-labelledby' | 'options' | 'value'
// > &
//   CommonComboboxProps & {
//     name: string;
//     value: ValueType[];
//   };

export type SingleComboboxProps<ValueType> = SelectProps & {
  name: string;
  value: ValueType;
};

export type MultiComboboxProps<ValueType> = SelectProps & {
  name: string;
  value: ValueType[];
};

type Props = ComboboxLoadingSpinnerProps & SelectProps & { className?: string };

const Combobox: React.FC<Props> = ({
  alignedLabel,
  isLoading,
  className,
  ...rest
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <ComboboxLoadingSpinner alignedLabel={alignedLabel} isLoading={isLoading}>
      <Select
        {...(rest as any)}
        className={classNames(className, styles.combobox)}
        // getA11yStatusMessage={(options) => getA11yStatusMessage(options, t)}
        // getA11ySelectionMessage={
        //   /* istanbul ignore next */
        //   (options) => getA11ySelectionMessage(options, t)
        // }
        theme={theme.select}
        virtualize
        texts={{ clearButtonAriaLabel_multiple: t('common.clear') }}
      />
    </ComboboxLoadingSpinner>
  );
};

export default Combobox;
