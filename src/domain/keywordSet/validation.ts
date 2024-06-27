import * as Yup from 'yup';

import { LE_DATA_LANGUAGES, ORDERED_LE_DATA_LANGUAGES } from '../../constants';
import {
  createMultiLanguageValidation,
  createStringMaxErrorMessage,
  getFocusableFieldId,
} from '../../utils/validationUtils';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import {
  KEYWORD_SET_FIELDS,
  KEYWORD_SET_FORM_SELECT_FIELDS,
  KEYWORD_SET_TEXT_FIELD_MAX_LENGTH,
} from './constants';

export const keywordSetSchema = Yup.object().shape({
  [KEYWORD_SET_FIELDS.ORIGIN_ID]: Yup.string()
    .when([KEYWORD_SET_FIELDS.ID], ([id], schema) =>
      id ? schema : schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    )
    .max(
      KEYWORD_SET_TEXT_FIELD_MAX_LENGTH[KEYWORD_SET_FIELDS.ORIGIN_ID],
      createStringMaxErrorMessage
    ),
  [KEYWORD_SET_FIELDS.NAME]: Yup.object().shape({
    ...createMultiLanguageValidation(
      ORDERED_LE_DATA_LANGUAGES.filter((l) => l !== LE_DATA_LANGUAGES.FI),
      Yup.string().max(
        KEYWORD_SET_TEXT_FIELD_MAX_LENGTH[KEYWORD_SET_FIELDS.NAME],
        createStringMaxErrorMessage
      )
    ).fields,
    [LE_DATA_LANGUAGES.FI]: Yup.string()
      .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
      .max(
        KEYWORD_SET_TEXT_FIELD_MAX_LENGTH[KEYWORD_SET_FIELDS.NAME],
        createStringMaxErrorMessage
      ),
  }),
  [KEYWORD_SET_FIELDS.KEYWORDS]: Yup.array()
    .required(VALIDATION_MESSAGE_KEYS.ARRAY_REQUIRED)
    .min(1, VALIDATION_MESSAGE_KEYS.KEYWORD_REQUIRED),
  [KEYWORD_SET_FIELDS.USAGE]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .nullable(),
});

export const getFocusableKeywordSetFieldId = (fieldName: string) =>
  getFocusableFieldId(fieldName, {
    arrayFields: [],
    checkboxGroupFields: [],
    comboboxFields: [],
    selectFields: KEYWORD_SET_FORM_SELECT_FIELDS,
    textEditorFields: [],
  });
