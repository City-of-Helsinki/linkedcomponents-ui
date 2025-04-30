import { IconCogwheel, IconCrossCircle, IconPen } from 'hds-react';

import { EMPTY_MULTI_LANGUAGE_OBJECT } from '../../constants';
import { PriceGroupFormFields } from './types';

export enum PRICE_GROUP_FIELDS {
  DESCRIPTION = 'description',
  ID = 'id',
  IS_FREE = 'isFree',
  PUBLISHER = 'publisher',
}

export const PRICE_GROUP_INITIAL_VALUES: PriceGroupFormFields = {
  [PRICE_GROUP_FIELDS.DESCRIPTION]: EMPTY_MULTI_LANGUAGE_OBJECT,
  [PRICE_GROUP_FIELDS.ID]: '',
  [PRICE_GROUP_FIELDS.IS_FREE]: false,
  [PRICE_GROUP_FIELDS.PUBLISHER]: '',
};

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

export const PRICE_GROUP_FORM_SELECT_FIELDS = [PRICE_GROUP_FIELDS.PUBLISHER];

export const PRICE_GROUP_TEXT_FIELD_MAX_LENGTH = {
  [PRICE_GROUP_FIELDS.DESCRIPTION]: 255,
};
