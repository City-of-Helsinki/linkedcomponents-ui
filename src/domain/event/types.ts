import {
  ADD_IMAGE_FIELDS,
  EVENT_FIELDS,
  EVENT_INFO_LANGUAGES,
  EXTENSION_COURSE_FIELDS,
  RECURRING_EVENT_FIELDS,
} from './constants';

export type EventFields = {
  [EVENT_FIELDS.AUDIENCE]: string[];
  [EVENT_FIELDS.AUDIENCE_MAX_AGE]: number | '';
  [EVENT_FIELDS.AUDIENCE_MIN_AGE]: number | '';
  [EVENT_FIELDS.DESCRIPTION]: MultiLanguageObject;
  [EVENT_FIELDS.END_TIME]: Date | null;
  [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: string[];
  [EVENT_FIELDS.EVENT_TIMES]: EventTime[];
  [EVENT_FIELDS.EXTENSION_COURSE]: ExtensionCourse;
  [EVENT_FIELDS.FACEBOOK_URL]: string;
  [EVENT_FIELDS.INSTAGRAM_URL]: string;
  [EVENT_FIELDS.HAS_PRICE]: boolean;
  [EVENT_FIELDS.HAS_UMBRELLA]: boolean;
  [EVENT_FIELDS.IN_LANGUAGE]: string[];
  [EVENT_FIELDS.INFO_URL]: MultiLanguageObject;
  [EVENT_FIELDS.INSTAGRAM_URL]: string;
  [EVENT_FIELDS.IS_UMBRELLA]: boolean;
  [EVENT_FIELDS.KEYWORDS]: string[];
  [EVENT_FIELDS.LOCATION]: string | null;
  [EVENT_FIELDS.LOCATION_EXTRA_INFO]: MultiLanguageObject;
  [EVENT_FIELDS.NAME]: MultiLanguageObject;
  [EVENT_FIELDS.OFFERS]: Offer[];
  [EVENT_FIELDS.PROVIDER]: MultiLanguageObject;
  [EVENT_FIELDS.RECURRING_EVENTS]: RecurringEventSettings[];
  [EVENT_FIELDS.SHORT_DESCRIPTION]: MultiLanguageObject;
  [EVENT_FIELDS.START_TIME]: Date | null;
  [EVENT_FIELDS.TYPE]: string;
  [EVENT_FIELDS.TWITTER_URL]: string;
  [EVENT_FIELDS.UMBRELLA_EVENT]: string | null;
};

export type MultiLanguageObject = {
  [EVENT_INFO_LANGUAGES.AR]: string;
  [EVENT_INFO_LANGUAGES.EN]: string;
  [EVENT_INFO_LANGUAGES.FI]: string;
  [EVENT_INFO_LANGUAGES.RU]: string;
  [EVENT_INFO_LANGUAGES.SV]: string;
  [EVENT_INFO_LANGUAGES.ZH_HANS]: string;
};

export type ExtensionCourse = {
  [EXTENSION_COURSE_FIELDS.ENROLMENT_END_TIME]: Date | null;
  [EXTENSION_COURSE_FIELDS.ENROLMENT_START_TIME]: Date | null;
  [EXTENSION_COURSE_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: number | '';
  [EXTENSION_COURSE_FIELDS.MINIMUM_ATTENDEE_CAPACITY]: number | '';
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

export type RecurringEventSettings = {
  [RECURRING_EVENT_FIELDS.END_DATE]: Date | null;
  [RECURRING_EVENT_FIELDS.END_TIME]: string;
  [RECURRING_EVENT_FIELDS.REPEAT_DAYS]: string[];
  [RECURRING_EVENT_FIELDS.REPEAT_INTERVAL]: number;
  [RECURRING_EVENT_FIELDS.START_DATE]: Date | null;
  [RECURRING_EVENT_FIELDS.START_TIME]: string;
};

export type AddImageSettings = {
  [ADD_IMAGE_FIELDS.SELECTED_IMAGE]: string[];
  [ADD_IMAGE_FIELDS.URL]: string;
};
