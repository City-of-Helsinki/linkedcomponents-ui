import * as Yup from 'yup';

import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import { ORGANIZATION_FIELDS } from './constants';

export const organizationSchema = Yup.object().shape({
  [ORGANIZATION_FIELDS.DATA_SOURCE]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .nullable(),
  [ORGANIZATION_FIELDS.ORIGIN_ID]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .nullable(),
  [ORGANIZATION_FIELDS.NAME]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .nullable(),
});
