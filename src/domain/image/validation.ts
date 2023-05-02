/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Yup from 'yup';

import {
  CHARACTER_LIMITS,
  LE_DATA_LANGUAGES,
  ORDERED_LE_DATA_LANGUAGES,
} from '../../constants';
import { Maybe } from '../../types';
import { featureFlagUtils } from '../../utils/featureFlags';
import {
  createMultiLanguageValidation,
  createStringMaxErrorMessage,
  createStringMinErrorMessage,
  isValidUrl,
} from '../../utils/validationUtils';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import { IMAGE_ALT_TEXT_MIN_LENGTH } from '../event/constants';
import {
  ADD_IMAGE_FIELDS,
  IMAGE_FIELDS,
  IMAGE_SELECT_FIELDS,
} from './constants';

// This schema is used in event form when validating image fields
export const imageDetailsSchema = Yup.object().shape({
  [IMAGE_FIELDS.ALT_TEXT]: Yup.object().shape({
    [LE_DATA_LANGUAGES.FI]: Yup.string()
      .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
      .min(IMAGE_ALT_TEXT_MIN_LENGTH, createStringMinErrorMessage)
      .max(CHARACTER_LIMITS.SHORT_STRING, createStringMaxErrorMessage),
    ...(featureFlagUtils.isFeatureEnabled('LOCALIZED_IMAGE') &&
      createMultiLanguageValidation(
        ORDERED_LE_DATA_LANGUAGES.filter((l) => l !== LE_DATA_LANGUAGES.FI),
        Yup.string()
          .nullable()
          .transform((v, o) => (o === '' ? null : v))
          .min(IMAGE_ALT_TEXT_MIN_LENGTH, createStringMinErrorMessage)
          .max(CHARACTER_LIMITS.SHORT_STRING, createStringMaxErrorMessage)
      ).fields),
  }),

  [IMAGE_FIELDS.NAME]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .max(CHARACTER_LIMITS.MEDIUM_STRING, createStringMaxErrorMessage),
});

export const imageSchema = Yup.object().shape({
  [IMAGE_FIELDS.PUBLISHER]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .nullable(),
  ...imageDetailsSchema.fields,
});

const validateSelectedImage = (
  [file, url]: any[],
  schema: Yup.ArraySchema<Maybe<string[]>, Yup.AnyObject>
): Yup.ArraySchema<Maybe<string[]>, Yup.AnyObject> =>
  !!file || !!url ? schema.min(0) : schema.min(1);

const validateFile = ([ids, url]: any[], schema: Yup.MixedSchema<any>) =>
  ids.length || url
    ? schema
    : schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED);

const validateUrl = ([ids, imageFile]: any[], schema: Yup.StringSchema) =>
  imageFile || ids.length
    ? schema
    : schema.test('is-url-valid', VALIDATION_MESSAGE_KEYS.URL, (value) =>
        isValidUrl(value)
      );

export const addImageSchema = Yup.object().shape(
  {
    [ADD_IMAGE_FIELDS.SELECTED_IMAGE]: Yup.array().when(
      [ADD_IMAGE_FIELDS.IMAGE_FILE, ADD_IMAGE_FIELDS.URL],
      validateSelectedImage
    ),
    [ADD_IMAGE_FIELDS.IMAGE_FILE]: Yup.mixed()
      .nullable()
      .when(
        [ADD_IMAGE_FIELDS.SELECTED_IMAGE, ADD_IMAGE_FIELDS.URL],
        validateFile
      ),
    [ADD_IMAGE_FIELDS.URL]: Yup.string().when(
      [ADD_IMAGE_FIELDS.SELECTED_IMAGE, ADD_IMAGE_FIELDS.IMAGE_FILE],
      validateUrl
    ),
  },
  [
    [ADD_IMAGE_FIELDS.SELECTED_IMAGE, ADD_IMAGE_FIELDS.IMAGE_FILE],
    [ADD_IMAGE_FIELDS.SELECTED_IMAGE, ADD_IMAGE_FIELDS.URL],
    [ADD_IMAGE_FIELDS.IMAGE_FILE, ADD_IMAGE_FIELDS.URL],
  ]
);

export const getFocusableFieldId = (fieldName: string): string => {
  if (IMAGE_SELECT_FIELDS.find((item) => item === fieldName)) {
    return `${fieldName}-input`;
  }
  return fieldName;
};
