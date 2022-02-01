import * as Yup from 'yup';

import { LE_DATA_LANGUAGES } from '../../constants';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import { KEYWORD_FIELDS } from './constants';

export const keywordSchema = Yup.object().shape({
  [KEYWORD_FIELDS.NAME]: Yup.object().shape({
    [LE_DATA_LANGUAGES.FI]: Yup.string()
      .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
      .nullable(),
  }),
});
