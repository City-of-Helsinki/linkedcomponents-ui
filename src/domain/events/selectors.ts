import { StoreState } from '../../types';

export const eventListTypeSelector = (state: StoreState) =>
  state.events.listOptions.listType;

export const eventListTabSelector = (state: StoreState) =>
  state.events.listOptions.tab;

export const expandedEventsSelector = (state: StoreState) =>
  state.events.expandedEvents;
