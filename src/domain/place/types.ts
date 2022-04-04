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
  [PLACE_FIELDS.PUBLISHER]: string;
};
