import React from 'react';

import addParamsToQueryString from '../../utils/addParamsToQueryString';
import getValue from '../../utils/getValue';
import replaceParamsToQueryString from '../../utils/replaceParamsToQueryString';
import stripLanguageFromPath from '../../utils/stripLanguageFromPath';
import { assertUnreachable } from '../../utils/typescript';
import {
  DEFAULT_ORGANIZATION_SORT,
  ExpandedOrganizationsActionTypes,
  ORGANIZATION_SEARCH_PARAMS,
  ORGANIZATION_SORT_OPTIONS,
} from './constants';
import {
  ExpandedOrganizationsAction,
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
    text: getValue(text, ''),
  };
};

export const getOrganizationItemId = (id: string): string =>
  `organization-item-${id}`;

export const addExpandedOrganization = ({
  dispatchExpandedOrganizationsState,
  id,
}: {
  dispatchExpandedOrganizationsState: React.Dispatch<ExpandedOrganizationsAction>;
  id: string;
}) => {
  dispatchExpandedOrganizationsState({
    type: ExpandedOrganizationsActionTypes.ADD_EXPANDED_ORGANIZATION,
    payload: id,
  });
};

export const removeExpandedOrganization = ({
  dispatchExpandedOrganizationsState,
  id,
}: {
  dispatchExpandedOrganizationsState: React.Dispatch<ExpandedOrganizationsAction>;
  id: string;
}) => {
  dispatchExpandedOrganizationsState({
    type: ExpandedOrganizationsActionTypes.REMOVE_EXPANDED_ORGANIZATION,
    payload: id,
  });
};
