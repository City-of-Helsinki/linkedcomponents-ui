/* eslint-disable @typescript-eslint/no-explicit-any */
import { MouseEvent, ReactElement } from 'react';

/* eslint-disable max-len */
export type Header = {
  className?: string;
  /**
   * Custom sort compare function
   */
  customSortCompareFunction?: (a: any, b: any) => number;
  /**
   * Boolean indicating whether a column is sortable
   */
  isSortable?: boolean;
  /**
   * Key of header. Maps with the corresponding row data keys.
   */
  key: string;
  /**
   * Visible header name that is rendered.
   */
  headerName: string;
  /**
   * Sort icon type to be used in sorting. Use type string if the content is a string, otherwise use type other.
   * @default 'string'
   */
  onClick?: (event: MouseEvent) => void;
  sortIconType?: 'string' | 'other';
  /**
   * Transform function for the corresponding row data. Use this to render custom content inside the table cell.
   */
  transform?: ({ args }: any, index: number) => string | ReactElement; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export type Order = 'asc' | 'desc';
