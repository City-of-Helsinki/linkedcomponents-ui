import classNames from 'classnames';
import { ButtonVariant } from 'hds-react';
import { FC, PropsWithChildren, ReactElement } from 'react';

import Button from '../button/Button';
import SearchInput from '../searchInput/SearchInput';
import styles from './searchPanel.module.scss';

const MAIN_SELECTOR_MAX_COUNT = 1;

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
  const mainSelectors = selectors?.slice(0, MAIN_SELECTOR_MAX_COUNT);
  const secondarySelectors = selectors?.slice(MAIN_SELECTOR_MAX_COUNT);

  return (
    <div className={styles.searchRow}>
      <InputWrapper>
        <FilterRow>
          {mainSelectors?.map((selector, index) => (
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
        </FilterRow>
        {!!secondarySelectors?.length && (
          <FilterRow>
            {secondarySelectors?.map((selector, index) => (
              <SelectorColumn key={index} small={index % 3 === 2}>
                {selector}
              </SelectorColumn>
            ))}
          </FilterRow>
        )}
      </InputWrapper>
      <ButtonWrapper>
        <Button
          fullWidth={true}
          onClick={onSearch}
          variant={ButtonVariant.Secondary}
        >
          {searchButtonText}
        </Button>
      </ButtonWrapper>
    </div>
  );
};

const InputWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.inputWrapper}>{children}</div>;
};

const FilterRow: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.filterRow}>{children}</div>;
};

const SelectorColumn: FC<PropsWithChildren<{ small?: boolean }>> = ({
  children,
  small,
}) => {
  return (
    <div
      className={classNames(styles.selectorColumn, { [styles.small]: small })}
    >
      {children}
    </div>
  );
};

const ButtonWrapper: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.buttonWrapper}>{children}</div>;
};

const TextSearchColumn: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.textSearchColumn}>{children}</div>;
};

export { SearchRow };
