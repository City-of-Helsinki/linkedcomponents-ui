import * as Yup from 'yup';

import { UserFieldsFragment } from '../../generated/graphql';
import { featureFlagUtils } from '../../utils/featureFlags';
import {
  createStringMaxErrorMessage,
  isValidUrl,
} from '../../utils/validationUtils';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import {
  MERCHANT_TEXT_FIELD_MAX_LENGTH,
  ORGANIZATION_FIELDS,
  ORGANIZATION_SELECT_FIELDS,
  WEB_STORE_MERCHANT_FIELDS,
} from './constants';

export const webStoreMerchantSchema = Yup.object().shape({
  [WEB_STORE_MERCHANT_FIELDS.NAME]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .max(
      MERCHANT_TEXT_FIELD_MAX_LENGTH[WEB_STORE_MERCHANT_FIELDS.NAME],
      createStringMaxErrorMessage
    ),
  [WEB_STORE_MERCHANT_FIELDS.STREET_ADDRESS]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .max(
      MERCHANT_TEXT_FIELD_MAX_LENGTH[WEB_STORE_MERCHANT_FIELDS.STREET_ADDRESS],
      createStringMaxErrorMessage
    ),
  [WEB_STORE_MERCHANT_FIELDS.ZIPCODE]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .max(
      MERCHANT_TEXT_FIELD_MAX_LENGTH[WEB_STORE_MERCHANT_FIELDS.ZIPCODE],
      createStringMaxErrorMessage
    ),
  [WEB_STORE_MERCHANT_FIELDS.CITY]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .max(
      MERCHANT_TEXT_FIELD_MAX_LENGTH[WEB_STORE_MERCHANT_FIELDS.CITY],
      createStringMaxErrorMessage
    ),
  [WEB_STORE_MERCHANT_FIELDS.EMAIL]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .email(VALIDATION_MESSAGE_KEYS.EMAIL)
    .max(
      MERCHANT_TEXT_FIELD_MAX_LENGTH[WEB_STORE_MERCHANT_FIELDS.EMAIL],
      createStringMaxErrorMessage
    ),
  [WEB_STORE_MERCHANT_FIELDS.PHONE_NUMBER]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .max(
      MERCHANT_TEXT_FIELD_MAX_LENGTH[WEB_STORE_MERCHANT_FIELDS.PHONE_NUMBER],
      createStringMaxErrorMessage
    ),
  [WEB_STORE_MERCHANT_FIELDS.URL]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .max(
      MERCHANT_TEXT_FIELD_MAX_LENGTH[WEB_STORE_MERCHANT_FIELDS.URL],
      createStringMaxErrorMessage
    )
    .test('is-url-valid', VALIDATION_MESSAGE_KEYS.URL, (value) =>
      isValidUrl(value)
    ),
  [WEB_STORE_MERCHANT_FIELDS.TERMS_OF_SERVICE_URL]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .max(
      MERCHANT_TEXT_FIELD_MAX_LENGTH[
        WEB_STORE_MERCHANT_FIELDS.TERMS_OF_SERVICE_URL
      ],
      createStringMaxErrorMessage
    )
    .test('is-url-valid', VALIDATION_MESSAGE_KEYS.URL, (value) =>
      isValidUrl(value)
    ),
  [WEB_STORE_MERCHANT_FIELDS.BUSINESS_ID]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .max(
      MERCHANT_TEXT_FIELD_MAX_LENGTH[WEB_STORE_MERCHANT_FIELDS.BUSINESS_ID],
      createStringMaxErrorMessage
    ),
  [WEB_STORE_MERCHANT_FIELDS.PAYTRAIL_MERCHANT_ID]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .max(
      MERCHANT_TEXT_FIELD_MAX_LENGTH[
        WEB_STORE_MERCHANT_FIELDS.PAYTRAIL_MERCHANT_ID
      ],
      createStringMaxErrorMessage
    ),
});

export const getOrganizationSchema = ({
  user,
}: {
  user?: UserFieldsFragment;
}) =>
  Yup.object().shape({
    [ORGANIZATION_FIELDS.ORIGIN_ID]: Yup.string().when(
      [ORGANIZATION_FIELDS.ID],
      ([id], schema) =>
        id ? schema : schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    ),
    [ORGANIZATION_FIELDS.NAME]: Yup.string()
      .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
      .nullable(),
    [ORGANIZATION_FIELDS.FOUNDING_DATE]: Yup.date()
      .nullable()
      .typeError(VALIDATION_MESSAGE_KEYS.DATE),
    [ORGANIZATION_FIELDS.DISSOLUTION_DATE]: Yup.date()
      .nullable()
      .typeError(VALIDATION_MESSAGE_KEYS.DATE),
    [ORGANIZATION_FIELDS.PARENT_ORGANIZATION]: Yup.string().when(
      [ORGANIZATION_FIELDS.ID],
      ([id], schema) =>
        id ? schema : schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    ),
    ...(featureFlagUtils.isFeatureEnabled('WEB_STORE_INTEGRATION') &&
    user?.isSuperuser
      ? {
          [ORGANIZATION_FIELDS.WEB_STORE_MERCHANTS]: Yup.array().of(
            webStoreMerchantSchema
          ),
        }
      : /* istanbul ignore next */ {}),
  });

export const getFocusableFieldId = (fieldName: string): string => {
  if (ORGANIZATION_SELECT_FIELDS.find((item) => item === fieldName)) {
    return `${fieldName}-input`;
  }
  return fieldName;
};
