export enum PLACE_SORT_OPTIONS {
  ID = 'id',
  ID_DESC = '-id',
  NAME = 'name',
  NAME_DESC = '-name',
  N_EVENTS = 'n_events',
  N_EVENTS_DESC = '-n_events',
  STREET_ADDRESS = 'street_address',
  STREET_ADDRESS_DESC = '-street_address',
}

export const DEFAULT_PLACE_SORT = PLACE_SORT_OPTIONS.N_EVENTS_DESC;

export enum PLACE_SEARCH_PARAMS {
  PAGE = 'page',
  RETURN_PATH = 'returnPath',
  SORT = 'sort',
  TEXT = 'text',
}

export const PLACES_PAGE_SIZE = 10;
