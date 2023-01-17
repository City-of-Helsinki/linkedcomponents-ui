import * as Yup from 'yup';

import { createStringMaxErrorMessage } from '../../utils/validationUtils';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import {
  ASK_PERMISSION_FORM_FIELD,
  CONTACT_FORM_BODY_MAX_LENGTH,
  CONTACT_FORM_FIELD,
} from './constants';

export const askPermissionFormSchema = Yup.object().shape({
  [ASK_PERMISSION_FORM_FIELD.NAME]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
  [ASK_PERMISSION_FORM_FIELD.EMAIL]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .email(VALIDATION_MESSAGE_KEYS.EMAIL),
  [ASK_PERMISSION_FORM_FIELD.ORGANIZATION]: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
  [ASK_PERMISSION_FORM_FIELD.JOB_DESCRIPTION]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
  [ASK_PERMISSION_FORM_FIELD.BODY]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .max(CONTACT_FORM_BODY_MAX_LENGTH, createStringMaxErrorMessage),
});

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
