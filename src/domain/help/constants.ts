import * as Yup from 'yup';

import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import { ContactFormFields } from './types';

export enum CONTACT_FORM_FIELD {
  BODY = 'body',
  EMAIL = 'email',
  NAME = 'name',
  SUBJECT = 'subject',
}

export const initialValues: ContactFormFields = {
  [CONTACT_FORM_FIELD.BODY]: '',
  [CONTACT_FORM_FIELD.EMAIL]: '',
  [CONTACT_FORM_FIELD.NAME]: '',
  [CONTACT_FORM_FIELD.SUBJECT]: '',
};

export const contactFormSchema = Yup.object().shape({
  [CONTACT_FORM_FIELD.NAME]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
  [CONTACT_FORM_FIELD.EMAIL]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .email(VALIDATION_MESSAGE_KEYS.EMAIL),
  [CONTACT_FORM_FIELD.SUBJECT]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
  [CONTACT_FORM_FIELD.BODY]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
});
