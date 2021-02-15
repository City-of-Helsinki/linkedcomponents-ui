import classNames from 'classnames';
import { IconCrossCircle, IconSearch } from 'hds-react';
import uniqueId from 'lodash/uniqueId';
import React, { KeyboardEvent, useRef } from 'react';

import InputWrapper from '../inputWrapper/InputWrapper';
import styles from './searchInput.module.scss';

export type SearchInputProps = React.ComponentPropsWithoutRef<'input'> & {
  className?: string;
  clearButtonAriaLabel?: string;
  helperText?: string;
  hideLabel?: boolean;
  id?: string;
  label: React.ReactNode;
  onSearch: (value: string) => void;
  searchButtonAriaLabel?: string;
  setValue: (value: string) => void;
  value: string;
};

const SearchInput: React.FC<SearchInputProps> = ({
  className,
  clearButtonAriaLabel = 'Clear',
  helperText,
  hideLabel,
  id: _id,
  label,
  onSearch,
  searchButtonAriaLabel = 'Search',
  setValue,
  value,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useRef<string>(_id || uniqueId('search-input-')).current;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const clear = () => {
    setValue('');
    inputRef.current?.focus();
  };

  const search = () => {
    onSearch(value);
  };

  const onInputKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      search();
    }
  };

  return (
    <div className={classNames(styles.root, className)}>
      <InputWrapper
        helperText={helperText}
        hideLabel={hideLabel}
        id={id}
        label={label}
      >
        <input
          {...rest}
          ref={inputRef}
          className={classNames(styles.input)}
          id={id}
          onKeyUp={onInputKeyUp}
          onChange={handleChange}
          role="searchbox"
          type="text"
          value={value}
        />
        <div className={styles.buttons}>
          {value.length > 0 && (
            <button
              type="button"
              aria-label={clearButtonAriaLabel}
              className={classNames(styles.button)}
              onClick={clear}
            >
              <IconCrossCircle className={styles.searchIcon} aria-hidden />
            </button>
          )}
          <button
            type="button"
            aria-label={searchButtonAriaLabel}
            className={classNames(styles.button)}
            onClick={search}
          >
            <IconSearch className={styles.searchIcon} aria-hidden />
          </button>
        </div>
      </InputWrapper>
    </div>
  );
};

export default SearchInput;
