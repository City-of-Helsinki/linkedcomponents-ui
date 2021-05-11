import { CONTACT_FORM_FIELD } from './constants';

export type ContactFormFields = {
  [CONTACT_FORM_FIELD.BODY]: string;
  [CONTACT_FORM_FIELD.EMAIL]: string;
  [CONTACT_FORM_FIELD.NAME]: string;
  [CONTACT_FORM_FIELD.SUBJECT]: string;
};
