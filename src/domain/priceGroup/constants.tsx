import { IconCogwheel, IconCrossCircle, IconPen } from 'hds-react';

export enum PRICE_GROUP_ACTIONS {
  CREATE = 'create',
  DELETE = 'delete',
  EDIT = 'edit',
  UPDATE = 'update',
}

export const PRICE_GROUP_ACTION_ICONS = {
  [PRICE_GROUP_ACTIONS.CREATE]: <IconPen aria-hidden={true} />,
  [PRICE_GROUP_ACTIONS.DELETE]: <IconCrossCircle aria-hidden={true} />,
  [PRICE_GROUP_ACTIONS.EDIT]: <IconCogwheel aria-hidden={true} />,
  [PRICE_GROUP_ACTIONS.UPDATE]: <IconPen aria-hidden={true} />,
};

export const PRICE_GROUP_ACTION_LABEL_KEYS = {
  [PRICE_GROUP_ACTIONS.CREATE]: 'common.save',
  [PRICE_GROUP_ACTIONS.DELETE]: 'priceGroup.form.buttonDelete',
  [PRICE_GROUP_ACTIONS.EDIT]: 'priceGroupsPage.actionButtons.edit',
  [PRICE_GROUP_ACTIONS.UPDATE]: 'common.save',
};

export const AUTHENTICATION_NOT_NEEDED = [PRICE_GROUP_ACTIONS.EDIT];

export const TEST_PRICE_GROUP_ID = 123;

export enum PRICE_GROUP_SEARCH_PARAMS {
  PAGE = 'page',
  RETURN_PATH = 'returnPath',
  SORT = 'sort',
  TEXT = 'text',
}

export const PRICE_GROUPS_PAGE_SIZE = 10;

export const PRICE_GROUPS_PAGE_SIZE_LARGE = 100;
