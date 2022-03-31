import { PLACE_SEARCH_PARAMS, PLACE_SORT_OPTIONS } from './constants';

export type PlacesLocationState = {
  placeId: string;
};

export type PlaceSearchParams = {
  [PLACE_SEARCH_PARAMS.PAGE]?: number | null;
  [PLACE_SEARCH_PARAMS.RETURN_PATH]?: string | null;
  [PLACE_SEARCH_PARAMS.SORT]?: PLACE_SORT_OPTIONS | null;
  [PLACE_SEARCH_PARAMS.TEXT]?: string;
};

export type PlaceSearchParam = keyof PlaceSearchParams;

export type PlaceSearchInitialValues = {
  [PLACE_SEARCH_PARAMS.PAGE]: number;
  [PLACE_SEARCH_PARAMS.SORT]: PLACE_SORT_OPTIONS;
  [PLACE_SEARCH_PARAMS.TEXT]: string;
};
