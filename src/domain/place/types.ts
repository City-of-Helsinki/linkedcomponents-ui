import { LatLng } from 'leaflet';

import { MultiLanguageObject } from '../../types';
import { PLACE_FIELDS } from './constants';

export type PlaceFields = {
  addressLocality: string;
  atId: string;
  dataSource: string;
  id: string;
  name: string;
  nEvents: number;
  placeUrl: string;
  publisher: string;
  streetAddress: string;
};

export type PlaceFormFields = {
  [PLACE_FIELDS.ADDRESS_LOCALITY]: MultiLanguageObject;
  [PLACE_FIELDS.ADDRESS_REGION]: string;
  [PLACE_FIELDS.COORDINATES]: LatLng | null;
  [PLACE_FIELDS.CONTACT_TYPE]: string;
  [PLACE_FIELDS.DATA_SOURCE]: string;
  [PLACE_FIELDS.DESCRIPTION]: MultiLanguageObject;
  [PLACE_FIELDS.EMAIL]: string;
  [PLACE_FIELDS.ID]: string;
  [PLACE_FIELDS.INFO_URL]: MultiLanguageObject;
  [PLACE_FIELDS.NAME]: MultiLanguageObject;
  [PLACE_FIELDS.ORIGIN_ID]: string;
  [PLACE_FIELDS.POST_OFFICE_BOX_NUM]: string;
  [PLACE_FIELDS.POSTAL_CODE]: string;
  [PLACE_FIELDS.PUBLISHER]: string;
  [PLACE_FIELDS.STREET_ADDRESS]: MultiLanguageObject;
  [PLACE_FIELDS.TELEPHONE]: MultiLanguageObject;
};
