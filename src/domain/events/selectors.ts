import { StoreState } from '../../types';

export const eventListTypeSelector = (state: StoreState) =>
  state.events.listType;

export const eventListPageSelector = (state: StoreState) => state.events.page;

export const eventListSortSelector = (state: StoreState) => state.events.sort;

export const eventListTabSelector = (state: StoreState) => state.events.tab;
