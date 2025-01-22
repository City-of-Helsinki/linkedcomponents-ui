/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames';
import { Select, SelectProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../domain/app/theme/Theme';
import ComboboxLoadingSpinner, {
  ComboboxLoadingSpinnerProps,
} from '../comboboxLoadingSpinner/ComboboxLoadingSpinner';
import styles from './combobox.module.scss';

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
        theme={theme.select}
        virtualize
        texts={{ clearButtonAriaLabel_multiple: t('common.clear') }}
      />
    </ComboboxLoadingSpinner>
  );
};

export default Combobox;
