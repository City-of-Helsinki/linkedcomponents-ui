import { IconCogwheel, IconCrossCircle, IconPen } from 'hds-react';

import { EMPTY_MULTI_LANGUAGE_OBJECT } from '../../constants';
import { KeywordFormFields } from './types';

export const REMOTE_PARTICIPATION_KEYWORD_ID =
  import.meta.env.REACT_APP_REMOTE_PARTICIPATION_KEYWORD_ID || 'yso:p26626';

// eslint-disable-next-line max-len
export const REMOTE_PARTICIPATION_KEYWORD = `${
  import.meta.env.REACT_APP_LINKED_EVENTS_URL
}/keyword/${REMOTE_PARTICIPATION_KEYWORD_ID}/`;

export const TEST_KEYWORD_ID = 'keyword:1';

export enum KEYWORD_FIELDS {
  DATA_SOURCE = 'dataSource',
  DEPRECATED = 'deprecated',
  ID = 'id',
  NAME = 'name',
  ORIGIN_ID = 'originId',
  PUBLISHER = 'publisher',
  REPLACED_BY = 'replacedBy',
}

export enum KEYWORD_ACTIONS {
  CREATE = 'create',
  DELETE = 'delete',
  EDIT = 'edit',
  UPDATE = 'update',
}

export const KEYWORD_ACTION_ICONS = {
  [KEYWORD_ACTIONS.CREATE]: <IconPen aria-hidden={true} />,
  [KEYWORD_ACTIONS.DELETE]: <IconCrossCircle aria-hidden={true} />,
  [KEYWORD_ACTIONS.EDIT]: <IconCogwheel aria-hidden={true} />,
  [KEYWORD_ACTIONS.UPDATE]: <IconPen aria-hidden={true} />,
};

export const KEYWORD_ACTION_LABEL_KEYS = {
  [KEYWORD_ACTIONS.CREATE]: 'common.save',
  [KEYWORD_ACTIONS.DELETE]: 'keyword.form.buttonDelete',
  [KEYWORD_ACTIONS.EDIT]: 'keywordsPage.actionButtons.edit',
  [KEYWORD_ACTIONS.UPDATE]: 'common.save',
};

export const AUTHENTICATION_NOT_NEEDED = [KEYWORD_ACTIONS.EDIT];

export const KEYWORD_INITIAL_VALUES: KeywordFormFields = {
  [KEYWORD_FIELDS.DATA_SOURCE]: '',
  [KEYWORD_FIELDS.DEPRECATED]: false,
  [KEYWORD_FIELDS.ID]: '',
  [KEYWORD_FIELDS.NAME]: EMPTY_MULTI_LANGUAGE_OBJECT,
  [KEYWORD_FIELDS.ORIGIN_ID]: '',
  [KEYWORD_FIELDS.PUBLISHER]: '',
  [KEYWORD_FIELDS.REPLACED_BY]: '',
};
