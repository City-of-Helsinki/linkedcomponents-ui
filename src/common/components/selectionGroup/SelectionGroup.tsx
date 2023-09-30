import classNames from 'classnames';
import {
  SelectionGroup as HdsSelectionGroup,
  SelectionGroupProps as HdsSelectionGroupProps,
} from 'hds-react';
import React from 'react';

import styles from './selectionGroup.module.scss';

type Columns = 1 | 2 | 3 | 4;

export type SelectionGroupProps = React.PropsWithChildren<
  {
    columns: Columns;
    wrapperId: string;
  } & HdsSelectionGroupProps
>;

const SelectionGroup: React.FC<SelectionGroupProps> = ({
  className,
  children,
  columns,
  errorText,
  wrapperId,
  ...rest
}) => {
  return (
    <HdsSelectionGroup
      {...rest}
      className={classNames(
        className,
        styles.selectionGroup,
        styles[`columns${columns}`]
      )}
      errorText={errorText}
    >
      {children}
    </HdsSelectionGroup>
  );
};

export default SelectionGroup;
