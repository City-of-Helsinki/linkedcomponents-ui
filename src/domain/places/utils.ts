import { PlacesQueryVariables } from '../../generated/graphql';
import addParamsToQueryString from '../../utils/addParamsToQueryString';
import getPathBuilder from '../../utils/getPathBuilder';
import getValue from '../../utils/getValue';
import replaceParamsToQueryString from '../../utils/replaceParamsToQueryString';
import stripLanguageFromPath from '../../utils/stripLanguageFromPath';
import { assertUnreachable } from '../../utils/typescript';
import { placesPathBuilder } from '../place/utils';
import {
  DEFAULT_PLACE_SORT,
  PLACE_SEARCH_PARAMS,
  PLACE_SORT_OPTIONS,
  PLACES_PAGE_SIZE,
} from './constants';
import {
  PlaceSearchInitialValues,
  PlaceSearchParam,
  PlaceSearchParams,
} from './types';

export const getPlaceSearchInitialValues = (
  search: string
): PlaceSearchInitialValues => {
  const searchParams = new URLSearchParams(search);
  const page = searchParams.get(PLACE_SEARCH_PARAMS.PAGE);
  const sort = searchParams.get(PLACE_SEARCH_PARAMS.SORT) as PLACE_SORT_OPTIONS;
  const text = searchParams.get(PLACE_SEARCH_PARAMS.TEXT);

  return {
    page: Number(page) || 1,
    sort: Object.values(PLACE_SORT_OPTIONS).includes(sort)
      ? sort
      : DEFAULT_PLACE_SORT,
    text: getValue(text, ''),
  };
};

export const getPlaceParamValue = ({
  param,
  value,
}: {
  param: PlaceSearchParam;
  value: string;
}): string => {
  switch (param) {
    case PLACE_SEARCH_PARAMS.PAGE:
    case PLACE_SEARCH_PARAMS.SORT:
    case PLACE_SEARCH_PARAMS.TEXT:
      return value;
    case PLACE_SEARCH_PARAMS.RETURN_PATH:
      return stripLanguageFromPath(value);
    default:
      return assertUnreachable(param, 'Unknown place query parameter');
  }
};

export const addParamsToPlaceQueryString = (
  queryString: string,
  queryParams: Partial<PlaceSearchParams>
): string => {
  return addParamsToQueryString<PlaceSearchParams>(
    queryString,
    queryParams,
    getPlaceParamValue
  );
};

export const replaceParamsToPlaceQueryString = (
  queryString: string,
  queryParams: Partial<PlaceSearchParams>
): string => {
  return replaceParamsToQueryString<PlaceSearchParams>(
    queryString,
    queryParams,
    getPlaceParamValue
  );
};

export const getPlacesQueryVariables = (
  search: string
): PlacesQueryVariables => {
  const { page, sort, text } = getPlaceSearchInitialValues(search);

  return {
    createPath: getPathBuilder(placesPathBuilder),
    page,
    pageSize: PLACES_PAGE_SIZE,
    showAllPlaces: true,
    sort,
    text,
  };
};
