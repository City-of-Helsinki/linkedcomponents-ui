export enum IMAGE_SORT_OPTIONS {
  ID = 'id',
  ID_DESC = '-id',
  LAST_MODIFIED_TIME = 'last_modified_time',
  LAST_MODIFIED_TIME_DESC = '-last_modified_time',
  NAME = 'name',
  NAME_DESC = '-name',
}

export const DEFAULT_IMAGE_SORT = IMAGE_SORT_OPTIONS.LAST_MODIFIED_TIME_DESC;

export const IMAGES_PAGE_SIZE = 10;
