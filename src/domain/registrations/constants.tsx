import {
  IconCalendarPlus,
  IconCogwheel,
  IconCross,
  IconEye,
  IconPen,
} from 'hds-react';

export enum REGISTRATION_EDIT_ACTIONS {
  COPY = 'copy',
  DELETE = 'delete',
  EDIT = 'edit',
  SHOW_ENROLMENTS = 'showEnrolments',
  UPDATE = 'update',
}

export const AUTHENTICATION_NOT_NEEDED = [
  REGISTRATION_EDIT_ACTIONS.COPY,
  REGISTRATION_EDIT_ACTIONS.EDIT,
  REGISTRATION_EDIT_ACTIONS.SHOW_ENROLMENTS,
];

export enum REGISTRATION_SEARCH_PARAMS {
  EVENT_TYPE = 'eventType',
  PAGE = 'page',
  RETURN_PATH = 'returnPath',
  SORT = 'sort',
  TEXT = 'text',
}

export enum REGISTRATION_SORT_OPTIONS {
  LAST_MODIFIED_TIME = 'last_modified_time',
  LAST_MODIFIED_TIME_DESC = '-last_modified_time',
}

export const REGISTRATION_EDIT_ICONS = {
  [REGISTRATION_EDIT_ACTIONS.COPY]: <IconCalendarPlus />,
  [REGISTRATION_EDIT_ACTIONS.DELETE]: <IconCross />,
  [REGISTRATION_EDIT_ACTIONS.EDIT]: <IconCogwheel />,
  [REGISTRATION_EDIT_ACTIONS.SHOW_ENROLMENTS]: <IconEye />,
  [REGISTRATION_EDIT_ACTIONS.UPDATE]: <IconPen />,
};

export const REGISTRATION_EDIT_LABEL_KEYS = {
  [REGISTRATION_EDIT_ACTIONS.COPY]: 'registrationsPage.actionButtons.copy',
  [REGISTRATION_EDIT_ACTIONS.DELETE]: 'registrationsPage.actionButtons.delete',
  [REGISTRATION_EDIT_ACTIONS.EDIT]: 'registrationsPage.actionButtons.edit',
  [REGISTRATION_EDIT_ACTIONS.SHOW_ENROLMENTS]:
    'registrationsPage.actionButtons.showEnrolments',
  [REGISTRATION_EDIT_ACTIONS.UPDATE]: 'registrationsPage.actionButtons.update',
};

export const DEFAULT_REGISTRATION_SORT =
  REGISTRATION_SORT_OPTIONS.LAST_MODIFIED_TIME_DESC;
