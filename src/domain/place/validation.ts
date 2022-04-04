import * as Yup from 'yup';

import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import { PLACE_FIELDS } from './constants';

export const placeSchema = Yup.object().shape({
  [PLACE_FIELDS.PUBLISHER]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .nullable(),
});
