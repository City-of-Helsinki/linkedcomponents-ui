import * as Yup from 'yup';

import { LE_DATA_LANGUAGES, ORDERED_LE_DATA_LANGUAGES } from '../../constants';
import {
  createMultiLanguageValidation,
  createStringMaxErrorMessage,
  getFocusableFieldId,
} from '../../utils/validationUtils';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import {
  KEYWORD_FIELDS,
  KEYWORD_FORM_COMBOBOX_FIELDS,
  KEYWORD_FORM_SELECT_FIELDS,
  KEYWORD_TEXT_FIELD_MAX_LENGTH,
} from './constants';

export const keywordSchema = Yup.object().shape({
  [KEYWORD_FIELDS.ORIGIN_ID]: Yup.string().max(
    KEYWORD_TEXT_FIELD_MAX_LENGTH[KEYWORD_FIELDS.ORIGIN_ID],
    createStringMaxErrorMessage
  ),
  [KEYWORD_FIELDS.NAME]: Yup.object().shape({
    ...createMultiLanguageValidation(
      ORDERED_LE_DATA_LANGUAGES.filter((l) => l !== LE_DATA_LANGUAGES.FI),
      Yup.string().max(
        KEYWORD_TEXT_FIELD_MAX_LENGTH[KEYWORD_FIELDS.NAME],
        createStringMaxErrorMessage
      )
    ).fields,
    [LE_DATA_LANGUAGES.FI]: Yup.string()
      .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
      .max(
        KEYWORD_TEXT_FIELD_MAX_LENGTH[KEYWORD_FIELDS.NAME],
        createStringMaxErrorMessage
      ),
  }),
});

export const getFocusableKeywordFieldId = (fieldName: string) =>
  getFocusableFieldId(fieldName, {
    arrayFields: [],
    checkboxGroupFields: [],
    comboboxFields: KEYWORD_FORM_COMBOBOX_FIELDS,
    selectFields: KEYWORD_FORM_SELECT_FIELDS,
    textEditorFields: [],
  });
