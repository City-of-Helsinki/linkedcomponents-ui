import { AskPermissionFormFields, ContactFormFields } from './types';

export enum CONTACT_FORM_FIELD {
  BODY = 'body',
  EMAIL = 'email',
  NAME = 'name',
  SUBJECT = 'subject',
  TOPIC = 'topic',
}

export enum ASK_PERMISSION_FORM_FIELD {
  BODY = 'body',
  EMAIL = 'email',
  JOB_DESCRIPTION = 'jobDescription',
  NAME = 'name',
  ORGANIZATION = 'organization',
}

export const CONTACT_FORM_BODY_MAX_LENGTH = 5000;

export const askPermissionFormInitialValues: AskPermissionFormFields = {
  [ASK_PERMISSION_FORM_FIELD.BODY]: '',
  [ASK_PERMISSION_FORM_FIELD.EMAIL]: '',
  [ASK_PERMISSION_FORM_FIELD.JOB_DESCRIPTION]: '',
  [ASK_PERMISSION_FORM_FIELD.NAME]: '',
  [ASK_PERMISSION_FORM_FIELD.ORGANIZATION]: null,
};

export const contactFormInitialValues: ContactFormFields = {
  [CONTACT_FORM_FIELD.BODY]: '',
  [CONTACT_FORM_FIELD.EMAIL]: '',
  [CONTACT_FORM_FIELD.NAME]: '',
  [CONTACT_FORM_FIELD.SUBJECT]: '',
  [CONTACT_FORM_FIELD.TOPIC]: '',
};

export const ASK_PERMISSION_FORM_SELECT_FIELDS = [
  ASK_PERMISSION_FORM_FIELD.ORGANIZATION,
];
export const CONTACT_FORM_SELECT_FIELDS = [CONTACT_FORM_FIELD.TOPIC];

export enum CONTACT_TOPICS {
  GENERAL = 'GENERAL',
  EVENT_FORM = 'EVENT_FORM',
  PERMISSIONS = 'PERMISSIONS',
  FEATURE_REQUEST = 'FEATURE_REQUEST',
  OTHER = 'OTHER',
}
