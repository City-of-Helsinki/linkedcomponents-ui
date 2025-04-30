import * as Yup from 'yup';

import { LE_DATA_LANGUAGES, ORDERED_LE_DATA_LANGUAGES } from '../../constants';
import {
  createMultiLanguageValidation,
  createStringMaxErrorMessage,
  getFocusableFieldId,
} from '../../utils/validationUtils';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import {
  PRICE_GROUP_FIELDS,
  PRICE_GROUP_FORM_SELECT_FIELDS,
  PRICE_GROUP_TEXT_FIELD_MAX_LENGTH,
} from './constants';

export const priceGroupSchema = Yup.object().shape({
  [PRICE_GROUP_FIELDS.PUBLISHER]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .nullable(),
  [PRICE_GROUP_FIELDS.DESCRIPTION]: createMultiLanguageValidation(
    ORDERED_LE_DATA_LANGUAGES,
    Yup.string().max(
      PRICE_GROUP_TEXT_FIELD_MAX_LENGTH[PRICE_GROUP_FIELDS.DESCRIPTION],
      createStringMaxErrorMessage
    )
  ).concat(
    Yup.object().shape({
      [LE_DATA_LANGUAGES.FI]: Yup.string()
        .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
        .max(
          PRICE_GROUP_TEXT_FIELD_MAX_LENGTH[PRICE_GROUP_FIELDS.DESCRIPTION],
          createStringMaxErrorMessage
        ),
    })
  ),
});

export const getFocusablePriceGroupFieldId = (fieldName: string) =>
  getFocusableFieldId(fieldName, {
    arrayFields: [],
    checkboxGroupFields: [],
    comboboxFields: [],
    selectFields: PRICE_GROUP_FORM_SELECT_FIELDS,
    textEditorFields: [],
  });
