/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames';
import { Select as HDSSelect } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '../../../domain/app/theme/Theme';
import useLocale from '../../../hooks/useLocale';
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
  const locale = useLocale();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const memoizedClassName = React.useMemo(
    () => classNames(className, styles.select),
    [className]
  );

  const memoizedTexts = React.useMemo(
    () => ({
      language: locale,
      ...texts,
      clearButtonAriaLabel_multiple: t('common.clear'),
    }),
    [locale, texts, t]
  );

  return (
    <SelectLoadingSpinner alignedLabel={alignedLabel} isLoading={isLoading}>
      <HDSSelect
        {...(rest as any)}
        className={memoizedClassName}
        theme={theme.select}
        texts={memoizedTexts}
      />
    </SelectLoadingSpinner>
  );
};

export default Select;
