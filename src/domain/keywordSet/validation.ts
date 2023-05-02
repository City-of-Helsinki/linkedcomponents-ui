import * as Yup from 'yup';

import { LE_DATA_LANGUAGES } from '../../constants';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import {
  KEYWORD_SET_FIELDS,
  KEYWORD_SET_FORM_SELECT_FIELDS,
} from './constants';

export const keywordSetSchema = Yup.object().shape({
  [KEYWORD_SET_FIELDS.ORIGIN_ID]: Yup.string().when(
    [KEYWORD_SET_FIELDS.ID],
    ([id], schema) =>
      id ? schema : schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
  ),
  [KEYWORD_SET_FIELDS.NAME]: Yup.object().shape({
    [LE_DATA_LANGUAGES.FI]: Yup.string()
      .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
      .nullable(),
  }),
  [KEYWORD_SET_FIELDS.KEYWORDS]: Yup.array()
    .required(VALIDATION_MESSAGE_KEYS.ARRAY_REQUIRED)
    .min(1, VALIDATION_MESSAGE_KEYS.KEYWORD_REQUIRED),
  [KEYWORD_SET_FIELDS.USAGE]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .nullable(),
});

export const getFocusableFieldId = (fieldName: string): string => {
  // For the select elements, focus the toggle button
  if (KEYWORD_SET_FORM_SELECT_FIELDS.find((item) => item === fieldName)) {
    return `${fieldName}-toggle-button`;
  }

  return fieldName;
};
