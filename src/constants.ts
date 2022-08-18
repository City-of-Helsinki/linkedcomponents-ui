import reduce from 'lodash/reduce';

import { defaultReducerState as defaultAuthReducerState } from './domain/auth/constants';
import { defaultReducerState as defaultEventsReducerState } from './domain/events/constants';
import { defaultReducerState as defaultOrganizationsReducerState } from './domain/organizations/constants';
import { MultiLanguageObject, StoreState } from './types';

export const BREAKPOINTS = {
  XS: 576,
  SM: 768,
  MD: 1024,
  LG: 1200,
  XLG: 1600,
};

export enum DEPRECATED_ROUTES {
  CREATE_EVENT = '/event/create/new',
  MODERATION = '/moderation',
  TERMS = '/terms',
  UPDATE_EVENT = '/event/update/:id',
  VIEW_EVENT = '/event/:id',
}

export enum ROUTES {
  ADMIN = '/administration',
  CALLBACK = '/callback',
  CREATE_ENROLMENT = '/registrations/:registrationId/enrolments/create',
  CREATE_EVENT = '/events/create',
  CREATE_IMAGE = '/administration/images/create',
  CREATE_KEYWORD = '/administration/keywords/create',
  CREATE_KEYWORD_SET = '/administration/keyword-sets/create',
  CREATE_ORGANIZATION = '/administration/organizations/create',
  CREATE_PLACE = '/administration/places/create',
  CREATE_REGISTRATION = '/registrations/create',
  EDIT_EVENT = '/events/edit/:id',
  EDIT_IMAGE = '/administration/images/edit/:id',
  EDIT_KEYWORD = '/administration/keywords/edit/:id',
  EDIT_KEYWORD_SET = '/administration/keyword-sets/edit/:id',
  EDIT_ORGANIZATION = '/administration/organizations/edit/:id',
  EDIT_PLACE = '/administration/places/edit/:id',
  EDIT_REGISTRATION = '/registrations/edit/:id',
  EDIT_REGISTRATION_ENROLMENT = '/registrations/:registrationId/enrolments/edit/:enrolmentId',
  EVENT_SAVED = '/events/completed/:id',
  EVENTS = '/events',
  FEATURES = '/help/features',
  HELP = '/help',
  HOME = '/',
  IMAGES = '/administration/images',
  INSTRUCTIONS = '/help/instructions',
  INSTRUCTIONS_CONTROL_PANEL = '/help/instructions/control-panel',
  INSTRUCTIONS_FAQ = '/help/instructions/faq',
  INSTRUCTIONS_GENERAL = '/help/instructions/general',
  INSTRUCTIONS_PLATFORM = '/help/instructions/platform',
  KEYWORDS = '/administration/keywords',
  KEYWORD_SETS = '/administration/keyword-sets',
  LOGOUT = '/logout',
  ORGANIZATIONS = '/administration/organizations',
  PLACES = '/administration/places',
  REGISTRATIONS = '/registrations',
  REGISTRATION_ENROLMENTS = '/registrations/:registrationId/enrolments',
  REGISTRATION_SAVED = '/registrations/completed/:id',
  SEARCH = '/search',
  SILENT_CALLBACK = '/silent-callback',
  SUPPORT = '/help/support',
  SUPPORT_CONTACT = '/help/support/contact',
  SUPPORT_TERMS_OF_USE = '/help/support/terms-of-use',
  TECHNOLOGY = '/help/technology',
  TECHNOLOGY_API = '/help/technology/api',
  TECHNOLOGY_DOCUMENTATION = '/help/technology/documentation',
  TECHNOLOGY_GENERAL = '/help/technology/general',
  TECHNOLOGY_IMAGE_RIGHTS = '/help/technology/image-rights',
  TECHNOLOGY_SOURCE_CODE = '/help/technology/source-code',
}

export const OIDC_API_TOKEN_ENDPOINT = `${process.env.REACT_APP_OIDC_AUTHORITY}/api-tokens/`;

// Supported languages
export enum SUPPORTED_LANGUAGES {
  FI = 'fi',
  // TODO: Add Swedish to supported languages when UI texts has been translated
  // SV = 'sv',
  EN = 'en',
}

export const supportedLanguages = Object.values(SUPPORTED_LANGUAGES);

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.FI;

export enum CHARACTER_LIMITS {
  EXTRA_SHORT_STRING = 128,
  SHORT_STRING = 160,
  MEDIUM_STRING = 255,
  LONG_STRING = 5000,
}

export enum INPUT_MAX_WIDTHS {
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export enum KEYWORD_SETS {
  AUDIENCES = 'helsinki:audiences',
  COURSE_TOPICS = 'helsinki:courses',
  EVENT_TOPICS = 'helsinki:topics',
}

export enum INCLUDE {
  KEYWORDS = 'keywords',
}

export enum WEEK_DAY {
  MON = 'mon',
  TUE = 'tue',
  WED = 'wed',
  THU = 'thu',
  FRI = 'fri',
  SAT = 'sat',
  SUN = 'sun',
}

export const DATE_FORMAT = 'd.M.yyyy';
export const DATE_FORMAT_API = 'yyyy-MM-dd';
export const TIME_FORMAT = 'HH.mm';
export const TIME_FORMAT_DATA = 'HH:mm';

export const DATETIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`;

export enum EXTLINK {
  EXTLINK_FACEBOOK = 'extlink_facebook',
  EXTLINK_INSTAGRAM = 'extlink_instagram',
  EXTLINK_REDDIT = 'extlink_reddit',
  EXTLINK_SNAPCHAT = 'extlink_snapchat',
  EXTLINK_TIKTOK = 'extlink_tiktok',
  EXTLINK_TUMBLR = 'extlink_tumblr',
  EXTLINK_TWITTER = 'extlink_twitter',
  EXTLINK_YOUTUBE = 'extlink_youtube',
  EXTLINK_WHATSAPP = 'extlink_whatsapp',
}

export enum FORM_NAMES {
  CREATE_ENROLMENT_FORM = 'create-enrolment-form',
  EVENT_FORM = 'event-form',
  REGISTRATION_FORM = 'registration-form',
}

export const defaultStoreState: StoreState = {
  authentication: defaultAuthReducerState,
  events: defaultEventsReducerState,
  organizations: defaultOrganizationsReducerState,
};

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/gif', 'image/png'];
export const COMPRESSABLE_IMAGE_TYPES = ['image/jpeg', 'image/png'];
export const MAX_IMAGE_SIZE_MB = 2;
export const MIN_IMAGE_HEIGHT = 200;
export const MIN_IMAGE_WIDTH = 300;
export const MIN_UPSCALED_IMAGE_HEIGHT = 400;
export const MIN_UPSCALED_IMAGE_WIDTH = 600;
export const MAX_IMAGE_WIDTH = 2400;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const PAGE_HEADER_ID = 'page-header';
export const MAIN_CONTENT_ID = 'maincontent';

export const SWAGGER_URL =
  process.env.REACT_APP_SWAGGER_URL ?? 'https://dev.hel.fi/apis/linkedevents';

export const SWAGGER_SCHEMA_URL =
  process.env.REACT_APP_SWAGGER_SCHEMA_URL ||
  'https://raw.githubusercontent.com/City-of-Helsinki/api-linked-events/master/linked-events.swagger.yaml';

export const LINKED_EVENTS_SYSTEM_DATA_SOURCE =
  process.env.REACT_APP_LINKED_EVENTS_SYSTEM_DATA_SOURCE || 'helsinki';

export const TEST_USER_ID = 'user:1';

export enum SEARCH_PARAMS {
  RETURN_PATH = 'returnPath',
}

// Don't change languege order. The defines order of backup languages in localised strings
export enum LE_DATA_LANGUAGES {
  FI = 'fi',
  SV = 'sv',
  EN = 'en',
  RU = 'ru',
  ZH_HANS = 'zhHans',
  AR = 'ar',
}

export const ORDERED_LE_DATA_LANGUAGES = [
  LE_DATA_LANGUAGES.FI,
  LE_DATA_LANGUAGES.SV,
  LE_DATA_LANGUAGES.EN,
  LE_DATA_LANGUAGES.RU,
  LE_DATA_LANGUAGES.ZH_HANS,
  LE_DATA_LANGUAGES.AR,
];

export const EMPTY_MULTI_LANGUAGE_OBJECT = reduce(
  LE_DATA_LANGUAGES,
  (acc, lang) => ({ ...acc, [lang]: '' }),
  {}
) as MultiLanguageObject;

export const VALIDATION_ERROR_SCROLLER_OPTIONS = {
  delay: 0,
  duration: 500,
  offset: -200,
  smooth: true,
};

export enum RESERVATION_NAMES {
  ENROLMENT_RESERVATION = 'enrolment-reservation',
}
