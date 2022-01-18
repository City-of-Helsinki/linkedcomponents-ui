import {
  IconCogwheel,
  IconCopy,
  IconCross,
  IconEye,
  IconLink,
  IconPen,
} from 'hds-react';

export enum REGISTRATION_ACTIONS {
  COPY = 'copy',
  COPY_LINK = 'copyLink',
  CREATE = 'create',
  DELETE = 'delete',
  EDIT = 'edit',
  SHOW_ENROLMENTS = 'showEnrolments',
  UPDATE = 'update',
}

export const AUTHENTICATION_NOT_NEEDED = [
  REGISTRATION_ACTIONS.COPY,
  REGISTRATION_ACTIONS.COPY_LINK,
  REGISTRATION_ACTIONS.EDIT,
];

export enum REGISTRATION_SEARCH_PARAMS {
  ENROLMENT_PAGE = 'enrolmentPage',
  ENROLMENT_TEXT = 'enrolmentText',
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

export const REGISTRATION_ICONS = {
  [REGISTRATION_ACTIONS.COPY]: <IconCopy aria-hidden={true} />,
  [REGISTRATION_ACTIONS.COPY_LINK]: <IconLink aria-hidden={true} />,
  [REGISTRATION_ACTIONS.CREATE]: <IconPen aria-hidden={true} />,
  [REGISTRATION_ACTIONS.DELETE]: <IconCross aria-hidden={true} />,
  [REGISTRATION_ACTIONS.EDIT]: <IconCogwheel aria-hidden={true} />,
  [REGISTRATION_ACTIONS.SHOW_ENROLMENTS]: <IconEye aria-hidden={true} />,
  [REGISTRATION_ACTIONS.UPDATE]: <IconPen aria-hidden={true} />,
};

export const REGISTRATION_LABEL_KEYS = {
  [REGISTRATION_ACTIONS.COPY]: 'registrationsPage.actionButtons.copy',
  [REGISTRATION_ACTIONS.COPY_LINK]: 'registrationsPage.actionButtons.copyLink',
  [REGISTRATION_ACTIONS.CREATE]: 'registration.form.buttonCreate',
  [REGISTRATION_ACTIONS.DELETE]: 'registrationsPage.actionButtons.delete',
  [REGISTRATION_ACTIONS.EDIT]: 'registrationsPage.actionButtons.edit',
  [REGISTRATION_ACTIONS.SHOW_ENROLMENTS]:
    'registrationsPage.actionButtons.showEnrolments',
  [REGISTRATION_ACTIONS.UPDATE]: 'registrationsPage.actionButtons.update',
};

export const DEFAULT_REGISTRATION_SORT =
  REGISTRATION_SORT_OPTIONS.LAST_MODIFIED_TIME_DESC;

export const REGISTRATIONS_PAGE_SIZE = 10;
