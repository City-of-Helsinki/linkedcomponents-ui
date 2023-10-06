import { IconCogwheel, IconCrossCircle, IconPen } from 'hds-react';

import { EMPTY_MULTI_LANGUAGE_OBJECT } from '../../constants';
import { PlaceFormFields } from './types';

export enum PLACES_SORT_ORDER {
  NAME = 'name',
  POSTAL_CODE = 'postal_code',
  STREET_ADDRESS = 'street_address',
}

export const TEST_PLACE_ID = 'tprek:15321';

export const INTERNET_PLACE_ID =
  import.meta.env.VITE_INTERNET_PLACE_ID || 'helsinki:internet';

export enum PLACE_FIELDS {
  ADDRESS_LOCALITY = 'addressLocality',
  ADDRESS_REGION = 'addressRegion',
  CONTACT_TYPE = 'contactType',
  COORDINATES = 'coordinates',
  DATA_SOURCE = 'dataSource',
  DESCRIPTION = 'description',
  EMAIL = 'email',
  ID = 'id',
  INFO_URL = 'infoUrl',
  NAME = 'name',
  ORIGIN_ID = 'originId',
  POSTAL_CODE = 'postalCode',
  POST_OFFICE_BOX_NUM = 'postOfficeBoxNum',
  PUBLISHER = 'publisher',
  STREET_ADDRESS = 'streetAddress',
  TELEPHONE = 'telephone',
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
  [PLACE_FIELDS.ADDRESS_LOCALITY]: EMPTY_MULTI_LANGUAGE_OBJECT,
  [PLACE_FIELDS.ADDRESS_REGION]: '',
  [PLACE_FIELDS.CONTACT_TYPE]: '',
  [PLACE_FIELDS.COORDINATES]: null,
  [PLACE_FIELDS.DATA_SOURCE]: '',
  [PLACE_FIELDS.DESCRIPTION]: EMPTY_MULTI_LANGUAGE_OBJECT,
  [PLACE_FIELDS.EMAIL]: '',
  [PLACE_FIELDS.ID]: '',
  [PLACE_FIELDS.INFO_URL]: EMPTY_MULTI_LANGUAGE_OBJECT,
  [PLACE_FIELDS.NAME]: EMPTY_MULTI_LANGUAGE_OBJECT,
  [PLACE_FIELDS.ORIGIN_ID]: '',
  [PLACE_FIELDS.POSTAL_CODE]: '',
  [PLACE_FIELDS.POST_OFFICE_BOX_NUM]: '',
  [PLACE_FIELDS.PUBLISHER]: '',
  [PLACE_FIELDS.STREET_ADDRESS]: EMPTY_MULTI_LANGUAGE_OBJECT,
  [PLACE_FIELDS.TELEPHONE]: EMPTY_MULTI_LANGUAGE_OBJECT,
};

export const AUTHENTICATION_NOT_NEEDED = [PLACE_ACTIONS.EDIT];

export const PLACE_FORM_SELECT_FIELDS = [PLACE_FIELDS.PUBLISHER];
