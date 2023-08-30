import { SEND_MESSAGE_FIELDS, SEND_MESSAGE_FORM_NAME } from './constants';

export type SendMessageFormFields = {
  [SEND_MESSAGE_FORM_NAME]: {
    [SEND_MESSAGE_FIELDS.BODY]: string;
    [SEND_MESSAGE_FIELDS.SUBJECT]: string;
  };
};
