import { IconCrossCircle, IconEnvelope, IconEye, IconPen } from 'hds-react';

export const SEND_MESSAGE_FORM_NAME = 'send-message';

export enum SEND_MESSAGE_FIELDS {
  BODY = 'body',
  SUBJECT = 'subject',
}

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
  [ENROLMENT_ACTIONS.CANCEL]: 'signupsPage.actionButtons.cancel',
  [ENROLMENT_ACTIONS.CREATE]: 'enrolment.form.buttonSave',
  [ENROLMENT_ACTIONS.EDIT]: 'signupsPage.actionButtons.edit',
  [ENROLMENT_ACTIONS.SEND_MESSAGE]: 'signupsPage.actionButtons.sendMessage',
  [ENROLMENT_ACTIONS.UPDATE]: 'enrolment.form.buttonSave',
  [ENROLMENT_ACTIONS.VIEW]: '',
};

export const AUTHENTICATION_NOT_NEEDED = [ENROLMENT_ACTIONS.EDIT];

export const TEST_SIGNUP_ID = 'signup:0';

export const ENROLMENT_TIME_IN_MINUTES = 30;
export const ENROLMENT_TIME_PER_PARTICIPANT_IN_MINUTES = 1;

export enum ENROLMENT_MODALS {
  CANCEL = 'cancel',
  DELETE = 'delete',
  PERSONS_ADDED_TO_WAITLIST = 'personsAddedToWaitList',
  RESERVATION_TIME_EXPIRED = 'reservationTimeExpired',
  SEND_MESSAGE = 'sendMessage',
  SEND_MESSAGE_TO_SIGNUP = 'sendMessageToSignup',
}
