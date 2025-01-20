/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames';
import { Select as HDSSelect } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../domain/app/theme/Theme';
import SelectLoadingSpinner from '../selectLoadingSpinner/SelectLoadingSpinner';
import { SingleSelectProps } from '../singleSelect/SingleSelect';
import styles from './select.module.scss';

export type SelectPropsWithValue<ValueType> = SingleSelectProps & {
  name: string;
  value: ValueType;
};

export type MultiSelectPropsWithValue<ValueType> = SingleSelectProps & {
  name: string;
  value: ValueType[];
};

const Select: React.FC<SingleSelectProps> = ({
  alignedLabel,
  isLoading,
  className,
  texts,
  ...rest
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <SelectLoadingSpinner alignedLabel={alignedLabel} isLoading={isLoading}>
      <HDSSelect
        {...(rest as any)}
        className={classNames(className, styles.select)}
        theme={theme.select}
        texts={{ ...texts, clearButtonAriaLabel_multiple: t('common.clear') }}
      />
    </SelectLoadingSpinner>
  );
};

export default Select;
