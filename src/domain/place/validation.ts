import reduce from 'lodash/reduce';
import * as Yup from 'yup';

import { LE_DATA_LANGUAGES, ORDERED_LE_DATA_LANGUAGES } from '../../constants';
import { isValidPhoneNumber, isValidZip } from '../../utils/validationUtils';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import { PLACE_FIELDS } from './constants';

const createMultiLanguageValidation = (
  rule: Yup.StringSchema<string | null | undefined>
) => {
  return Yup.object().shape(
    reduce(
      ORDERED_LE_DATA_LANGUAGES,
      (acc, lang) => ({ ...acc, [lang]: rule }),
      {}
    )
  );
};

export const placeSchema = Yup.object().shape({
  [PLACE_FIELDS.PUBLISHER]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .nullable(),
  [PLACE_FIELDS.NAME]: Yup.object().shape({
    [LE_DATA_LANGUAGES.FI]: Yup.string()
      .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
      .nullable(),
  }),
  [PLACE_FIELDS.INFO_URL]: createMultiLanguageValidation(
    Yup.string().url(VALIDATION_MESSAGE_KEYS.URL)
  ),
  [PLACE_FIELDS.EMAIL]: Yup.string().email(VALIDATION_MESSAGE_KEYS.EMAIL),
  [PLACE_FIELDS.TELEPHONE]: createMultiLanguageValidation(
    Yup.string().test(
      'isValidPhoneNumber',
      VALIDATION_MESSAGE_KEYS.PHONE,
      (value) => !value || isValidPhoneNumber(value)
    )
  ),
  [PLACE_FIELDS.POSTAL_CODE]: Yup.string().test(
    'isValidZip',
    VALIDATION_MESSAGE_KEYS.ZIP,
    (value) => !value || isValidZip(value)
  ),
});
