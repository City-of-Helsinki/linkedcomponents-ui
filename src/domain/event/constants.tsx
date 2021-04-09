import {
  IconCalendarClock,
  IconCalendarCross,
  IconCalendarPlus,
  IconCheck,
  IconCogwheel,
  IconCross,
  IconPen,
} from 'hds-react';
import reduce from 'lodash/reduce';
import React from 'react';

import { DEFAULT_LICENSE_TYPE } from '../image/constants';
import {
  AddImageSettings,
  EventFormFields,
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

export enum ADD_IMAGE_FIELDS {
  SELECTED_IMAGE = 'selectedImage',
  URL = 'url',
}

export enum IMAGE_DETAILS_FIELDS {
  ALT_TEXT = 'altText',
  LICENSE = 'license',
  NAME = 'name',
  PHOTOGRAPHER_NAME = 'photographerName',
}

export enum VIDEO_DETAILS_FIELDS {
  ALT_TEXT = 'altText',
  NAME = 'name',
  URL = 'url',
}

export enum EXTENSION_COURSE_FIELDS {
  ENROLMENT_END_TIME = 'enrolmentEndTime',
  ENROLMENT_START_TIME = 'enrolmentStartTime',
  MAXIMUM_ATTENDEE_CAPACITY = 'maximumAttendeeCapacity',
  MINIMUM_ATTENDEE_CAPACITY = 'minimumAttendeeCapacity',
}

export enum EVENT_FIELDS {
  AUDIENCE = 'audience',
  AUDIENCE_MAX_AGE = 'audienceMaxAge',
  AUDIENCE_MIN_AGE = 'audienceMinAge',
  DESCRIPTION = 'description',
  END_TIME = 'endTime',
  EVENT_INFO_LANGUAGES = 'eventInfoLanguages',
  EVENT_TIMES = 'eventTimes',
  EXTENSION_COURSE = 'extensionCourse',
  FACEBOOK_URL = 'facebookUrl',
  HAS_PRICE = 'hasPrice',
  HAS_UMBRELLA = 'hasUmbrella',
  IMAGES = 'images',
  IMAGE_DETAILS = 'imageDetails',
  IN_LANGUAGE = 'inLanguage',
  INFO_URL = 'infoUrl',
  INSTAGRAM_URL = 'instagramUrl',
  IS_IMAGE_EDITABLE = 'isImageEditable',
  IS_VERIFIED = 'isVerified',
  IS_UMBRELLA = 'isUmbrella',
  KEYWORDS = 'keywords',
  LOCATION = 'location',
  LOCATION_EXTRA_INFO = 'locationExtraInfo',
  MAIN_CATEGORIES = 'mainCategories',
  NAME = 'name',
  OFFER_DESCRIPTION = 'description',
  OFFER_INFO_URL = 'infoUrl',
  OFFER_IS_FREE = 'isFree',
  OFFER_PRICE = 'price',
  OFFERS = 'offers',
  PROVIDER = 'provider',
  PUBLISHER = 'publisher',
  RECURRING_EVENTS = 'recurringEvents',
  SHORT_DESCRIPTION = 'shortDescription',
  START_TIME = 'startTime',
  SUPER_EVENT = 'superEvent',
  TYPE = 'type',
  TWITTER_URL = 'twitterUrl',
  VIDEOS = 'videos',
}

export enum EVENT_INFO_LANGUAGES {
  AR = 'ar',
  EN = 'en',
  FI = 'fi',
  RU = 'ru',
  SV = 'sv',
  ZH_HANS = 'zhHans',
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

export const ADD_IMAGE_INITIAL_VALUES: AddImageSettings = {
  [ADD_IMAGE_FIELDS.SELECTED_IMAGE]: [],
  [ADD_IMAGE_FIELDS.URL]: '',
};

export const EVENT_INITIAL_VALUES: EventFormFields = {
  [EVENT_FIELDS.AUDIENCE]: [],
  [EVENT_FIELDS.AUDIENCE_MAX_AGE]: '',
  [EVENT_FIELDS.AUDIENCE_MIN_AGE]: '',
  [EVENT_FIELDS.DESCRIPTION]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.END_TIME]: null,
  [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: ['fi'],
  [EVENT_FIELDS.EVENT_TIMES]: [],
  [EVENT_FIELDS.EXTENSION_COURSE]: {
    [EXTENSION_COURSE_FIELDS.ENROLMENT_END_TIME]: null,
    [EXTENSION_COURSE_FIELDS.ENROLMENT_START_TIME]: null,
    [EXTENSION_COURSE_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: '',
    [EXTENSION_COURSE_FIELDS.MINIMUM_ATTENDEE_CAPACITY]: '',
  },
  [EVENT_FIELDS.FACEBOOK_URL]: '',
  [EVENT_FIELDS.HAS_PRICE]: false,
  [EVENT_FIELDS.HAS_UMBRELLA]: false,
  [EVENT_FIELDS.IMAGES]: [],
  [EVENT_FIELDS.IMAGE_DETAILS]: {
    [IMAGE_DETAILS_FIELDS.ALT_TEXT]: '',
    [IMAGE_DETAILS_FIELDS.LICENSE]: DEFAULT_LICENSE_TYPE,
    [IMAGE_DETAILS_FIELDS.NAME]: '',
    [IMAGE_DETAILS_FIELDS.PHOTOGRAPHER_NAME]: '',
  },
  [EVENT_FIELDS.IN_LANGUAGE]: [],
  [EVENT_FIELDS.IS_VERIFIED]: false,
  [EVENT_FIELDS.INFO_URL]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.INSTAGRAM_URL]: '',
  [EVENT_FIELDS.IS_IMAGE_EDITABLE]: false,
  [EVENT_FIELDS.IS_UMBRELLA]: false,
  [EVENT_FIELDS.KEYWORDS]: [],
  [EVENT_FIELDS.LOCATION]: null,
  [EVENT_FIELDS.LOCATION_EXTRA_INFO]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.MAIN_CATEGORIES]: [],
  [EVENT_FIELDS.NAME]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.OFFERS]: [],
  [EVENT_FIELDS.PROVIDER]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.PUBLISHER]: '',
  [EVENT_FIELDS.RECURRING_EVENTS]: [],
  [EVENT_FIELDS.SHORT_DESCRIPTION]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.START_TIME]: null,
  [EVENT_FIELDS.SUPER_EVENT]: null,
  [EVENT_FIELDS.TYPE]: EVENT_TYPE.EVENT,
  [EVENT_FIELDS.TWITTER_URL]: '',
  [EVENT_FIELDS.VIDEOS]: [
    {
      [VIDEO_DETAILS_FIELDS.ALT_TEXT]: '',
      [VIDEO_DETAILS_FIELDS.NAME]: '',
      [VIDEO_DETAILS_FIELDS.URL]: '',
    },
  ],
};

export enum URL_PARAMS {
  TAB = 'tab',
}

export const IMAGE_ALT_TEXT_MIN_LENGTH = 6;

export const DESCRIPTION_SECTION_FIELDS = [
  EVENT_FIELDS.NAME,
  EVENT_FIELDS.DESCRIPTION,
  EVENT_FIELDS.SHORT_DESCRIPTION,
];

export const SELECT_FIELDS = [
  EVENT_FIELDS.KEYWORDS,
  EVENT_FIELDS.LOCATION,
  EVENT_FIELDS.SUPER_EVENT,
];

export const TEXT_EDITOR_ALLOWED_TAGS: string[] = [
  'a',
  'b',
  'br',
  'div',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'i',
  'li',
  'ol',
  'p',
  'span',
  'strong',
  'ul',
];

export const TEXT_EDITOR_FIELDS = [EVENT_FIELDS.DESCRIPTION];

export const EVENT_INCLUDES = [
  'audience',
  'keywords',
  'location',
  'sub_events',
  'super_event',
];

export enum EVENT_CREATE_ACTIONS {
  CREATE_DRAFT = 'createDraft',
  PUBLISH = 'publish',
}

export enum EVENT_EDIT_ACTIONS {
  CANCEL = 'cancel',
  COPY = 'copy',
  DELETE = 'delete',
  EDIT = 'edit',
  POSTPONE = 'postpone',
  PUBLISH = 'publish',
  UPDATE_DRAFT = 'updateDraft',
  UPDATE_PUBLIC = 'updatePublic',
}

export const AUHENTICATION_NOT_NEEDED = [
  EVENT_EDIT_ACTIONS.COPY,
  EVENT_EDIT_ACTIONS.EDIT,
];

export const NOT_ALLOWED_WHEN_CANCELLED = [
  EVENT_EDIT_ACTIONS.CANCEL,
  EVENT_EDIT_ACTIONS.POSTPONE,
  EVENT_EDIT_ACTIONS.PUBLISH,
  EVENT_EDIT_ACTIONS.UPDATE_DRAFT,
  EVENT_EDIT_ACTIONS.UPDATE_PUBLIC,
];

export const NOT_ALLOWED_WHEN_DELETED = [
  EVENT_EDIT_ACTIONS.CANCEL,
  EVENT_EDIT_ACTIONS.DELETE,
  EVENT_EDIT_ACTIONS.POSTPONE,
  EVENT_EDIT_ACTIONS.PUBLISH,
  EVENT_EDIT_ACTIONS.UPDATE_DRAFT,
  EVENT_EDIT_ACTIONS.UPDATE_PUBLIC,
];

export const NOT_ALLOWED_WHEN_IN_PAST = [
  EVENT_EDIT_ACTIONS.CANCEL,
  EVENT_EDIT_ACTIONS.POSTPONE,
  EVENT_EDIT_ACTIONS.PUBLISH,
  EVENT_EDIT_ACTIONS.UPDATE_DRAFT,
  EVENT_EDIT_ACTIONS.UPDATE_PUBLIC,
];

export const EVENT_EDIT_ICONS = {
  [EVENT_EDIT_ACTIONS.CANCEL]: <IconCalendarCross />,
  [EVENT_EDIT_ACTIONS.COPY]: <IconCalendarPlus />,
  [EVENT_EDIT_ACTIONS.DELETE]: <IconCross />,
  [EVENT_EDIT_ACTIONS.EDIT]: <IconCogwheel />,
  [EVENT_EDIT_ACTIONS.POSTPONE]: <IconCalendarClock />,
  [EVENT_EDIT_ACTIONS.PUBLISH]: <IconCheck />,
  [EVENT_EDIT_ACTIONS.UPDATE_DRAFT]: <IconPen />,
  [EVENT_EDIT_ACTIONS.UPDATE_PUBLIC]: <IconPen />,
};

export const EVENT_EDIT_LABEL_KEYS = {
  [EVENT_EDIT_ACTIONS.CANCEL]: 'event.form.buttonCancel',
  [EVENT_EDIT_ACTIONS.COPY]: 'event.form.buttonCopy',
  [EVENT_EDIT_ACTIONS.DELETE]: 'event.form.buttonDelete',
  [EVENT_EDIT_ACTIONS.EDIT]: 'event.form.buttonEdit',
  [EVENT_EDIT_ACTIONS.POSTPONE]: 'event.form.buttonPostpone',
  [EVENT_EDIT_ACTIONS.PUBLISH]: 'event.form.buttonAcceptAndPublish',
  [EVENT_EDIT_ACTIONS.UPDATE_DRAFT]: 'event.form.buttonUpdateDraft',
  [EVENT_EDIT_ACTIONS.UPDATE_PUBLIC]: 'event.form.buttonUpdatePublic',
};
