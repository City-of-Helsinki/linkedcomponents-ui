import { EventStatus } from '../../generated/graphql';
import { EVENT_TYPE } from '../event/constants';
import {
  EVENT_LIST_TYPES,
  EVENT_SEARCH_PARAMS,
  EVENT_SORT_OPTIONS,
  EventListOptionsActionTypes,
  EVENTS_PAGE_TABS,
  ExpandedEventsActionTypes,
} from './constants';

export type ExpandedEventsState = string[];

export interface ExpandedEventsAction {
  type: ExpandedEventsActionTypes;
  payload: string;
}

export interface EventListOptionsState {
  listType: EVENT_LIST_TYPES;
  tab: EVENTS_PAGE_TABS;
}

export interface EventListOptionsAction {
  type: EventListOptionsActionTypes;
  payload: Partial<EventListOptionsState>;
}

export type EventsPageSettings = {
  expandedEvents: ExpandedEventsState;
  listOptions: EventListOptionsState;
};

export interface EventsActions {
  addExpandedEvent: (id: string) => void;
  removeExpandedEvent: (id: string) => void;
  setEventListOptions: (options: Partial<EventListOptionsState>) => void;
}

export type EventsPageSettingsState = EventsPageSettings & EventsActions;

export type EventSearchInitialValues = {
  end: Date | null;
  eventStatus: EventStatus[];
  page: number;
  places: string[];
  publisher: string[];
  [EVENT_SEARCH_PARAMS.SORT]: EVENT_SORT_OPTIONS;
  start: Date | null;
  text: string;
  types: EVENT_TYPE[];
};

export type EventSearchParams = {
  [EVENT_SEARCH_PARAMS.END]?: Date | null;
  [EVENT_SEARCH_PARAMS.EVENT_STATUS]?: EventStatus[];
  [EVENT_SEARCH_PARAMS.PAGE]?: number | null;
  [EVENT_SEARCH_PARAMS.PLACE]?: string[];
  [EVENT_SEARCH_PARAMS.PUBLISHER]?: string[];
  [EVENT_SEARCH_PARAMS.RETURN_PATH]?: string | null;
  [EVENT_SEARCH_PARAMS.SORT]?: EVENT_SORT_OPTIONS | null;
  [EVENT_SEARCH_PARAMS.START]?: Date | null;
  [EVENT_SEARCH_PARAMS.TEXT]: string;
  [EVENT_SEARCH_PARAMS.TYPE]?: EVENT_TYPE[];
};

export type EventSearchParam = keyof EventSearchParams;

export type EventsLocationState = {
  eventId: string;
};
