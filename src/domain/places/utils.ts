import { PlacesQueryVariables } from '../../generated/graphql';
import { AdminListSearchInitialValues } from '../../types';
import { getAdminListSearchInitialValues } from '../../utils/adminListQueryStringUtils';
import getPathBuilder from '../../utils/getPathBuilder';
import { placesPathBuilder } from '../place/utils';
import {
  DEFAULT_PLACE_SORT,
  PLACE_SORT_OPTIONS,
  PLACES_PAGE_SIZE,
} from './constants';

export const getPlaceSearchInitialValues = (
  search: string
): AdminListSearchInitialValues<PLACE_SORT_OPTIONS> =>
  getAdminListSearchInitialValues<PLACE_SORT_OPTIONS>(
    search,
    Object.values(PLACE_SORT_OPTIONS),
    DEFAULT_PLACE_SORT
  );

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
