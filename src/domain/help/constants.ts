import * as Yup from 'yup';

import { createStringMaxErrorMessage } from '../../utils/validationUtils';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import { ContactFormFields } from './types';

export enum CONTACT_FORM_FIELD {
  BODY = 'body',
  EMAIL = 'email',
  NAME = 'name',
  SUBJECT = 'subject',
  TOPIC = 'topic',
}

export const CONTACT_FORM_BODY_MAX_LENGTH = 5000;

export const initialValues: ContactFormFields = {
  [CONTACT_FORM_FIELD.BODY]: '',
  [CONTACT_FORM_FIELD.EMAIL]: '',
  [CONTACT_FORM_FIELD.NAME]: '',
  [CONTACT_FORM_FIELD.SUBJECT]: '',
  [CONTACT_FORM_FIELD.TOPIC]: '',
};

export const contactFormSchema = Yup.object().shape({
  [CONTACT_FORM_FIELD.NAME]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
  [CONTACT_FORM_FIELD.EMAIL]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .email(VALIDATION_MESSAGE_KEYS.EMAIL),
  [CONTACT_FORM_FIELD.TOPIC]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
  [CONTACT_FORM_FIELD.SUBJECT]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
  [CONTACT_FORM_FIELD.BODY]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .max(CONTACT_FORM_BODY_MAX_LENGTH, createStringMaxErrorMessage),
});

export const CONTACT_FORM_SELECT_FIELDS = [CONTACT_FORM_FIELD.TOPIC];

export enum CONTACT_TOPICS {
  GENERAL = 'GENERAL',
  EVENT_FORM = 'EVENT_FORM',
  PERMISSIONS = 'PERMISSIONS',
  FEATURE_REQUEST = 'FEATURE_REQUEST',
  OTHER = 'OTHER',
}
