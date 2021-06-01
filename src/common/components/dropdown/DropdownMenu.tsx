import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ClearButton from './ClearButton';
import styles from './dropdown.module.scss';
import SearchInput from './SearchInput';

interface DropdownMenuProps {
  clearButtonLabel?: string;
  id: string;
  isOpen: boolean;
  onClear?: () => void;
  onSearchChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  searchPlaceholder?: string;
  searchRef?: React.MutableRefObject<HTMLInputElement | null>;
  searchValue?: string;
  wrapperClassName?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  children,
  clearButtonLabel,
  id,
  isOpen,
  onClear,
  onSearchChange,
  searchPlaceholder = 'Search',
  searchRef,
  searchValue = '',
  wrapperClassName,
}) => {
  const { t } = useTranslation();
  const searchInputId = `${id}-search`;

  if (!isOpen) return null;

  return (
    <div id={id} className={styles.dropdownMenu}>
      {typeof onSearchChange === 'function' && (
        <SearchInput
          ref={searchRef}
          id={searchInputId}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          value={searchValue}
        />
      )}
      <div className={classNames(styles.dropdownMenuWrapper, wrapperClassName)}>
        {children}
      </div>
      {onClear && (
        <ClearButton onClick={onClear}>
          {clearButtonLabel || t('common.dropdown.buttonClear')}
        </ClearButton>
      )}
    </div>
  );
};

export default DropdownMenu;
