import classNames from 'classnames';
import {
  IconSort,
  IconSortAlphabeticalAscending,
  IconSortAlphabeticalDescending,
  IconSortAscending,
  IconSortDescending,
} from 'hds-react';
import React from 'react';

import styles from '../table2.module.scss';

export type SortingHeaderCellProps = React.ComponentPropsWithoutRef<'th'> & {
  ariaLabelSortButtonUnset: string;
  ariaLabelSortButtonAscending: string;
  ariaLabelSortButtonDescending: string;
  className?: string;
  colKey: string;
  onSort?: (
    order: 'asc' | 'desc',
    colKey: string,
    handleSort: () => void
  ) => void;
  order: 'unset' | 'asc' | 'desc';
  title: string;
  setSortingAndOrder: (colKey: string) => void;
  sortIconType: 'string' | 'other';
};

type SortingIconProps = {
  ariaLabelSortButtonUnset: string;
  ariaLabelSortButtonAscending: string;
  ariaLabelSortButtonDescending: string;
  order: 'unset' | 'asc' | 'desc';
  sortIconType: 'string' | 'other';
};

const renderSortIcon = ({
  ariaLabelSortButtonUnset,
  ariaLabelSortButtonAscending,
  ariaLabelSortButtonDescending,
  order,
  sortIconType,
}: SortingIconProps) => {
  if (order === 'unset') {
    return (
      <IconSort
        className={styles.sortIcon}
        aria-label={ariaLabelSortButtonUnset}
      />
    );
  }
  if (order === 'asc') {
    if (sortIconType === 'string') {
      return (
        <IconSortAlphabeticalAscending
          className={styles.sortIcon}
          aria-label={ariaLabelSortButtonAscending}
        />
      );
    }
    return (
      <IconSortAscending
        className={styles.sortIcon}
        aria-label={ariaLabelSortButtonAscending}
      />
    );
  }

  if (sortIconType === 'string') {
    return (
      <IconSortAlphabeticalDescending
        className={styles.sortIcon}
        aria-label={ariaLabelSortButtonDescending}
      />
    );
  }

  return (
    <IconSortDescending
      className={styles.sortIcon}
      aria-label={ariaLabelSortButtonDescending}
    />
  );
};

const resolveNewOrder = ({
  previousOrder,
}: {
  previousOrder: 'asc' | 'desc' | 'unset';
}) => {
  if (previousOrder === 'unset') {
    return 'asc';
  }

  return previousOrder === 'desc' ? 'asc' : 'desc';
};

export const SortingHeaderCell = ({
  ariaLabelSortButtonUnset,
  ariaLabelSortButtonAscending,
  ariaLabelSortButtonDescending,
  className,
  colKey,
  onSort,
  title,
  setSortingAndOrder,
  order = 'unset',
  sortIconType = 'string',
  ...rest
}: SortingHeaderCellProps) => {
  const sortingCallback = () => {
    setSortingAndOrder(colKey);
  };
  return (
    <th
      className={classNames(styles.sortingHeader, className)}
      scope="col"
      {...rest}
    >
      <div className={styles.sortColumnCell}>
        <button
          data-testid={`hds-table-sorting-header-${colKey}`}
          className={styles.sortButton}
          type="button"
          onClick={(event) => {
            // Prevent default to not submit form if we happen to be inside form
            event.preventDefault();
            if (onSort) {
              onSort(
                resolveNewOrder({ previousOrder: order }),
                colKey,
                sortingCallback
              );
            } else {
              setSortingAndOrder(colKey);
            }
          }}
        >
          <span>{title}</span>
          {renderSortIcon({
            ariaLabelSortButtonUnset,
            ariaLabelSortButtonAscending,
            ariaLabelSortButtonDescending,
            order,
            sortIconType,
          })}
        </button>
      </div>
    </th>
  );
};
