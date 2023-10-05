import { IconCrossCircle, IconEnvelope, IconEye, IconPen } from 'hds-react';

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

export const TEST_SIGNUP_ID = 'signup:0';

export enum SIGNUP_MODALS {
  DELETE = 'delete',
  DELETE_SIGNUP_FROM_FORM = 'deleteSignupFromForm',
  PERSONS_ADDED_TO_WAITLIST = 'personsAddedToWaitList',
  RESERVATION_TIME_EXPIRED = 'reservationTimeExpired',
  SEND_MESSAGE = 'sendMessage',
  SEND_MESSAGE_TO_SIGNUP = 'sendMessageToSignup',
}

export const SEND_MESSAGE_FORM_NAME = 'send-message';

export enum SEND_MESSAGE_FIELDS {
  BODY = 'body',
  SUBJECT = 'subject',
}
