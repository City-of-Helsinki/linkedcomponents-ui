import {
  IconCalendarClock,
  IconCalendarCross,
  IconCalendarPlus,
  IconCheck,
  IconCogwheel,
  IconCross,
  IconEnvelope,
  IconPen,
} from 'hds-react';

import {
  EMPTY_MULTI_LANGUAGE_OBJECT,
  MAX_PAGE_SIZE,
  WEEK_DAY,
} from '../../constants';
import { EventsQueryVariables } from '../../generated/graphql';
import getPathBuilder from '../../utils/getPathBuilder';
import { EVENT_LIST_INCLUDES, EVENT_SORT_OPTIONS } from '../events/constants';
import { eventsPathBuilder } from '../events/utils';
import { DEFAULT_LICENSE_TYPE, IMAGE_FIELDS } from '../image/constants';
import { PublicationListLink } from './formSections/typeSection/publicationListLinks/PublicationListLinks';
import { EventFormFields, RecurringEventSettings } from './types';

export enum EVENT_TYPE {
  General = 'general',
  Course = 'course',
  Volunteering = 'volunteering',
}

export enum EVENT_ENVIRONMENT_VALUE {
  In = 'in',
  Out = 'out',
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

export enum EVENT_OFFER_FIELDS {
  OFFER_DESCRIPTION = 'description',
  OFFER_INFO_URL = 'infoUrl',
  OFFER_IS_FREE = 'isFree',
  OFFER_PRICE = 'price',
  OFFER_PRICE_GROUPS = 'offerPriceGroups',
}

export enum VIDEO_DETAILS_FIELDS {
  ALT_TEXT = 'altText',
  NAME = 'name',
  URL = 'url',
}

export enum EVENT_TIME_FIELDS {
  END_DATE = 'endDate',
  END_TIME = 'endTime',
  ID = 'id',
  START_DATE = 'startDate',
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
  CROSS_INSTITUTIONAL_STUDIES = 'crossInstitutionalStudies',
  DESCRIPTION = 'description',
  EDUCATION_LEVELS_KEYWORDS = 'educationLevelsKeywords',
  EDUCATION_MODELS_KEYWORDS = 'educationModelsKeywords',
  ENROLMENT_END_TIME_DATE = 'enrolmentEndTimeDate',
  ENROLMENT_END_TIME_TIME = 'enrolmentEndTimeTime',
  ENROLMENT_START_TIME_DATE = 'enrolmentStartTimeDate',
  ENROLMENT_START_TIME_TIME = 'enrolmentStartTimeTime',
  EVENT_INFO_LANGUAGES = 'eventInfoLanguages',
  EVENT_TIMES = 'eventTimes',
  EVENTS = 'events',
  ENVIRONMENT = 'environment',
  ENVIRONMENTAL_CERTIFICATE = 'environmentalCertificate',
  EXTERNAL_LINKS = 'externalLinks',
  HAS_ENVIRONMENTAL_CERTIFICATE = 'hasEnvironmentalCertificate',
  HAS_PRICE = 'hasPrice',
  HAS_UMBRELLA = 'hasUmbrella',
  IMAGES = 'images',
  IMAGE_DETAILS = 'imageDetails',
  IN_LANGUAGE = 'inLanguage',
  INFO_URL = 'infoUrl',
  IS_IMAGE_EDITABLE = 'isImageEditable',
  IS_REGISTRATION_PLANNED = 'isRegistrationPlanned',
  IS_VERIFIED = 'isVerified',
  IS_UMBRELLA = 'isUmbrella',
  KEYWORDS = 'keywords',
  LOCATION = 'location',
  LOCATION_EXTRA_INFO = 'locationExtraInfo',
  MAIN_CATEGORIES = 'mainCategories',
  MAXIMUM_ATTENDEE_CAPACITY = 'maximumAttendeeCapacity',
  MINIMUM_ATTENDEE_CAPACITY = 'minimumAttendeeCapacity',
  NAME = 'name',
  OFFERS = 'offers',
  OFFERS_VAT_PERCENTAGE = 'offersVatPercentage',
  PRICE_GROUP_OPTIONS = 'priceGroupOptions',
  PROVIDER = 'provider',
  PUBLISHER = 'publisher',
  RECURRING_EVENTS = 'recurringEvents',
  RECURRING_EVENT_END_TIME = 'recurringEventEndTime',
  RECURRING_EVENT_START_TIME = 'recurringEventStartTime',
  SHORT_DESCRIPTION = 'shortDescription',
  SUPER_EVENT = 'superEvent',
  TYPE = 'type',
  USER_CONSENT = 'userConsent',
  USER_EMAIL = 'userEmail',
  USER_NAME = 'userName',
  USER_ORGANIZATION = 'userOrganization',
  USER_PHONE_NUMBER = 'userPhoneNumber',
  VIDEOS = 'videos',
}

export const RECURRING_EVENT_INITIAL_VALUES: RecurringEventSettings = {
  [RECURRING_EVENT_FIELDS.END_DATE]: null,
  [RECURRING_EVENT_FIELDS.END_TIME]: '',
  [RECURRING_EVENT_FIELDS.EVENT_TIMES]: [],
  [RECURRING_EVENT_FIELDS.REPEAT_DAYS]: [],
  [RECURRING_EVENT_FIELDS.REPEAT_INTERVAL]: 1,
  [RECURRING_EVENT_FIELDS.START_DATE]: null,
  [RECURRING_EVENT_FIELDS.START_TIME]: '',
};

export const EVENT_INITIAL_VALUES: EventFormFields = {
  [EVENT_FIELDS.AUDIENCE]: [],
  [EVENT_FIELDS.AUDIENCE_MAX_AGE]: '',
  [EVENT_FIELDS.AUDIENCE_MIN_AGE]: '',
  [EVENT_FIELDS.CROSS_INSTITUTIONAL_STUDIES]: false,
  [EVENT_FIELDS.DESCRIPTION]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.EDUCATION_LEVELS_KEYWORDS]: [],
  [EVENT_FIELDS.EDUCATION_MODELS_KEYWORDS]: [],
  [EVENT_FIELDS.ENROLMENT_END_TIME_DATE]: null,
  [EVENT_FIELDS.ENROLMENT_END_TIME_TIME]: '',
  [EVENT_FIELDS.ENROLMENT_START_TIME_DATE]: null,
  [EVENT_FIELDS.ENROLMENT_START_TIME_TIME]: '',
  [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: ['fi'],
  [EVENT_FIELDS.EVENT_TIMES]: [],
  [EVENT_FIELDS.EVENTS]: [],
  [EVENT_FIELDS.EXTERNAL_LINKS]: [],
  [EVENT_FIELDS.HAS_PRICE]: false,
  [EVENT_FIELDS.HAS_UMBRELLA]: false,
  [EVENT_FIELDS.IMAGES]: [],
  [EVENT_FIELDS.IMAGE_DETAILS]: {
    [IMAGE_FIELDS.ALT_TEXT]: '',
    [IMAGE_FIELDS.LICENSE]: DEFAULT_LICENSE_TYPE,
    [IMAGE_FIELDS.NAME]: '',
    [IMAGE_FIELDS.PHOTOGRAPHER_NAME]: '',
  },
  [EVENT_FIELDS.IN_LANGUAGE]: [],
  [EVENT_FIELDS.IS_VERIFIED]: false,
  [EVENT_FIELDS.INFO_URL]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.IS_IMAGE_EDITABLE]: false,
  [EVENT_FIELDS.IS_REGISTRATION_PLANNED]: false,
  [EVENT_FIELDS.IS_UMBRELLA]: false,
  [EVENT_FIELDS.KEYWORDS]: [],
  [EVENT_FIELDS.LOCATION]: null,
  [EVENT_FIELDS.LOCATION_EXTRA_INFO]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.MAIN_CATEGORIES]: [],
  [EVENT_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: '',
  [EVENT_FIELDS.MINIMUM_ATTENDEE_CAPACITY]: '',
  [EVENT_FIELDS.NAME]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  [EVENT_FIELDS.OFFERS]: [
    {
      [EVENT_OFFER_FIELDS.OFFER_DESCRIPTION]: {
        ...EMPTY_MULTI_LANGUAGE_OBJECT,
      },
      [EVENT_OFFER_FIELDS.OFFER_INFO_URL]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
      [EVENT_OFFER_FIELDS.OFFER_PRICE]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
      [EVENT_OFFER_FIELDS.OFFER_PRICE_GROUPS]: [
        { id: null, price: '', priceGroup: '' },
      ],
    },
  ],
  [EVENT_FIELDS.OFFERS_VAT_PERCENTAGE]: '',
  [EVENT_FIELDS.PRICE_GROUP_OPTIONS]: [],
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

export const EVENT_EXTERNAL_USER_INITIAL_VALUES: EventFormFields = {
  ...EVENT_INITIAL_VALUES,
  [EVENT_FIELDS.ENVIRONMENT]: EVENT_ENVIRONMENT_VALUE.In,
  [EVENT_FIELDS.ENVIRONMENTAL_CERTIFICATE]: '',
  [EVENT_FIELDS.USER_CONSENT]: false,
  [EVENT_FIELDS.USER_EMAIL]: '',
  [EVENT_FIELDS.USER_NAME]: '',
  [EVENT_FIELDS.USER_ORGANIZATION]: '',
  [EVENT_FIELDS.USER_PHONE_NUMBER]: '',
};

export enum URL_PARAMS {
  TAB = 'tab',
}

export const DESCRIPTION_SECTION_FIELDS = [
  EVENT_FIELDS.NAME,
  EVENT_FIELDS.DESCRIPTION,
  EVENT_FIELDS.SHORT_DESCRIPTION,
];

export const EVENT_COMBOBOX_FIELDS = [
  EVENT_FIELDS.PUBLISHER,
  EVENT_FIELDS.KEYWORDS,
  EVENT_FIELDS.LOCATION,
  EVENT_FIELDS.SUPER_EVENT,
];

export const EVENT_TEXT_EDITOR_FIELDS = [EVENT_FIELDS.DESCRIPTION];

export const EVENT_CHECKBOX_GROUP_FIELDS = [EVENT_FIELDS.MAIN_CATEGORIES];

export const EVENT_FIELD_ARRAYS: string[] = [
  EVENT_FIELDS.EVENT_TIMES,
  EVENT_FIELDS.OFFERS,
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

export const EVENT_INCLUDES = [
  'in_language',
  'keywords',
  'sub_events',
  'super_event',
];

export const EVENT_WITH_SUB_EVENTS_INCLUDES = ['sub_events'];

export enum EVENT_ACTIONS {
  ACCEPT_AND_PUBLISH = 'acceptAndPublish',
  CANCEL = 'cancel',
  COPY = 'copy',
  CREATE_DRAFT = 'createDraft',
  DELETE = 'delete',
  EDIT = 'edit',
  POSTPONE = 'postpone',
  PUBLISH = 'publish',
  UPDATE_DRAFT = 'updateDraft',
  UPDATE_PUBLIC = 'updatePublic',
  SEND_EMAIL = 'sendEmail',
}

export const SUB_EVENTS_VARIABLES: EventsQueryVariables = {
  createPath: getPathBuilder(eventsPathBuilder),
  include: EVENT_LIST_INCLUDES,
  pageSize: MAX_PAGE_SIZE,
  showAll: true,
  sort: EVENT_SORT_OPTIONS.START_TIME,
};

export const AUTHENTICATION_NOT_NEEDED = [EVENT_ACTIONS.EDIT];

export const NOT_ALLOWED_WHEN_CANCELLED = [
  EVENT_ACTIONS.CANCEL,
  EVENT_ACTIONS.POSTPONE,
];

export const NOT_ALLOWED_WHEN_DELETED = [
  EVENT_ACTIONS.ACCEPT_AND_PUBLISH,
  EVENT_ACTIONS.CANCEL,
  EVENT_ACTIONS.DELETE,
  EVENT_ACTIONS.POSTPONE,
  EVENT_ACTIONS.UPDATE_DRAFT,
  EVENT_ACTIONS.UPDATE_PUBLIC,
];

export const NOT_ALLOWED_WHEN_IN_PAST = [
  EVENT_ACTIONS.ACCEPT_AND_PUBLISH,
  EVENT_ACTIONS.CANCEL,
  EVENT_ACTIONS.POSTPONE,
  EVENT_ACTIONS.UPDATE_DRAFT,
  EVENT_ACTIONS.UPDATE_PUBLIC,
];

export const EVENT_ICONS = {
  [EVENT_ACTIONS.ACCEPT_AND_PUBLISH]: <IconCheck aria-hidden={true} />,
  [EVENT_ACTIONS.CANCEL]: <IconCalendarCross aria-hidden={true} />,
  [EVENT_ACTIONS.COPY]: <IconCalendarPlus aria-hidden={true} />,
  [EVENT_ACTIONS.CREATE_DRAFT]: <IconPen aria-hidden={true} />,
  [EVENT_ACTIONS.DELETE]: <IconCross aria-hidden={true} />,
  [EVENT_ACTIONS.EDIT]: <IconCogwheel aria-hidden={true} />,
  [EVENT_ACTIONS.POSTPONE]: <IconCalendarClock aria-hidden={true} />,
  [EVENT_ACTIONS.PUBLISH]: <IconCheck aria-hidden={true} />,
  [EVENT_ACTIONS.UPDATE_DRAFT]: <IconPen aria-hidden={true} />,
  [EVENT_ACTIONS.UPDATE_PUBLIC]: <IconPen aria-hidden={true} />,
  [EVENT_ACTIONS.SEND_EMAIL]: <IconEnvelope aria-hidden={true} />,
};

export const EVENT_LABEL_KEYS = {
  [EVENT_ACTIONS.ACCEPT_AND_PUBLISH]: 'event.form.buttonAcceptAndPublish',
  [EVENT_ACTIONS.CANCEL]: 'event.form.buttonCancel',
  [EVENT_ACTIONS.COPY]: 'event.form.buttonCopy',
  [EVENT_ACTIONS.CREATE_DRAFT]: 'event.form.buttonSaveDraft',
  [EVENT_ACTIONS.DELETE]: 'event.form.buttonDelete',
  [EVENT_ACTIONS.EDIT]: 'event.form.buttonEdit',
  [EVENT_ACTIONS.POSTPONE]: 'event.form.buttonPostpone',
  [EVENT_ACTIONS.PUBLISH]: 'event.form.buttonPublish',
  [EVENT_ACTIONS.UPDATE_DRAFT]: 'event.form.buttonUpdateDraft',
  [EVENT_ACTIONS.UPDATE_PUBLIC]: 'event.form.buttonUpdatePublic',
  [EVENT_ACTIONS.SEND_EMAIL]: 'event.form.buttonSendEmail',
};

export const ADD_EVENT_TIME_FORM_NAME = 'add-event-time';
export const EDIT_EVENT_TIME_FORM_NAME = 'edit-event-time';

export enum EVENT_MODALS {
  CANCEL = 'cancel',
  DELETE = 'delete',
  POSTPONE = 'postpone',
  UPDATE = 'update',
}

export const TEST_EVENT_ID = 'helmet:222453';

export const PUBLICATION_LIST_LINKS: Record<EVENT_TYPE, PublicationListLink[]> =
  {
    [EVENT_TYPE.Course]: [],
    [EVENT_TYPE.General]: [
      { href: 'https://tapahtumat.hel.fi', text: 'tapahtumat.hel.fi' },
      { href: 'https://harrastukset.hel.fi', text: 'harrastukset.hel.fi' },
      { href: 'https://www.myhelsinki.fi', text: 'myhelsinki.fi' },
    ],
    [EVENT_TYPE.Volunteering]: [
      {
        href: 'https://vapaaehtoistoiminta.hel.fi',
        text: 'vapaaehtoistoiminta.hel.fi',
      },
    ],
  };

export const DAY_CODES: Record<string, number> = {
  [WEEK_DAY.MON]: 1,
  [WEEK_DAY.TUE]: 2,
  [WEEK_DAY.WED]: 3,
  [WEEK_DAY.THU]: 4,
  [WEEK_DAY.FRI]: 5,
  [WEEK_DAY.SAT]: 6,
  [WEEK_DAY.SUN]: 0,
};

export const EVENT_TEXT_FIELD_MAX_LENGTH = {
  [EVENT_FIELDS.DESCRIPTION]: 5000,
  [EVENT_FIELDS.ENVIRONMENTAL_CERTIFICATE]: 255,
  [EVENT_FIELDS.INFO_URL]: 1000,
  [EVENT_FIELDS.LOCATION_EXTRA_INFO]: 400,
  [EVENT_FIELDS.NAME]: 255,
  [EVENT_FIELDS.PROVIDER]: 512,
  [EVENT_FIELDS.SHORT_DESCRIPTION]: 160,
  [EVENT_FIELDS.USER_EMAIL]: 254,
  [EVENT_FIELDS.USER_NAME]: 50,
  [EVENT_FIELDS.USER_PHONE_NUMBER]: 18,
};

export const EVENT_OFFER_TEXT_FIELD_MAX_LENGTH = {
  [EVENT_OFFER_FIELDS.OFFER_INFO_URL]: 1000,
  [EVENT_OFFER_FIELDS.OFFER_PRICE]: 1000,
};

export const EVENT_EXTERNAL_LINK_TEXT_FIELD_MAX_LENGTH = {
  [EXTERNAL_LINK_FIELDS.LINK]: 200,
};

export const EVENT_VIDEO_TEXT_FIELD_MAX_LENGTH = {
  [VIDEO_DETAILS_FIELDS.ALT_TEXT]: 320,
  [VIDEO_DETAILS_FIELDS.NAME]: 255,
  [VIDEO_DETAILS_FIELDS.URL]: 200,
};
