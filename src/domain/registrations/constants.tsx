import {
  IconCheck,
  IconCogwheel,
  IconCopy,
  IconCross,
  IconEye,
  IconLink,
  IconPen,
  IconSaveDiskette,
} from 'hds-react';

export enum REGISTRATION_ACTIONS {
  COPY = 'copy',
  COPY_LINK = 'copyLink',
  CREATE = 'create',
  DELETE = 'delete',
  EDIT = 'edit',
  EDIT_ATTENDANCE_LIST = 'editAttendanceList',
  EXPORT_SIGNUPS_AS_EXCEL = 'exportSignupsAsExcel',
  SHOW_SIGNUPS = 'showSignups',
  UPDATE = 'update',
}

export enum REGISTRATION_SEARCH_PARAMS {
  ATTENDEE_PAGE = 'attendeePage',
  EVENT_TYPE = 'eventType',
  PAGE = 'page',
  PUBLISHER = 'publisher',
  RETURN_PATH = 'returnPath',
  SIGNUP_TEXT = 'signupText',
  SORT = 'sort',
  TEXT = 'text',
  WAITING_PAGE = 'waitingPage',
}

export enum REGISTRATION_SORT_OPTIONS {
  EVENT_START_TIME_DESC = '-event__start_time',
}

export const REGISTRATION_ICONS = {
  [REGISTRATION_ACTIONS.COPY]: <IconCopy aria-hidden={true} />,
  [REGISTRATION_ACTIONS.COPY_LINK]: <IconLink aria-hidden={true} />,
  [REGISTRATION_ACTIONS.CREATE]: <IconPen aria-hidden={true} />,
  [REGISTRATION_ACTIONS.DELETE]: <IconCross aria-hidden={true} />,
  [REGISTRATION_ACTIONS.EDIT]: <IconCogwheel aria-hidden={true} />,
  [REGISTRATION_ACTIONS.EDIT_ATTENDANCE_LIST]: <IconCheck aria-hidden={true} />,
  [REGISTRATION_ACTIONS.EXPORT_SIGNUPS_AS_EXCEL]: (
    <IconSaveDiskette aria-hidden={true} />
  ),
  [REGISTRATION_ACTIONS.SHOW_SIGNUPS]: <IconEye aria-hidden={true} />,
  [REGISTRATION_ACTIONS.UPDATE]: <IconPen aria-hidden={true} />,
};

export const REGISTRATION_LABEL_KEYS = {
  [REGISTRATION_ACTIONS.COPY]: 'registrationsPage.actionButtons.copy',
  [REGISTRATION_ACTIONS.COPY_LINK]: 'registrationsPage.actionButtons.copyLink',
  [REGISTRATION_ACTIONS.CREATE]: 'registration.form.buttonCreate',
  [REGISTRATION_ACTIONS.DELETE]: 'registrationsPage.actionButtons.delete',
  [REGISTRATION_ACTIONS.EDIT]: 'registrationsPage.actionButtons.edit',
  [REGISTRATION_ACTIONS.EDIT_ATTENDANCE_LIST]:
    'registrationsPage.actionButtons.editAttendanceList',
  [REGISTRATION_ACTIONS.EXPORT_SIGNUPS_AS_EXCEL]:
    'registrationsPage.actionButtons.exportSignupsAsExcel',
  [REGISTRATION_ACTIONS.SHOW_SIGNUPS]:
    'registrationsPage.actionButtons.showSignups',
  [REGISTRATION_ACTIONS.UPDATE]: 'registrationsPage.actionButtons.update',
};

export const DEFAULT_REGISTRATION_SORT =
  REGISTRATION_SORT_OPTIONS.EVENT_START_TIME_DESC;

export const REGISTRATIONS_PAGE_SIZE = 10;

export const REGISTRATION_LIST_INCLUDES = ['event'];
