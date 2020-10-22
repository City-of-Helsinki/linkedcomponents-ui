import reduce from 'lodash/reduce';

export enum EVENT_FIELDS {
  EVENT_INFO_LANGUAGES = 'eventInfoLanguages',
  HAS_UMBRELLA = 'hasUmbrella',
  IN_LANGUAGE = 'inLanguage',
  IS_UMBRELLA = 'isUmbrella',
  PROVIDER = 'provider',
  TYPE = 'type',
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
);

export const EVENT_INITIALVALUES = {
  [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: ['fi'],
  [EVENT_FIELDS.HAS_UMBRELLA]: false,
  [EVENT_FIELDS.IN_LANGUAGE]: ['fi'],
  [EVENT_FIELDS.IS_UMBRELLA]: false,
  [EVENT_FIELDS.PROVIDER]: EMPTY_MULTI_LANGUAGE_OBJECT,
  [EVENT_FIELDS.TYPE]: EVENT_TYPE.EVENT,
  [EVENT_FIELDS.UMBRELLA_EVENT]: null,
};
