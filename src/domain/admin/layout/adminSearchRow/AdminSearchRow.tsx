import React, { FC } from 'react';

import SearchInput from '../../../../common/components/searchInput/SearchInput';
import styles from './adminSearchRow.module.scss';

type AdminSearchRowProps = {
  countText: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (value: string) => void;
  searchInputLabel: string;
  searchValue: string;
};

const AdminSearchRow: FC<AdminSearchRowProps> = ({
  countText,
  onSearchChange,
  onSearchSubmit,
  searchInputLabel,
  searchValue,
}) => {
  return (
    <div className={styles.adminSearchRow}>
      <span className={styles.count}>{countText}</span>
      <SearchInput
        className={styles.searchInput}
        label={searchInputLabel}
        hideLabel
        onSubmit={onSearchSubmit}
        onChange={onSearchChange}
        placeholder={searchInputLabel}
        value={searchValue}
      />
    </div>
  );
};

export default AdminSearchRow;
