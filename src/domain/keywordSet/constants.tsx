import { IconCogwheel, IconCrossCircle, IconPen } from 'hds-react';

import { EMPTY_MULTI_LANGUAGE_OBJECT } from '../../constants';
import { KeywordSetFormFields } from './types';

export enum KEYWORD_SET_FIELDS {
  DATA_SOURCE = 'dataSource',
  ID = 'id',
  KEYWORDS = 'keywords',
  NAME = 'name',
  ORIGIN_ID = 'originId',
  ORGANIZATION = 'organization',
  USAGE = 'usage',
}

export const KEYWORD_SET_INITIAL_VALUES: KeywordSetFormFields = {
  [KEYWORD_SET_FIELDS.DATA_SOURCE]: '',
  [KEYWORD_SET_FIELDS.ID]: '',
  [KEYWORD_SET_FIELDS.KEYWORDS]: [],
  [KEYWORD_SET_FIELDS.NAME]: EMPTY_MULTI_LANGUAGE_OBJECT,
  [KEYWORD_SET_FIELDS.ORIGIN_ID]: '',
  [KEYWORD_SET_FIELDS.ORGANIZATION]: '',
  [KEYWORD_SET_FIELDS.USAGE]: '',
};

export const KEYWORD_SET_FORM_SELECT_FIELDS = [
  KEYWORD_SET_FIELDS.KEYWORDS,
  KEYWORD_SET_FIELDS.ORGANIZATION,
  KEYWORD_SET_FIELDS.USAGE,
];

export enum KEYWORD_SET_ACTIONS {
  CREATE = 'create',
  DELETE = 'delete',
  EDIT = 'edit',
  UPDATE = 'update',
}

export const KEYWORD_SET_ACTION_ICONS = {
  [KEYWORD_SET_ACTIONS.CREATE]: <IconPen aria-hidden={true} />,
  [KEYWORD_SET_ACTIONS.DELETE]: <IconCrossCircle aria-hidden={true} />,
  [KEYWORD_SET_ACTIONS.EDIT]: <IconCogwheel aria-hidden={true} />,
  [KEYWORD_SET_ACTIONS.UPDATE]: <IconPen aria-hidden={true} />,
};

export const KEYWORD_SET_ACTION_LABEL_KEYS = {
  [KEYWORD_SET_ACTIONS.CREATE]: 'common.save',
  [KEYWORD_SET_ACTIONS.DELETE]: 'keywordSet.form.buttonDelete',
  [KEYWORD_SET_ACTIONS.EDIT]: 'keywordSetsPage.actionButtons.edit',
  [KEYWORD_SET_ACTIONS.UPDATE]: 'common.save',
};

export const AUTHENTICATION_NOT_NEEDED = [KEYWORD_SET_ACTIONS.EDIT];

export const KEYWORD_SET_DATA_SOURCE =
  process.env.REACT_APP_KEYWORD_SET_DATA_SOURCE || 'helsinki';

export const TEST_KEYWORD_SET_ID = 'keyword_set:1';
