import { EVENT_SEARCH_PARAMS } from './constants';

export type EventFilters = {
  [EVENT_SEARCH_PARAMS.END]?: Date | null;
  [EVENT_SEARCH_PARAMS.PLACE]?: string[];
  [EVENT_SEARCH_PARAMS.START]?: Date | null;
  [EVENT_SEARCH_PARAMS.TEXT]: string;
  [EVENT_SEARCH_PARAMS.TYPE]?: string[];
};

export type EventSearchInitialValues = {
  end: Date | null;
  places: string[];
  start: Date | null;
  text: string;
  types: string[];
};

export type EventFilterType = 'date' | 'place' | 'text' | 'type';
