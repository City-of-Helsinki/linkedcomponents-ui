import { IconCogwheel, IconCrossCircle, IconPen } from 'hds-react';

import { PlaceFormFields } from './types';

export enum PLACES_SORT_ORDER {
  NAME = 'name',
  POSTAL_CODE = 'postal_code',
  STREET_ADDRESS = 'street_address',
}

export const TEST_PLACE_ID = 'tprek:15321';

export const INTERNET_PLACE_ID =
  process.env.REACT_APP_INTERNET_PLACE_ID || 'helsinki:internet';

export enum PLACE_FIELDS {
  PUBLISHER = 'publisher',
}

export enum PLACE_ACTIONS {
  CREATE = 'create',
  DELETE = 'delete',
  EDIT = 'edit',
  UPDATE = 'update',
}

export const PLACE_ACTION_ICONS = {
  [PLACE_ACTIONS.CREATE]: <IconPen aria-hidden={true} />,
  [PLACE_ACTIONS.DELETE]: <IconCrossCircle aria-hidden={true} />,
  [PLACE_ACTIONS.EDIT]: <IconCogwheel aria-hidden={true} />,
  [PLACE_ACTIONS.UPDATE]: <IconPen aria-hidden={true} />,
};

export const PLACE_ACTION_LABEL_KEYS = {
  [PLACE_ACTIONS.CREATE]: 'common.save',
  [PLACE_ACTIONS.DELETE]: 'place.form.buttonDelete',
  [PLACE_ACTIONS.EDIT]: 'placesPage.actionButtons.edit',
  [PLACE_ACTIONS.UPDATE]: 'common.save',
};

export const PLACE_INITIAL_VALUES: PlaceFormFields = {
  [PLACE_FIELDS.PUBLISHER]: '',
};

export const AUTHENTICATION_NOT_NEEDED = [PLACE_ACTIONS.EDIT];
