import * as Yup from 'yup';

import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';

export const createValidationSchema = () =>
  Yup.object().shape({
    type: Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
  });
