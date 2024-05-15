import React, { FC, PropsWithChildren, ReactElement } from 'react';

import Button from '../button/Button';
import SearchInput from '../searchInput/SearchInput';
import styles from './searchPanel.module.scss';

export type SearchRowProps = {
  onSearch: () => void;
  onSearchValueChange: (value: string) => void;
  searchButtonAriaLabel: string;
  searchButtonText: string;
  searchInputClassName?: string;
  searchInputLabel: string;
  searchInputPlaceholder: string;
  searchInputValue: string;
  selectors?: ReactElement[];
};

const SearchRow: FC<SearchRowProps> = ({
  onSearch,
  onSearchValueChange,
  searchButtonAriaLabel,
  searchButtonText,
  searchInputClassName,
  searchInputLabel,
  searchInputPlaceholder,
  searchInputValue,
  selectors,
}) => {
  return (
    <div className={styles.searchRow}>
      {selectors?.map((selector, index) => (
        <SelectorColumn key={index}>{selector}</SelectorColumn>
      ))}
      <TextSearchColumn>
        <SearchInput
          className={searchInputClassName}
          hideLabel
          label={searchInputLabel}
          onChange={onSearchValueChange}
          onSubmit={onSearch}
          placeholder={searchInputPlaceholder}
          searchButtonAriaLabel={searchButtonAriaLabel}
          value={searchInputValue}
        />
      </TextSearchColumn>
      <ButtonColumn>
        <Button fullWidth={true} onClick={onSearch} variant="secondary">
          {searchButtonText}
        </Button>
      </ButtonColumn>
    </div>
  );
};

const SelectorColumn: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.selectorColumn}>{children}</div>;
};

const ButtonColumn: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.buttonColumn}>{children}</div>;
};

const TextSearchColumn: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.textSearchColumn}>{children}</div>;
};

export { ButtonColumn, SearchRow, SelectorColumn, TextSearchColumn };
