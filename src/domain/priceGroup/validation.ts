import * as Yup from 'yup';

import {
  CHARACTER_LIMITS,
  LE_DATA_LANGUAGES,
  ORDERED_LE_DATA_LANGUAGES,
} from '../../constants';
import {
  createMultiLanguageValidation,
  createStringMaxErrorMessage,
} from '../../utils/validationUtils';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import { PRICE_GROUP_FIELDS } from './constants';

export const priceGroupSchema = Yup.object().shape({
  [PRICE_GROUP_FIELDS.PUBLISHER]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .nullable(),
  [PRICE_GROUP_FIELDS.DESCRIPTION]: createMultiLanguageValidation(
    ORDERED_LE_DATA_LANGUAGES,
    Yup.string().max(
      CHARACTER_LIMITS.MEDIUM_STRING,
      createStringMaxErrorMessage
    )
  ).concat(
    Yup.object().shape({
      [LE_DATA_LANGUAGES.FI]: Yup.string()
        .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
        .max(CHARACTER_LIMITS.MEDIUM_STRING, createStringMaxErrorMessage),
    })
  ),
});
