import { PathPattern } from 'react-router';

import { ROUTES } from '../../../constants';

type NavigationGroup = {
  heading: string;
  headingLink: string;
  items?: NavigationGroupItem[];
};

type NavigationGroupItem = {
  label: string;
  url: string;
};

const NAVIGATION_GROUP_ITEMS_MAIN: NavigationGroupItem[] = [
  {
    label: 'navigation.tabs.searchEvents',
    url: ROUTES.SEARCH,
  },
];

const NAVIGATION_GROUP_ITEMS_EVENTS: NavigationGroupItem[] = [
  {
    label: 'createEventPage.title.general',
    url: ROUTES.CREATE_EVENT,
  },
];

const NAVIGATION_GROUP_ITEMS_REGISTRATIONS: NavigationGroupItem[] = [
  {
    label: 'createRegistrationPage.title',
    url: ROUTES.CREATE_REGISTRATION,
  },
];

const NAVIGATION_GROUP_ITEMS_ADMIN: NavigationGroupItem[] = [
  {
    label: 'keywordsPage.title',
    url: ROUTES.KEYWORDS,
  },
  {
    label: 'keywordSetsPage.title',
    url: ROUTES.KEYWORD_SETS,
  },
  {
    label: 'imagesPage.title',
    url: ROUTES.IMAGES,
  },
  {
    label: 'organizationsPage.title',
    url: ROUTES.ORGANIZATIONS,
  },
  {
    label: 'placesPage.title',
    url: ROUTES.PLACES,
  },
];

const NAVIGATION_GROUP_ITEMS_SUPPORT: NavigationGroupItem[] = [
  {
    label: 'helpPage.sideNavigation.labelTermsOfUse',
    url: ROUTES.SUPPORT_TERMS_OF_USE,
  },
  {
    label: 'helpPage.sideNavigation.labelContact',
    url: ROUTES.SUPPORT_CONTACT,
  },
  {
    label: 'helpPage.sideNavigation.labelAskPermission',
    url: ROUTES.SUPPORT_ASK_PERMISSION,
  },
];

const NAVIGATION_GROUP_ITEMS_INSTRUCTIONS: NavigationGroupItem[] = [
  {
    label: 'helpPage.sideNavigation.labelEventsInstructions',
    url: ROUTES.INSTRUCTIONS_EVENTS,
  },
  {
    label: 'helpPage.sideNavigation.labelRegistrationInstructions',
    url: ROUTES.INSTRUCTIONS_REGISTRATION,
  },
  {
    label: 'helpPage.sideNavigation.labelFaq',
    url: ROUTES.INSTRUCTIONS_FAQ,
  },
];

const NAVIGATION_GROUP_ITEMS_TECHNOLOGY: NavigationGroupItem[] = [
  {
    label: 'helpPage.sideNavigation.labelSourceCode',
    url: ROUTES.TECHNOLOGY_SOURCE_CODE,
  },
  {
    label: 'helpPage.sideNavigation.labelDocumentation',
    url: ROUTES.TECHNOLOGY_DOCUMENTATION,
  },
];

export const NO_FOOTER_PATHS: PathPattern[] = [
  { path: ROUTES.ATTENDANCE_LIST },
  { path: ROUTES.EDIT_EVENT },
  { path: ROUTES.EDIT_REGISTRATION },
  { path: ROUTES.EDIT_SIGNUP },
  { path: ROUTES.EDIT_SIGNUP_GROUP },
  { path: ROUTES.REGISTRATION_SIGNUPS },
];

export const navigationGroupHome: NavigationGroup = {
  heading: 'common.home',
  headingLink: ROUTES.HOME,
  items: NAVIGATION_GROUP_ITEMS_MAIN,
};

export const navigationGroupEvents: NavigationGroup = {
  heading: 'navigation.tabs.events',
  headingLink: ROUTES.EVENTS,
  items: NAVIGATION_GROUP_ITEMS_EVENTS,
};

export const navigationGroupRegistrations: NavigationGroup = {
  heading: 'navigation.tabs.registrations',
  headingLink: ROUTES.REGISTRATIONS,
  items: NAVIGATION_GROUP_ITEMS_REGISTRATIONS,
};

export const navigationGroupAdmin: NavigationGroup = {
  heading: 'navigation.tabs.admin',
  headingLink: ROUTES.ADMIN,
  items: NAVIGATION_GROUP_ITEMS_ADMIN,
};

export const navigationGroupInstructions: NavigationGroup = {
  heading: 'helpPage.sideNavigation.labelInstructions',
  headingLink: ROUTES.INSTRUCTIONS,
  items: NAVIGATION_GROUP_ITEMS_INSTRUCTIONS,
};

export const navigationGroupTechnology: NavigationGroup = {
  heading: 'helpPage.sideNavigation.labelTechnology',
  headingLink: ROUTES.TECHNOLOGY,
  items: NAVIGATION_GROUP_ITEMS_TECHNOLOGY,
};

export const navigationGroupSupport: NavigationGroup = {
  heading: 'helpPage.sideNavigation.labelSupport',
  headingLink: ROUTES.SUPPORT,
  items: NAVIGATION_GROUP_ITEMS_SUPPORT,
};
