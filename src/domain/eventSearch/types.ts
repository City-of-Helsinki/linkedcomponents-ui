import { EVENT_SEARCH_PARAMS } from './constants';

export type EventFilters = {
  [EVENT_SEARCH_PARAMS.TEXT]: string;
};

export type EventSearchInitialValues = {
  text: string;
};
