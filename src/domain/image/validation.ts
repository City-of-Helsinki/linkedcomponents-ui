import * as Yup from 'yup';

import { CHARACTER_LIMITS } from '../../constants';
import {
  createStringMaxErrorMessage,
  createStringMinErrorMessage,
} from '../../utils/validationUtils';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import { IMAGE_ALT_TEXT_MIN_LENGTH } from '../event/constants';
import { ADD_IMAGE_FIELDS, IMAGE_FIELDS } from './constants';

export const imageSchema = Yup.object().shape({
  [IMAGE_FIELDS.PUBLISHER]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .nullable(),
  [IMAGE_FIELDS.ALT_TEXT]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .min(IMAGE_ALT_TEXT_MIN_LENGTH, createStringMinErrorMessage)
    .max(CHARACTER_LIMITS.SHORT_STRING, createStringMaxErrorMessage),
  [IMAGE_FIELDS.NAME]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .max(CHARACTER_LIMITS.MEDIUM_STRING, createStringMaxErrorMessage),
});

export const addImageSchema = Yup.object().shape(
  {
    [ADD_IMAGE_FIELDS.SELECTED_IMAGE]: Yup.array().when(
      [ADD_IMAGE_FIELDS.URL],
      (url: string, schema: Yup.SchemaOf<string[]>) =>
        url ? schema.min(0) : schema.min(1)
    ),
    [ADD_IMAGE_FIELDS.URL]: Yup.string().when(
      [ADD_IMAGE_FIELDS.SELECTED_IMAGE],
      (ids: string[], schema: Yup.StringSchema) =>
        ids.length ? schema : schema.url(VALIDATION_MESSAGE_KEYS.URL)
    ),
  },
  [[ADD_IMAGE_FIELDS.SELECTED_IMAGE, ADD_IMAGE_FIELDS.URL]]
);
