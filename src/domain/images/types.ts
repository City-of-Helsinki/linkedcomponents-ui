import { IMAGE_SEARCH_PARAMS, IMAGE_SORT_OPTIONS } from './constants';

export type ImagesLocationState = {
  imageId: string;
};

export type ImageSearchParams = {
  [IMAGE_SEARCH_PARAMS.PAGE]?: number | null;
  [IMAGE_SEARCH_PARAMS.RETURN_PATH]?: string | null;
  [IMAGE_SEARCH_PARAMS.SORT]?: IMAGE_SORT_OPTIONS | null;
  [IMAGE_SEARCH_PARAMS.TEXT]?: string;
};

export type ImageSearchParam = keyof ImageSearchParams;

export type ImageSearchInitialValues = {
  [IMAGE_SEARCH_PARAMS.PAGE]: number;
  [IMAGE_SEARCH_PARAMS.SORT]: IMAGE_SORT_OPTIONS;
  [IMAGE_SEARCH_PARAMS.TEXT]: string;
};
