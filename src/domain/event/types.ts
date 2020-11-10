import { string } from 'yup';

import { EVENT_FIELDS, EVENT_INFO_LANGUAGES } from './constants';

export type MultiLanguageObject = {
  [EVENT_INFO_LANGUAGES.AR]: string;
  [EVENT_INFO_LANGUAGES.EN]: string;
  [EVENT_INFO_LANGUAGES.FI]: string;
  [EVENT_INFO_LANGUAGES.RU]: string;
  [EVENT_INFO_LANGUAGES.SV]: string;
  [EVENT_INFO_LANGUAGES.ZH_HANS]: string;
};

export type EventTime = {
  [EVENT_FIELDS.END_TIME]: Date | null;
  [EVENT_FIELDS.START_TIME]: Date | null;
};

export type Offer = {
  [EVENT_FIELDS.OFFER_DESCRIPTION]: MultiLanguageObject;
  [EVENT_FIELDS.OFFER_INFO_URL]: MultiLanguageObject;
  [EVENT_FIELDS.OFFER_PRICE]: MultiLanguageObject;
};
