import { ADMIN_LIST_SEARCH_PARAMS } from '../constants';
import {
  AdminListSearchInitialValues,
  AdminListSearchParam,
  AdminListSearchParams,
} from '../types';
import addParamsToQueryString from './addParamsToQueryString';
import getValue from './getValue';
import replaceParamsToQueryString from './replaceParamsToQueryString';
import stripLanguageFromPath from './stripLanguageFromPath';
import { assertUnreachable } from './typescript';

export const getAdminListParamValue = ({
  param,
  value,
}: {
  param: AdminListSearchParam;
  value: string;
}): string => {
  switch (param) {
    case ADMIN_LIST_SEARCH_PARAMS.PAGE:
    case ADMIN_LIST_SEARCH_PARAMS.SORT:
    case ADMIN_LIST_SEARCH_PARAMS.TEXT:
      return value;
    case ADMIN_LIST_SEARCH_PARAMS.RETURN_PATH:
      return stripLanguageFromPath(value);
    default:
      return assertUnreachable(
        param,
        'Unknown admin list page query parameter'
      );
  }
};

export const addParamsToAdminListQueryString = (
  queryString: string,
  queryParams: Partial<AdminListSearchParams>
): string => {
  return addParamsToQueryString<AdminListSearchParams>(
    queryString,
    queryParams,
    getAdminListParamValue
  );
};

export const replaceParamsToAdminListQueryString = (
  queryString: string,
  queryParams: Partial<AdminListSearchParams>
): string => {
  return replaceParamsToQueryString<AdminListSearchParams>(
    queryString,
    queryParams,
    getAdminListParamValue
  );
};

export const getAdminListSearchInitialValues = <SortType>(
  search: string,
  sortOptions: string[],
  defaultSort: SortType
): AdminListSearchInitialValues<SortType> => {
  const searchParams = new URLSearchParams(search);
  const page = searchParams.get(ADMIN_LIST_SEARCH_PARAMS.PAGE);
  const sort = searchParams.get(ADMIN_LIST_SEARCH_PARAMS.SORT);
  const text = searchParams.get(ADMIN_LIST_SEARCH_PARAMS.TEXT);

  return {
    page: Number(page) || 1,
    sort: (sort && sortOptions.includes(sort) ? sort : defaultSort) as SortType,
    text: getValue(text, ''),
  };
};
