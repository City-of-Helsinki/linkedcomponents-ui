import React, { FC, useRef } from 'react';

import { GetRowPropsFunc } from '../Table';
import styles from '../table.module.scss';
import { Header } from '../types';

type BodyRowProps = {
  cols: Header[];
  getRowProps?: GetRowPropsFunc;
  index: number;
  onRowClick?: (item: object) => void;
  row: object;
};

const BodyRow: FC<BodyRowProps> = ({
  cols,
  getRowProps,
  index,
  onRowClick,
  row,
}) => {
  const ref = useRef<HTMLTableRowElement>(null);
  const handleRowClick = (ev: React.MouseEvent) => {
    if (ev.target instanceof HTMLElement && ref.current?.contains(ev.target))
      onRowClick && onRowClick(row);
  };

  const handleKeyDown = (ev: React.KeyboardEvent) => {
    /* istanbul ignore else */
    if (ev.key === 'Enter' && ev.target === ref.current) {
      onRowClick && onRowClick(row);
    }
  };

  const commonProps = getRowProps && getRowProps(row);
  const rowProps = onRowClick
    ? {
        className: styles.clickableRow,
        role: 'button',
        onClick: handleRowClick,
        onKeyDown: handleKeyDown,
        tabIndex: 0,
        ...commonProps,
      }
    : commonProps;

  return (
    <tr {...rowProps} ref={ref}>
      {cols.map((column) => {
        return (
          <td
            className={column.className}
            data-testid={`${column.key}-${index}`}
            key={column.key}
            onClick={column.onClick}
          >
            {column.transform && column.transform(row, index)}
            {!column.transform && row[column.key as keyof typeof row]}
          </td>
        );
      })}
    </tr>
  );
};

export default BodyRow;
