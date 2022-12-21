import classNames from 'classnames';
import {
  SearchInput as HdsSearchInput,
  SearchInputProps as HdsSearchInputProps,
} from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from './searchInput.module.scss';

export type SearchInputProps = {
  hideLabel?: boolean;
} & HdsSearchInputProps<unknown>;

const SearchInput: React.FC<SearchInputProps> = ({
  className,
  clearButtonAriaLabel,
  hideLabel,
  searchButtonAriaLabel,
  ...rest
}) => {
  const { t } = useTranslation();

  return (
    <HdsSearchInput
      {...rest}
      className={classNames(className, {
        [styles.hideLabel]: hideLabel,
      })}
      clearButtonAriaLabel={
        clearButtonAriaLabel || (t('common.clear') as string)
      }
      searchButtonAriaLabel={
        searchButtonAriaLabel || (t('common.search') as string)
      }
    />
  );
};

export default SearchInput;
