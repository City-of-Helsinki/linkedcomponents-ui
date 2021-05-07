import { StoreState } from '../../types';
import { EVENT_LIST_TYPES, EVENTS_PAGE_TABS } from './constants';
import { ExpandedEventsState } from './types';

export const eventListTypeSelector = (state: StoreState): EVENT_LIST_TYPES =>
  state.events.listOptions.listType;

export const eventListTabSelector = (state: StoreState): EVENTS_PAGE_TABS =>
  state.events.listOptions.tab;

export const expandedEventsSelector = (
  state: StoreState
): ExpandedEventsState => state.events.expandedEvents;
