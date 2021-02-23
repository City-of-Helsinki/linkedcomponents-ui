import { StoreState } from '../../types';

export const eventListTypeSelector = (state: StoreState) =>
  state.events.listOptions.listType;

export const eventListPageSelector = (state: StoreState) =>
  state.events.listOptions.page;

export const eventListSortSelector = (state: StoreState) =>
  state.events.listOptions.sort;

export const eventListTabSelector = (state: StoreState) =>
  state.events.listOptions.tab;

export const expandedEventsSelector = (state: StoreState) =>
  state.events.expandedEvents;
