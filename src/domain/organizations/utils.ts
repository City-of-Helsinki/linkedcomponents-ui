import addParamsToQueryString from '../../utils/addParamsToQueryString';
import replaceParamsToQueryString from '../../utils/replaceParamsToQueryString';
import stripLanguageFromPath from '../../utils/stripLanguageFromPath';
import { assertUnreachable } from '../../utils/typescript';
import {
  DEFAULT_ORGANIZATION_SORT,
  ORGANIZATION_SEARCH_PARAMS,
  ORGANIZATION_SORT_OPTIONS,
} from './constants';
import {
  OrganizationSearchInitialValues,
  OrganizationSearchParam,
  OrganizationSearchParams,
} from './types';

export const getOrganizationParamValue = ({
  param,
  value,
}: {
  param: OrganizationSearchParam;
  value: string;
}): string => {
  switch (param) {
    case ORGANIZATION_SEARCH_PARAMS.SORT:
    case ORGANIZATION_SEARCH_PARAMS.TEXT:
      return value;
    case ORGANIZATION_SEARCH_PARAMS.RETURN_PATH:
      return stripLanguageFromPath(value);
    default:
      return assertUnreachable(param, 'Unknown organization query parameter');
  }
};

export const addParamsToOrganizationQueryString = (
  queryString: string,
  queryParams: Partial<OrganizationSearchParams>
): string => {
  return addParamsToQueryString<OrganizationSearchParams>(
    queryString,
    queryParams,
    getOrganizationParamValue
  );
};

export const replaceParamsToOrganizationQueryString = (
  queryString: string,
  queryParams: Partial<OrganizationSearchParams>
): string => {
  return replaceParamsToQueryString<OrganizationSearchParams>(
    queryString,
    queryParams,
    getOrganizationParamValue
  );
};

export const getOrganizationSearchInitialValues = (
  search: string
): OrganizationSearchInitialValues => {
  const searchParams = new URLSearchParams(search);
  const sort = searchParams.get(
    ORGANIZATION_SEARCH_PARAMS.SORT
  ) as ORGANIZATION_SORT_OPTIONS;
  const text = searchParams.get(ORGANIZATION_SEARCH_PARAMS.TEXT);

  return {
    sort: Object.values(ORGANIZATION_SORT_OPTIONS).includes(sort)
      ? sort
      : DEFAULT_ORGANIZATION_SORT,
    text: text || '',
  };
};

export const getOrganizationItemId = (id: string): string =>
  `organization-item-${id}`;
