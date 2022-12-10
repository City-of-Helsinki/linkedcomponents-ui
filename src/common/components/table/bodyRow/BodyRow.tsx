import React, { FC } from 'react';

import { GetRowPropsFunc, Header } from '../Table2';
import styles from '../table2.module.scss';

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
  const handleRowClick = () => {
    onRowClick && onRowClick(row);
  };

  const handleKeyDown = (ev: React.KeyboardEvent) => {
    /* istanbul ignore else */
    if (ev.key === 'Enter') {
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
    <tr {...rowProps}>
      {cols.map((column, cellIndex) => {
        return (
          <td
            className={column.className}
            data-testid={`${column.key}-${index}`}
            key={cellIndex}
            onClick={column.onClick}
          >
            {column.transform && column.transform(row)}
            {!column.transform && row[column.key as keyof typeof row]}
          </td>
        );
      })}
    </tr>
  );
};

export default BodyRow;
