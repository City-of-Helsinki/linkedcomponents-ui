import classNames from 'classnames';
import {
  IconSort,
  IconSortAlphabeticalAscending,
  IconSortAlphabeticalDescending,
  IconSortAscending,
  IconSortDescending,
} from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import styles from '../table.module.scss';
import { Order, OrderWithUnset } from '../types';

export type SortingHeaderCellProps = React.ComponentPropsWithoutRef<'th'> & {
  ariaLabelSortButtonUnset?: string;
  ariaLabelSortButtonAscending?: string;
  ariaLabelSortButtonDescending?: string;
  className?: string;
  colKey: string;
  onSort?: (order: Order, colKey: string, handleSort: () => void) => void;
  order: OrderWithUnset;
  title: string;
  setSortingAndOrder: (colKey: string) => void;
  sortIconType: 'string' | 'other';
};

type SortingIconAriaLabels = {
  asc: string;
  desc: string;
  unset: string;
};

type SortingIconProps = {
  ariaLabels: SortingIconAriaLabels;
  order: OrderWithUnset;
  sortIconType: 'string' | 'other';
};

const renderSortIcon = ({
  ariaLabels,
  order,
  sortIconType,
}: SortingIconProps) => {
  const props = {
    className: styles.sortIcon,
    ariaLabel: ariaLabels[order],
  };
  switch (order) {
    case 'unset':
      return <IconSort {...props} />;
    case 'asc':
      return sortIconType === 'string' ? (
        <IconSortAlphabeticalAscending {...props} />
      ) : (
        <IconSortAscending {...props} />
      );
    case 'desc':
      return sortIconType === 'string' ? (
        <IconSortAlphabeticalDescending {...props} />
      ) : (
        <IconSortDescending {...props} />
      );
  }
};

const resolveNewOrder = ({
  previousOrder,
}: {
  previousOrder: OrderWithUnset;
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
  /* istanbul ignore next */
  order = 'unset',
  /* istanbul ignore next */
  sortIconType = 'string',
  ...rest
}: SortingHeaderCellProps) => {
  const sortingCallback = () => {
    setSortingAndOrder(colKey);
  };
  const { t } = useTranslation();

  const sortIcon = renderSortIcon({
    ariaLabels: {
      asc:
        ariaLabelSortButtonAscending ??
        t('common.table.ariaLabelSortButtonAscending'),
      desc:
        ariaLabelSortButtonDescending ??
        t('common.table.ariaLabelSortButtonDescending'),
      unset: ariaLabelSortButtonUnset ?? '',
    },
    order,
    sortIconType,
  });

  const handleSort: React.MouseEventHandler<HTMLButtonElement> = (event) => {
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
          onClick={handleSort}
        >
          <span>{title}</span>
          {sortIcon}
        </button>
      </div>
    </th>
  );
};
