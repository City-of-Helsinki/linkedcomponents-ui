import { defaultReducerState as defaultAuthReducerState } from './domain/auth/constants';
import { defaultReducerState as defaultEventsReducerState } from './domain/events/constants';
import { StoreState } from './types';

export enum ROUTES {
  CALLBACK = '/callback',
  CREATE_EVENT = '/events/create',
  EDIT_EVENT = '/events/edit/:id',
  EVENT_SAVED = '/events/completed/:id',
  EVENTS = '/events',
  HELP = '/help',
  HOME = '/',
  LOGOUT = '/logout',
  SEARCH = '/search',
  SILENT_CALLBACK = '/silent-callback',
}

export const OIDC_API_TOKEN_ENDPOINT = `${process.env.REACT_APP_OIDC_AUTHORITY}/api-tokens/`;

// Supported languages
export enum SUPPORTED_LANGUAGES {
  FI = 'fi',
  SV = 'sv',
  EN = 'en',
}

export enum CHARACTER_LIMITS {
  SHORT_STRING = 160,
  MEDIUM_STRING = 320,
  LONG_STRING = 5000,
}

export enum INPUT_MAX_WIDTHS {
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export enum KEYWORD_SETS {
  AUDIENCES = 'helsinki:audiences',
  TOPICS = 'helsinki:topics',
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

export const DATE_FORMAT = 'dd.MM.yyyy';
export const DATETIME_FORMAT = `${DATE_FORMAT} HH.mm`;

export const EXTLINK = {
  EXTLINK_FACEBOOK: 'extlink_facebook',
  EXTLINK_INSTAGRAM: 'extlink_instagram',
  EXTLINK_TWITTER: 'extlink_twitter',
  EXTLINK_YOUTUBE: 'extlink_youtube',
};

export enum FORM_NAMES {
  EVENT_FORM = 'event-form',
}

export const defaultStoreState: StoreState = {
  authentication: defaultAuthReducerState,
  events: defaultEventsReducerState,
};

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/gif', 'image/png'];
export const MAX_IMAGE_SIZE_MB = 2;

export const MAX_PAGE_SIZE = 100;

export const NAVIGATION_ITEMS = [
  {
    labelKey: 'navigation.tabs.events',
    url: ROUTES.EVENTS,
  },
  {
    labelKey: 'navigation.tabs.searchEvent',
    url: ROUTES.SEARCH,
  },
  {
    labelKey: 'navigation.tabs.help',
    url: ROUTES.HELP,
  },
];

export const PAGE_HEADER_ID = 'page-header';
export const MAIN_CONTENT_ID = 'maincontent';
