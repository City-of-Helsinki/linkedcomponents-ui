export enum IMAGE_SORT_OPTIONS {
  LAST_MODIFIED_TIME = 'last_modified_time',
  LAST_MODIFIED_TIME_DESC = '-last_modified_time',
}

export const DEFAULT_IMAGE_SORT = IMAGE_SORT_OPTIONS.LAST_MODIFIED_TIME_DESC;

export enum IMAGE_SEARCH_PARAMS {
  PAGE = 'page',
  RETURN_PATH = 'returnPath',
  SORT = 'sort',
  TEXT = 'text',
}

export const IMAGES_PAGE_SIZE = 10;