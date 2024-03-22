import { ImagesQueryVariables } from '../../generated/graphql';
import { AdminListSearchInitialValues } from '../../types';
import { getAdminListSearchInitialValues } from '../../utils/adminListQueryStringUtils';
import getPathBuilder from '../../utils/getPathBuilder';
import { imagesPathBuilder } from '../image/utils';
import {
  DEFAULT_IMAGE_SORT,
  IMAGE_SORT_OPTIONS,
  IMAGES_PAGE_SIZE,
} from './constants';

export const getImageSearchInitialValues = (
  search: string
): AdminListSearchInitialValues<IMAGE_SORT_OPTIONS> =>
  getAdminListSearchInitialValues<IMAGE_SORT_OPTIONS>(
    search,
    Object.values(IMAGE_SORT_OPTIONS),
    DEFAULT_IMAGE_SORT
  );

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
