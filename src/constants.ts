import reduce from 'lodash/reduce';

import { Language, MultiLanguageObject } from './types';

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
  ACCESSIBILITY_STATEMENT = '/accessibility-statement',
  ATTENDANCE_LIST = '/registrations/:registrationId/attendance-list',
  CALLBACK = '/callback',
  CREATE_EVENT = '/events/create',
  CREATE_IMAGE = '/administration/images/create',
  CREATE_KEYWORD = '/administration/keywords/create',
  CREATE_KEYWORD_SET = '/administration/keyword-sets/create',
  CREATE_ORGANIZATION = '/administration/organizations/create',
  CREATE_PLACE = '/administration/places/create',
  CREATE_PRICE_GROUP = '/administration/price-groups/create',
  CREATE_REGISTRATION = '/registrations/create',
  CREATE_SIGNUP_GROUP = '/registrations/:registrationId/signup-group/create',
  EDIT_EVENT = '/events/edit/:id',
  EDIT_IMAGE = '/administration/images/edit/:id',
  EDIT_KEYWORD = '/administration/keywords/edit/:id',
  EDIT_KEYWORD_SET = '/administration/keyword-sets/edit/:id',
  EDIT_ORGANIZATION = '/administration/organizations/edit/:id',
  EDIT_PRICE_GROUP = '/administration/price-groups/edit/:id',
  EDIT_PLACE = '/administration/places/edit/:id',
  EDIT_REGISTRATION = '/registrations/edit/:id',
  EDIT_SIGNUP = '/registrations/:registrationId/signup/edit/:signupId',
  EDIT_SIGNUP_GROUP = '/registrations/:registrationId/signup-group/edit/:signupGroupId',
  EVENT_SAVED = '/events/completed/:id',
  EVENTS = '/events',
  HELP = '/help',
  HOME = '/',
  IMAGES = '/administration/images',
  INSTRUCTIONS = '/help/instructions',
  INSTRUCTIONS_EVENTS = '/help/instructions/events',
  INSTRUCTIONS_FAQ = '/help/instructions/faq',
  INSTRUCTIONS_REGISTRATION = '/help/instructions/registration',
  KEYWORDS = '/administration/keywords',
  KEYWORD_SETS = '/administration/keyword-sets',
  LOGOUT = '/logout',
  ORGANIZATIONS = '/administration/organizations',
  PLACES = '/administration/places',
  PRICE_GROUPS = '/administration/price-groups',
  REGISTRATIONS = '/registrations',
  REGISTRATION_SAVED = '/registrations/completed/:id',
  REGISTRATION_SIGNUPS = '/registrations/:registrationId/signups',
  SEARCH = '/search',
  SILENT_CALLBACK = '/silent_renew.html',
  SUPPORT = '/help/support',
  SUPPORT_ASK_PERMISSION = '/help/support/ask-permission',
  SUPPORT_CONTACT = '/help/support/contact',
  SUPPORT_SERVICE_INFORMATION = '/help/support/service-information',
  SUPPORT_TERMS_OF_USE = '/help/support/terms-of-use',
  TECHNOLOGY = '/help/technology',
  TECHNOLOGY_DOCUMENTATION = '/help/technology/documentation',
  TECHNOLOGY_SOURCE_CODE = '/help/technology/source-code',
}

// Supported languages
export enum SUPPORTED_LANGUAGES {
  FI = 'fi',
  SV = 'sv',
  EN = 'en',
}

export const supportedLanguages = Object.values(SUPPORTED_LANGUAGES);

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.FI;

export enum INPUT_MAX_WIDTHS {
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export enum KEYWORD_SETS {
  AUDIENCES = 'helsinki:audiences',
  COURSE_TOPICS = 'helsinki:courses',
  EDUCATION_LEVELS = 'helsinki:education_levels',
  EDUCATION_MODELS = 'helsinki:education_models',
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
  CREATE_SIGNUP_GROUP_FORM = 'create-signup-group-form',
  EVENT_FORM = 'event-form',
  REGISTRATION_FORM = 'registration-form',
}

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/gif', 'image/png'];
export const COMPRESSABLE_IMAGE_TYPES = ['image/jpeg', 'image/png'];
export const MAX_IMAGE_SIZE_MB = 2;
export const MAX_IMAGE_FILE_NAME_LENGTH = 200;
export const MIN_IMAGE_HEIGHT = 200;
export const MIN_IMAGE_WIDTH = 300;
export const MIN_UPSCALED_IMAGE_HEIGHT = 400;
export const MIN_UPSCALED_IMAGE_WIDTH = 600;
export const MAX_IMAGE_WIDTH = 2400;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const PAGE_HEADER_ID = 'page-header';
export const MAIN_CONTENT_ID = 'maincontent';

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
  SEATS_RESERVATION = 'seats-reservation',
}

export const COMBOBOX_DEBOUNCE_TIME_MS = 300;

export const testIds = {
  eventCard: { image: 'event-card-image' },
  eventList: { resultList: 'event-result-list' },
  eventSearchPanel: { searchPanel: 'event-search-panel' },
  imageList: { resultList: 'image-result-list' },
  imagePreview: { image: 'image-preview-image' },
  imageSelector: { imageItem: 'image-selector-item' },
  imageUploader: { input: 'image-dropzone-file-input' },
  keywordList: { resultList: 'keyword-result-list' },
  keywordSetList: { resultList: 'keyword-set-result-list' },
  landingPage: { searchButton: 'landing-page-search-button' },
  loadingSpinner: 'loading-spinner',
  organizationList: { resultList: 'organization-result-list' },
  placeList: { resultList: 'place-result-list' },
  priceGroupList: { resultList: 'price-group-result-list' },
  registrationList: { resultList: 'registration-result-list' },
};

export const DATA_PROTECTION_URL: { [key in Language]: string } = {
  // eslint-disable-next-line max-len
  fi: 'https://www.hel.fi/static/liitteet-2019/Kaupunginkanslia/Rekisteriselosteet/Keha/Kayttajatunnusten%20hallinta.pdf',
  // eslint-disable-next-line max-len
  sv: 'https://www.hel.fi/static/liitteet-2019/Kaupunginkanslia/Rekisteriselosteet/Keha/Hantering%20av%20anvandar-id.pdf',
  // eslint-disable-next-line max-len
  en: 'https://www.hel.fi/static/liitteet-2019/Kaupunginkanslia/Rekisteriselosteet/Keha/Kayttajatunnusten%20hallinta.pdf',
};

export const SUPPORT_EMAIL = 'linkedevents@hel.fi';

export enum SPLITTED_ROW_TYPE {
  MEDIUM_MEDIUM = 'medium-medium',
  LARGE_SMALL = 'large-small',
  SMALL_LARGE = 'small-large',
}

export const DEFAULT_SPLITTED_ROW_TYPE = SPLITTED_ROW_TYPE.MEDIUM_MEDIUM;

export enum ADMIN_LIST_SEARCH_PARAMS {
  PAGE = 'page',
  RETURN_PATH = 'returnPath',
  SORT = 'sort',
  TEXT = 'text',
}
