import { EVENT_SEARCH_PARAMS } from './constants';

export type EventFilters = {
  [EVENT_SEARCH_PARAMS.PLACE]?: string[];
  [EVENT_SEARCH_PARAMS.TEXT]: string;
  [EVENT_SEARCH_PARAMS.TYPE]?: string[];
};

export type EventSearchInitialValues = {
  places: string[];
  text: string;
  types: string[];
};
