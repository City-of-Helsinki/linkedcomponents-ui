import {
  IconSort,
  IconSortAlphabeticalAscending,
  IconSortAlphabeticalDescending,
  IconSortAscending,
  IconSortDescending,
} from 'hds-react';
import React from 'react';

import styles from './table.module.scss';

export interface SortableColumnProps {
  className?: string;
  label: string;
  onClick: (value: string) => void;
  sort: string;
  sortKey: string;
  type?: 'default' | 'text';
}

const SortableColumn: React.FC<SortableColumnProps> = ({
  className,
  label,
  onClick,
  sort,
  sortKey,
  type = 'default',
}) => {
  const getSortIcon = () => {
    switch (sort) {
      case sortKey:
        return type === 'text' ? (
          <IconSortAlphabeticalAscending aria-hidden={true} />
        ) : (
          <IconSortAscending aria-hidden={true} />
        );
      case `-${sortKey}`:
        return type === 'text' ? (
          <IconSortAlphabeticalDescending aria-hidden={true} />
        ) : (
          <IconSortDescending aria-hidden={true} />
        );
      default:
        return <IconSort aria-hidden={true} />;
    }
  };

  const getAriaSort = () => {
    switch (sort) {
      case sortKey:
        return 'ascending';
      case `-${sortKey}`:
        return 'descending';
      default:
        return undefined;
    }
  };

  const handleClick = () => {
    onClick(sort === sortKey ? `-${sortKey}` : sortKey);
  };

  return (
    <th className={className} aria-sort={getAriaSort()}>
      <button className={styles.sortableColumnButton} onClick={handleClick}>
        {getSortIcon()}
        {label}
      </button>
    </th>
  );
};

export default SortableColumn;
