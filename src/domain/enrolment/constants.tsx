import { IconCrossCircle, IconEnvelope, IconEye, IconPen } from 'hds-react';

import { SignupFields, SignupGroupFormFields } from './types';

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

export enum SIGNUP_FIELDS {
  CITY = 'city',
  DATE_OF_BIRTH = 'dateOfBirth',
  EXTRA_INFO = 'extraInfo',
  FIRST_NAME = 'firstName',
  IN_WAITING_LIST = 'inWaitingList',
  LAST_NAME = 'lastName',
  STREET_ADDRESS = 'streetAddress',
  ZIPCODE = 'zipcode',
}

export enum SIGNUP_GROUP_FIELDS {
  EMAIL = 'email',
  EXTRA_INFO = 'extraInfo',
  MEMBERSHIP_NUMBER = 'membershipNumber',
  NATIVE_LANGUAGE = 'nativeLanguage',
  NOTIFICATIONS = 'notifications',
  PHONE_NUMBER = 'phoneNumber',
  SERVICE_LANGUAGE = 'serviceLanguage',
  SIGNUPS = 'signups',
}

export const SEND_MESSAGE_FORM_NAME = 'send-message';

export enum SEND_MESSAGE_FIELDS {
  BODY = 'body',
  SUBJECT = 'subject',
}

export const SIGNUP_INITIAL_VALUES: SignupFields = {
  [SIGNUP_FIELDS.CITY]: '',
  [SIGNUP_FIELDS.DATE_OF_BIRTH]: null,
  [SIGNUP_FIELDS.EXTRA_INFO]: '',
  [SIGNUP_FIELDS.FIRST_NAME]: '',
  [SIGNUP_FIELDS.IN_WAITING_LIST]: false,
  [SIGNUP_FIELDS.LAST_NAME]: '',
  [SIGNUP_FIELDS.STREET_ADDRESS]: '',
  [SIGNUP_FIELDS.ZIPCODE]: '',
};

export const SIGNUP_GROUP_INITIAL_VALUES: SignupGroupFormFields = {
  [SIGNUP_GROUP_FIELDS.EMAIL]: '',
  [SIGNUP_GROUP_FIELDS.EXTRA_INFO]: '',
  [SIGNUP_GROUP_FIELDS.MEMBERSHIP_NUMBER]: '',
  [SIGNUP_GROUP_FIELDS.NATIVE_LANGUAGE]: '',
  [SIGNUP_GROUP_FIELDS.NOTIFICATIONS]: [NOTIFICATIONS.EMAIL],
  [SIGNUP_GROUP_FIELDS.PHONE_NUMBER]: '',
  [SIGNUP_GROUP_FIELDS.SERVICE_LANGUAGE]: '',
  [SIGNUP_GROUP_FIELDS.SIGNUPS]: [],
};

export const SIGNUP_FORM_SELECT_FIELDS = [
  SIGNUP_GROUP_FIELDS.NATIVE_LANGUAGE,
  SIGNUP_GROUP_FIELDS.SERVICE_LANGUAGE,
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
  SEND_MESSAGE = 'sendMessage',
  SEND_MESSAGE_TO_ENROLMENT = 'sendMessageToEnrolment',
}
