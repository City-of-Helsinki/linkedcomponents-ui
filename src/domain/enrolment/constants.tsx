import { IconCrossCircle, IconEnvelope, IconEye, IconPen } from 'hds-react';

import { AttendeeFields, EnrolmentFormFields } from './types';

export enum ATTENDEE_FIELDS {
  AUDIENCE_MAX_AGE = 'audienceMaxAge',
  AUDIENCE_MIN_AGE = 'audienceMinAge',
  CITY = 'city',
  DATE_OF_BIRTH = 'dateOfBirth',
  EXTRA_INFO = 'extraInfo',
  NAME = 'name',
  STREET_ADDRESS = 'streetAddress',
  ZIP = 'zip',
}

export enum ENROLMENT_FIELDS {
  ATTENDEES = 'attendees',
  EMAIL = 'email',
  EXTRA_INFO = 'extraInfo',
  MEMBERSHIP_NUMBER = 'membershipNumber',
  NATIVE_LANGUAGE = 'nativeLanguage',
  NOTIFICATIONS = 'notifications',
  PHONE_NUMBER = 'phoneNumber',
  SERVICE_LANGUAGE = 'serviceLanguage',
}

export const ATTENDEE_INITIAL_VALUES: AttendeeFields = {
  [ATTENDEE_FIELDS.AUDIENCE_MAX_AGE]: null,
  [ATTENDEE_FIELDS.AUDIENCE_MIN_AGE]: null,
  [ATTENDEE_FIELDS.CITY]: '',
  [ATTENDEE_FIELDS.DATE_OF_BIRTH]: null,
  [ATTENDEE_FIELDS.EXTRA_INFO]: '',
  [ATTENDEE_FIELDS.NAME]: '',
  [ATTENDEE_FIELDS.STREET_ADDRESS]: '',
  [ATTENDEE_FIELDS.ZIP]: '',
};

export const ENROLMENT_INITIAL_VALUES: EnrolmentFormFields = {
  [ENROLMENT_FIELDS.ATTENDEES]: [],
  [ENROLMENT_FIELDS.EMAIL]: '',
  [ENROLMENT_FIELDS.EXTRA_INFO]: '',
  [ENROLMENT_FIELDS.MEMBERSHIP_NUMBER]: '',
  [ENROLMENT_FIELDS.NATIVE_LANGUAGE]: '',
  [ENROLMENT_FIELDS.NOTIFICATIONS]: [],
  [ENROLMENT_FIELDS.PHONE_NUMBER]: '',
  [ENROLMENT_FIELDS.SERVICE_LANGUAGE]: '',
};

export enum NOTIFICATIONS {
  EMAIL = 'email',
  SMS = 'sms',
}

export enum NOTIFICATION_TYPE {
  NO_NOTIFICATION = 'none',
  SMS = 'sms',
  EMAIL = 'email',
  SMS_EMAIL = 'sms and email',
}

export const ENROLMENT_FORM_SELECT_FIELDS = [
  ENROLMENT_FIELDS.NATIVE_LANGUAGE,
  ENROLMENT_FIELDS.SERVICE_LANGUAGE,
];

export enum ENROLMENT_ACTIONS {
  CANCEL = 'cancel',
  CREATE = 'create',
  EDIT = 'edit',
  SEND_MESSAGE = 'sendMessage',
  UPDATE = 'update',
  VIEW = 'view',
}

export const ENROLMENT_ICONS = {
  [ENROLMENT_ACTIONS.CANCEL]: <IconCrossCircle aria-hidden={true} />,
  [ENROLMENT_ACTIONS.CREATE]: <IconPen aria-hidden={true} />,
  [ENROLMENT_ACTIONS.EDIT]: <IconPen aria-hidden={true} />,
  [ENROLMENT_ACTIONS.SEND_MESSAGE]: <IconEnvelope aria-hidden={true} />,
  [ENROLMENT_ACTIONS.UPDATE]: <IconPen aria-hidden={true} />,
  [ENROLMENT_ACTIONS.VIEW]: <IconEye aria-hidden={true} />,
};

export const ENROLMENT_LABEL_KEYS = {
  [ENROLMENT_ACTIONS.CANCEL]: 'enrolmentsPage.actionButtons.cancel',
  [ENROLMENT_ACTIONS.CREATE]: 'enrolment.form.buttonSave',
  [ENROLMENT_ACTIONS.EDIT]: 'enrolmentsPage.actionButtons.edit',
  [ENROLMENT_ACTIONS.SEND_MESSAGE]: 'enrolmentsPage.actionButtons.sendMessage',
  [ENROLMENT_ACTIONS.UPDATE]: 'enrolment.form.buttonSave',
  [ENROLMENT_ACTIONS.VIEW]: '',
};

export const AUTHENTICATION_NOT_NEEDED = [ENROLMENT_ACTIONS.EDIT];

export const TEST_ENROLMENT_ID = 'enrolment:0';

export const ENROLMENT_TIME_IN_MINUTES = 30;
export const ENROLMENT_TIME_PER_PARTICIPANT_IN_MINUTES = 1;

export enum ENROLMENT_MODALS {
  CANCEL = 'cancel',
  DELETE = 'delete',
  PERSONS_ADDED_TO_WAITLIST = 'personsAddedToWaitList',
  RESERVATION_TIME_EXPIRED = 'reservationTimeExpired',
}
