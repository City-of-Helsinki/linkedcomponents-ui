import * as Yup from 'yup';

import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import { ORGANIZATION_FIELDS, ORGANIZATION_SELECT_FIELDS } from './constants';

export const organizationSchema = Yup.object().shape({
  [ORGANIZATION_FIELDS.ORIGIN_ID]: Yup.string().when(
    [ORGANIZATION_FIELDS.ID],
    (id, schema) =>
      id ? schema : schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
  ),
  [ORGANIZATION_FIELDS.NAME]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .nullable(),
  [ORGANIZATION_FIELDS.PARENT]: Yup.string().when(
    [ORGANIZATION_FIELDS.ID],
    (id, schema) =>
      id ? schema : schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
  ),
});

export const getFocusableFieldId = (fieldName: string): string => {
  if (ORGANIZATION_SELECT_FIELDS.find((item) => item === fieldName)) {
    return `${fieldName}-input`;
  }
  return fieldName;
};
