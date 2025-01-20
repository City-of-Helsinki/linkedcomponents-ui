/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames';
import { Select } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../domain/app/theme/Theme';
import ComboboxLoadingSpinner from '../comboboxLoadingSpinner/ComboboxLoadingSpinner';
import { SingleSelectProps } from '../singleSelect/SingleSelect';
import styles from './combobox.module.scss';

export type SingleComboboxProps<ValueType> = SingleSelectProps & {
  name: string;
  value: ValueType;
};

export type MultiComboboxProps<ValueType> = SingleSelectProps & {
  name: string;
  value: ValueType[];
};

const Combobox: React.FC<SingleSelectProps> = ({
  alignedLabel,
  isLoading,
  className,
  texts,
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
        texts={{ ...texts, clearButtonAriaLabel_multiple: t('common.clear') }}
      />
    </ComboboxLoadingSpinner>
  );
};

export default Combobox;
