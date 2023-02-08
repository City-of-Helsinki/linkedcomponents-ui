import { ImagesQueryVariables } from '../../generated/graphql';
import addParamsToQueryString from '../../utils/addParamsToQueryString';
import getPathBuilder from '../../utils/getPathBuilder';
import getValue from '../../utils/getValue';
import replaceParamsToQueryString from '../../utils/replaceParamsToQueryString';
import stripLanguageFromPath from '../../utils/stripLanguageFromPath';
import { assertUnreachable } from '../../utils/typescript';
import { imagesPathBuilder } from '../image/utils';
import {
  DEFAULT_IMAGE_SORT,
  IMAGE_SEARCH_PARAMS,
  IMAGE_SORT_OPTIONS,
  IMAGES_PAGE_SIZE,
} from './constants';
import {
  ImageSearchInitialValues,
  ImageSearchParam,
  ImageSearchParams,
} from './types';

export const getImageSearchInitialValues = (
  search: string
): ImageSearchInitialValues => {
  const searchParams = new URLSearchParams(search);
  const page = searchParams.get(IMAGE_SEARCH_PARAMS.PAGE);
  const sort = searchParams.get(IMAGE_SEARCH_PARAMS.SORT) as IMAGE_SORT_OPTIONS;
  const text = searchParams.get(IMAGE_SEARCH_PARAMS.TEXT);

  return {
    page: Number(page) || 1,
    sort: Object.values(IMAGE_SORT_OPTIONS).includes(sort)
      ? sort
      : DEFAULT_IMAGE_SORT,
    text: getValue(text, ''),
  };
};

export const getImagesQueryVariables = (
  search: string
): ImagesQueryVariables => {
  const { page, sort, text } = getImageSearchInitialValues(search);

  return {
    createPath: getPathBuilder(imagesPathBuilder),
    page,
    pageSize: IMAGES_PAGE_SIZE,
    sort,
    text,
  };
};

export const getImageParamValue = ({
  param,
  value,
}: {
  param: ImageSearchParam;
  value: string;
}): string => {
  switch (param) {
    case IMAGE_SEARCH_PARAMS.PAGE:
    case IMAGE_SEARCH_PARAMS.SORT:
    case IMAGE_SEARCH_PARAMS.TEXT:
      return value;
    case IMAGE_SEARCH_PARAMS.RETURN_PATH:
      return stripLanguageFromPath(value);
    default:
      return assertUnreachable(param, 'Unknown image query parameter');
  }
};

export const addParamsToImageQueryString = (
  queryString: string,
  queryParams: Partial<ImageSearchParams>
): string => {
  return addParamsToQueryString<ImageSearchParams>(
    queryString,
    queryParams,
    getImageParamValue
  );
};

export const replaceParamsToImageQueryString = (
  queryString: string,
  queryParams: Partial<ImageSearchParams>
): string => {
  return replaceParamsToQueryString<ImageSearchParams>(
    queryString,
    queryParams,
    getImageParamValue
  );
};
