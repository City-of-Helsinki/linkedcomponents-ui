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

import { MAX_PAGE_SIZE } from '../../constants';
import { EventsQueryVariables } from '../../generated/graphql';
import getPathBuilder from '../../utils/getPathBuilder';
import { EVENT_LIST_INCLUDES, EVENT_SORT_OPTIONS } from '../events/constants';
import { eventsPathBuilder } from '../events/utils';
import { DEFAULT_LICENSE_TYPE } from '../image/constants';
import {
  AddImageSettings,
  EventFormFields,
  MultiLanguageObject,
  RecurringEventSettings,
} from './types';

export enum EVENT_TYPE {
  General = 'general',
  Course = 'course',
  Volunteering = 'volunteering',
}

export enum RECURRING_EVENT_FIELDS {
  END_DATE = 'endDate',
  END_TIME = 'endTime',
  EVENT_TIMES = 'eventTimes',
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

export enum EVENT_TIME_FIELDS {
  END_TIME = 'endTime',
  ID = 'id',
  START_TIME = 'startTime',
}

export enum EXTERNAL_LINK_FIELDS {
  LINK = 'link',
  NAME = 'name',
}

export enum EVENT_FIELDS {
  AUDIENCE = 'audience',
  AUDIENCE_MAX_AGE = 'audienceMaxAge',
  AUDIENCE_MIN_AGE = 'audienceMinAge',
  DESCRIPTION = 'description',
  ENROLMENT_END_TIME = 'enrolmentEndTime',
  ENROLMENT_START_TIME = 'enrolmentStartTime',
  EVENT_INFO_LANGUAGES = 'eventInfoLanguages',
  EVENT_TIMES = 'eventTimes',
  EVENTS = 'events',
  EXTENSION_COURSE = 'extensionCourse',
  EXTERNAL_LINKS = 'externalLinks',
  HAS_PRICE = 'hasPrice',
  HAS_UMBRELLA = 'hasUmbrella',
  IMAGES = 'images',
  IMAGE_DETAILS = 'imageDetails',
  IN_LANGUAGE = 'inLanguage',
  INFO_URL = 'infoUrl',
  IS_IMAGE_EDITABLE = 'isImageEditable',
  IS_VERIFIED = 'isVerified',
  IS_UMBRELLA = 'isUmbrella',
  KEYWORDS = 'keywords',
  LOCATION = 'location',
  LOCATION_EXTRA_INFO = 'locationExtraInfo',
  MAIN_CATEGORIES = 'mainCategories',
  MAXIMUM_ATTENDEE_CAPACITY = 'maximumAttendeeCapacity',
  MINIMUM_ATTENDEE_CAPACITY = 'minimumAttendeeCapacity',
  NAME = 'name',
  OFFER_DESCRIPTION = 'description',
  OFFER_INFO_URL = 'infoUrl',
  OFFER_IS_FREE = 'isFree',
  OFFER_PRICE = 'price',
  OFFERS = 'offers',
  PROVIDER = 'provider',
  PUBLISHER = 'publisher',
  RECURRING_EVENTS = 'recurringEvents',
  RECURRING_EVENT_END_TIME = 'recurringEventEndTime',
  RECURRING_EVENT_START_TIME = 'recurringEventStartTime',
  SHORT_DESCRIPTION = 'shortDescription',
  SUPER_EVENT = 'superEvent',
  TYPE = 'type',
  VIDEOS = 'videos',
}

// Don't change languege order. The defines order of backup languages in localised strings
export enum EVENT_INFO_LANGUAGES {
  FI = 'fi',
  SV = 'sv',
  EN = 'en',
  RU = 'ru',
  ZH_HANS = 'zhHans',
  AR = 'ar',
}

export const ORDERED_EVENT_INFO_LANGUAGES = [
  EVENT_INFO_LANGUAGES.FI,
  EVENT_INFO_LANGUAGES.SV,
  EVENT_INFO_LANGUAGES.EN,
  EVENT_INFO_LANGUAGES.RU,
  EVENT_INFO_LANGUAGES.ZH_HANS,
  EVENT_INFO_LANGUAGES.AR,
];

export const EMPTY_MULTI_LANGUAGE_OBJECT = reduce(
  EVENT_INFO_LANGUAGES,
  (acc, lang) => ({ ...acc, [lang]: '' }),
  {}
) as MultiLanguageObject;

export const RECURRING_EVENT_INITIAL_VALUES: RecurringEventSettings = {
  [RECURRING_EVENT_FIELDS.END_DATE]: null,
  [RECURRING_EVENT_FIELDS.END_TIME]: '',
  [RECURRING_EVENT_FIELDS.EVENT_TIMES]: [],
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
  [EVENT_FIELDS.ENROLMENT_END_TIME]: null,
  [EVENT_FIELDS.ENROLMENT_START_TIME]: null,
  [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: ['fi'],
  [EVENT_FIELDS.EVENT_TIMES]: [],
  [EVENT_FIELDS.EVENTS]: [],
  [EVENT_FIELDS.EXTERNAL_LINKS]: [],
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
  [EVENT_FIELDS.IS_IMAGE_EDITABLE]: false,
  [EVENT_FIELDS.IS_UMBRELLA]: false,
  [EVENT_FIELDS.KEYWORDS]: [],
  [EVENT_FIELDS.LOCATION]: null,
  [EVENT_FIELDS.LOCATION_EXTRA_INFO]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.MAIN_CATEGORIES]: [],
  [EVENT_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: '',
  [EVENT_FIELDS.MINIMUM_ATTENDEE_CAPACITY]: '',
  [EVENT_FIELDS.NAME]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.OFFERS]: [],
  [EVENT_FIELDS.PROVIDER]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.PUBLISHER]: '',
  [EVENT_FIELDS.RECURRING_EVENTS]: [],
  [EVENT_FIELDS.RECURRING_EVENT_END_TIME]: null,
  [EVENT_FIELDS.RECURRING_EVENT_START_TIME]: null,
  [EVENT_FIELDS.SHORT_DESCRIPTION]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },

  [EVENT_FIELDS.SUPER_EVENT]: null,
  [EVENT_FIELDS.TYPE]: EVENT_TYPE.General,
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

export const EVENT_SELECT_FIELDS = [
  EVENT_FIELDS.KEYWORDS,
  EVENT_FIELDS.LOCATION,
  EVENT_FIELDS.SUPER_EVENT,
];

export const TEXT_EDITOR_ALLOWED_TAGS: string[] = [
  'a',
  'abbr',
  'acronym',
  'b',
  'br',
  'blockquote',
  'code',
  'div',
  'em',
  'i',
  'li',
  'ol',
  'p',
  'strong',
  'ul',
];

export const TEXT_EDITOR_FIELDS = [EVENT_FIELDS.DESCRIPTION];

export const EVENT_FIELD_ARRAYS: string[] = [
  EVENT_FIELDS.EVENT_TIMES,
  EVENT_FIELDS.OFFERS,
];

export const EVENT_INCLUDES = ['in_language', 'sub_events', 'super_event'];

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
export const SUB_EVENTS_VARIABLES: EventsQueryVariables = {
  createPath: getPathBuilder(eventsPathBuilder),
  include: EVENT_LIST_INCLUDES,
  pageSize: MAX_PAGE_SIZE,
  showAll: true,
  sort: EVENT_SORT_OPTIONS.START_TIME,
};

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

export const ADD_EVENT_TIME_FORM_NAME = 'add-event-time';
export const EDIT_EVENT_TIME_FORM_NAME = 'edit-event-time';

export const AUDIENCE_ORDER = [
  'yso:p7179', // Vammaiset
  'yso:p4354', // Lapset
  'yso:p13050', // Lapsiperheet
  'yso:p6165', // Maahanmuuttajat
  'yso:p11617', // Nuoret
  'yso:p3128', // Yritykset
  'yso:p1393', // Järjestöt
  'yso:p12297', // Mielenterveyskuntoutujat
  'yso:p23886', // Päihdekuntoutujat
  'helsinki:aflfbatkwe', // Omaishoitoperheet
  'helsinki:aflfbat76e', // Palvelukeskuskortti
  'yso:p16485', // Koululaiset
  'yso:p20513', // Vauvaperheet
  'yso:p5590', // Aikuiset
  'yso:p16486', // Opiskelijat
  'yso:p2433', // Ikääntyneet
];
