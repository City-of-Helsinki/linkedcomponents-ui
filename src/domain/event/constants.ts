import reduce from 'lodash/reduce';

import { WEEK_DAY } from '../../constants';
import {
  EventFields,
  MultiLanguageObject,
  RecurringEventSettings,
} from './types';

export enum RECURRING_EVENT_FIELDS {
  END_DATE = 'endDate',
  END_TIME = 'endTime',
  REPEAT_DAYS = 'repeatDays',
  REPEAT_INTERVAL = 'repeatInterval',
  START_DATE = 'startDate',
  START_TIME = 'startTime',
}

export enum EVENT_FIELDS {
  AUDIENCE = 'audience',
  DESCRIPTION = 'description',
  END_TIME = 'endTime',
  EVENT_INFO_LANGUAGES = 'eventInfoLanguages',
  EVENT_TIMES = 'eventTimes',
  FACEBOOK_URL = 'facebookUrl',
  HAS_PRICE = 'hasPrice',
  HAS_UMBRELLA = 'hasUmbrella',
  IN_LANGUAGE = 'inLanguage',
  INFO_URL = 'infoUrl',
  INSTAGRAM_URL = 'instagramUrl',
  IS_UMBRELLA = 'isUmbrella',
  KEYWORDS = 'keywords',
  LOCATION = 'location',
  LOCATION_EXTRA_INFO = 'locationExtraInfo',
  NAME = 'name',
  OFFER_DESCRIPTION = 'description',
  OFFER_INFO_URL = 'info_url',
  OFFER_IS_FREE = 'is_free',
  OFFER_PRICE = 'price',
  OFFERS = 'offers',
  PROVIDER = 'provider',
  RECURRING_EVENTS = 'recurringEvents',
  SHORT_DESCRIPTION = 'shortDescription',
  START_TIME = 'startTime',
  TYPE = 'type',
  TWITTER_URL = 'twitterUrl',
  UMBRELLA_EVENT = 'umbrellaEvent',
}

export enum EVENT_INFO_LANGUAGES {
  AR = 'ar',
  EN = 'en',
  FI = 'fi',
  RU = 'ru',
  SV = 'sv',
  ZH_HANS = 'zh_hans',
}

export const ORDERED_EVENT_INFO_LANGUAGES = [
  EVENT_INFO_LANGUAGES.FI,
  EVENT_INFO_LANGUAGES.SV,
  EVENT_INFO_LANGUAGES.EN,
  EVENT_INFO_LANGUAGES.RU,
  EVENT_INFO_LANGUAGES.ZH_HANS,
  EVENT_INFO_LANGUAGES.AR,
];

export enum EVENT_TYPE {
  COURSE = 'course',
  EVENT = 'event',
}

export const EMPTY_MULTI_LANGUAGE_OBJECT = reduce(
  EVENT_INFO_LANGUAGES,
  (acc, lang) => ({ ...acc, [lang]: '' }),
  {}
) as MultiLanguageObject;

export const RECURRING_EVENT_INITIAL_VALUES: RecurringEventSettings = {
  [RECURRING_EVENT_FIELDS.END_DATE]: null,
  [RECURRING_EVENT_FIELDS.END_TIME]: '',
  [RECURRING_EVENT_FIELDS.REPEAT_DAYS]: [],
  [RECURRING_EVENT_FIELDS.REPEAT_INTERVAL]: 1,
  [RECURRING_EVENT_FIELDS.START_DATE]: null,
  [RECURRING_EVENT_FIELDS.START_TIME]: '',
};

export const EVENT_INITIAL_VALUES: EventFields = {
  [EVENT_FIELDS.AUDIENCE]: [],
  [EVENT_FIELDS.DESCRIPTION]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.END_TIME]: null,
  [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: ['fi'],
  [EVENT_FIELDS.EVENT_TIMES]: [],
  [EVENT_FIELDS.FACEBOOK_URL]: '',
  [EVENT_FIELDS.HAS_PRICE]: false,
  [EVENT_FIELDS.HAS_UMBRELLA]: false,
  [EVENT_FIELDS.IN_LANGUAGE]: ['fi'],
  [EVENT_FIELDS.INFO_URL]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.INSTAGRAM_URL]: '',
  [EVENT_FIELDS.IS_UMBRELLA]: false,
  [EVENT_FIELDS.KEYWORDS]: [],
  [EVENT_FIELDS.LOCATION]: null,
  [EVENT_FIELDS.LOCATION_EXTRA_INFO]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.NAME]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.OFFERS]: [],
  [EVENT_FIELDS.PROVIDER]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.RECURRING_EVENTS]: [],
  [EVENT_FIELDS.SHORT_DESCRIPTION]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.START_TIME]: null,
  [EVENT_FIELDS.TYPE]: EVENT_TYPE.EVENT,
  [EVENT_FIELDS.TWITTER_URL]: '',
  [EVENT_FIELDS.UMBRELLA_EVENT]: null,
};
