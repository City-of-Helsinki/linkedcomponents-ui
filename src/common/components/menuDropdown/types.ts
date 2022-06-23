import { MouseEvent, ReactNode } from 'react';

export type MenuItemOptionProps = {
  disabled?: boolean;
  icon: ReactNode;
  label: string;
  onClick: (event?: MouseEvent<HTMLElement>) => void;
  title?: string;
};
