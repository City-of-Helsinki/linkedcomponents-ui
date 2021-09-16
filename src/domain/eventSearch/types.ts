import { EVENT_TYPE } from '../event/constants';
import { EVENT_SORT_OPTIONS } from '../events/constants';
import { EVENT_SEARCH_PARAMS } from './constants';

export type EventSearchParams = {
  [EVENT_SEARCH_PARAMS.END]?: Date | null;
  [EVENT_SEARCH_PARAMS.PAGE]?: number | null;
  [EVENT_SEARCH_PARAMS.PLACE]?: string[];
  [EVENT_SEARCH_PARAMS.RETURN_PATH]?: string | null;
  [EVENT_SEARCH_PARAMS.SORT]?: EVENT_SORT_OPTIONS | null;
  [EVENT_SEARCH_PARAMS.START]?: Date | null;
  [EVENT_SEARCH_PARAMS.TEXT]: string;
  [EVENT_SEARCH_PARAMS.TYPE]?: EVENT_TYPE[];
};

export type EventSearchInitialValues = {
  end: Date | null;
  page: number;
  places: string[];
  [EVENT_SEARCH_PARAMS.SORT]: EVENT_SORT_OPTIONS;
  start: Date | null;
  text: string;
  types: EVENT_TYPE[];
};

export type EventFilterType = 'date' | 'place' | 'text' | 'type';

export type EventSearchParam = keyof EventSearchParams;

export type EventsLocationState = {
  eventId: string;
};
