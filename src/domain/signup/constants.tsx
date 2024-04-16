import { IconCrossCircle, IconEnvelope, IconEye, IconPen } from 'hds-react';

import { CONTACT_PERSON_FIELDS, SIGNUP_FIELDS } from '../signupGroup/constants';

export enum SIGNUP_ACTIONS {
  CREATE = 'create',
  DELETE = 'delete',
  EDIT = 'edit',
  SEND_MESSAGE = 'sendMessage',
  UPDATE = 'update',
  VIEW = 'view',
}

export const SIGNUP_ICONS = {
  [SIGNUP_ACTIONS.CREATE]: <IconPen aria-hidden={true} />,
  [SIGNUP_ACTIONS.DELETE]: <IconCrossCircle aria-hidden={true} />,
  [SIGNUP_ACTIONS.EDIT]: <IconPen aria-hidden={true} />,
  [SIGNUP_ACTIONS.SEND_MESSAGE]: <IconEnvelope aria-hidden={true} />,
  [SIGNUP_ACTIONS.UPDATE]: <IconPen aria-hidden={true} />,
  [SIGNUP_ACTIONS.VIEW]: <IconEye aria-hidden={true} />,
};

export const SIGNUP_LABEL_KEYS = {
  [SIGNUP_ACTIONS.CREATE]: 'signup.form.buttonSave',
  [SIGNUP_ACTIONS.DELETE]: 'signupsPage.actionButtons.delete',
  [SIGNUP_ACTIONS.EDIT]: 'signupsPage.actionButtons.edit',
  [SIGNUP_ACTIONS.SEND_MESSAGE]: 'signupsPage.actionButtons.sendMessage',
  [SIGNUP_ACTIONS.UPDATE]: 'signup.form.buttonSave',
  [SIGNUP_ACTIONS.VIEW]: '',
};

export const AUTHENTICATION_NOT_NEEDED = [SIGNUP_ACTIONS.EDIT];

export const TEST_CONTACT_PERSON_ID = 'contact:0';

export const TEST_SIGNUP_ID = 'signup:0';

export enum SIGNUP_MODALS {
  DELETE = 'delete',
  DELETE_SIGNUP_FROM_FORM = 'deleteSignupFromForm',
  PERSONS_ADDED_TO_WAITLIST = 'personsAddedToWaitList',
  RESERVATION_TIME_EXPIRED = 'reservationTimeExpired',
  RESERVATION_TIME_EXPIRING = 'reservationTimeExpiring',
  SEND_MESSAGE = 'sendMessage',
  SEND_MESSAGE_TO_SIGNUP = 'sendMessageToSignup',
}

export const SEND_MESSAGE_FORM_NAME = 'send-message';

export enum SEND_MESSAGE_FIELDS {
  BODY = 'body',
  SUBJECT = 'subject',
}

export const SIGNUP_TEXT_FIELD_MAX_LENGTH = {
  [SIGNUP_FIELDS.CITY]: 50,
  [SIGNUP_FIELDS.FIRST_NAME]: 50,
  [SIGNUP_FIELDS.LAST_NAME]: 50,
  [SIGNUP_FIELDS.PHONE_NUMBER]: 18,
  [SIGNUP_FIELDS.STREET_ADDRESS]: 500,
  [SIGNUP_FIELDS.ZIPCODE]: 10,
};

export const CONTACT_PERSON_TEXT_FIELD_MAX_LENGTH = {
  [CONTACT_PERSON_FIELDS.FIRST_NAME]: 50,
  [CONTACT_PERSON_FIELDS.EMAIL]: 254,
  [CONTACT_PERSON_FIELDS.LAST_NAME]: 50,
  [CONTACT_PERSON_FIELDS.MEMBERSHIP_NUMBER]: 50,
  [CONTACT_PERSON_FIELDS.PHONE_NUMBER]: 18,
};
