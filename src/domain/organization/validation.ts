import * as Yup from 'yup';

import { UserFieldsFragment } from '../../generated/graphql';
import { featureFlagUtils } from '../../utils/featureFlags';
import {
  createStringMaxErrorMessage,
  isValidUrl,
} from '../../utils/validationUtils';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import {
  ACCOUNT_TEXT_FIELD_MAX_LENGTH,
  MERCHANT_TEXT_FIELD_MAX_LENGTH,
  ORGANIZATION_ACTIONS,
  ORGANIZATION_FIELDS,
  ORGANIZATION_FINANCIAL_INFO_ACTIONS,
  ORGANIZATION_SELECT_FIELDS,
  ORGANIZATION_TEXT_FIELD_MAX_LENGTH,
  WEB_STORE_ACCOUNT_FIELDS,
  WEB_STORE_MERCHANT_FIELDS,
} from './constants';
import {
  checkCanUserDoFinancialInfoAction,
  checkCanUserDoOrganizationAction,
} from './utils';

export const webStoreAccountSchema = Yup.object().shape({
  [WEB_STORE_ACCOUNT_FIELDS.NAME]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .max(
      ACCOUNT_TEXT_FIELD_MAX_LENGTH[WEB_STORE_ACCOUNT_FIELDS.NAME],
      createStringMaxErrorMessage
    ),
  [WEB_STORE_ACCOUNT_FIELDS.VAT_CODE]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .max(
      ACCOUNT_TEXT_FIELD_MAX_LENGTH[WEB_STORE_ACCOUNT_FIELDS.VAT_CODE],
      createStringMaxErrorMessage
    ),
  [WEB_STORE_ACCOUNT_FIELDS.COMPANY_CODE]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .max(
      ACCOUNT_TEXT_FIELD_MAX_LENGTH[WEB_STORE_ACCOUNT_FIELDS.COMPANY_CODE],
      createStringMaxErrorMessage
    ),
  [WEB_STORE_ACCOUNT_FIELDS.MAIN_LEDGER_ACCOUNT]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .max(
      ACCOUNT_TEXT_FIELD_MAX_LENGTH[
        WEB_STORE_ACCOUNT_FIELDS.MAIN_LEDGER_ACCOUNT
      ],
      createStringMaxErrorMessage
    ),
  [WEB_STORE_ACCOUNT_FIELDS.BALANCE_PROFIT_CENTER]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .max(
      ACCOUNT_TEXT_FIELD_MAX_LENGTH[
        WEB_STORE_ACCOUNT_FIELDS.BALANCE_PROFIT_CENTER
      ],
      createStringMaxErrorMessage
    ),
  [WEB_STORE_ACCOUNT_FIELDS.INTERNAL_ORDER]: Yup.string().max(
    ACCOUNT_TEXT_FIELD_MAX_LENGTH[WEB_STORE_ACCOUNT_FIELDS.INTERNAL_ORDER],
    createStringMaxErrorMessage
  ),
  [WEB_STORE_ACCOUNT_FIELDS.PROFIT_CENTER]: Yup.string().max(
    ACCOUNT_TEXT_FIELD_MAX_LENGTH[WEB_STORE_ACCOUNT_FIELDS.PROFIT_CENTER],
    createStringMaxErrorMessage
  ),
  [WEB_STORE_ACCOUNT_FIELDS.PROJECT]: Yup.string().max(
    ACCOUNT_TEXT_FIELD_MAX_LENGTH[WEB_STORE_ACCOUNT_FIELDS.PROJECT],
    createStringMaxErrorMessage
  ),
  [WEB_STORE_ACCOUNT_FIELDS.OPERATION_AREA]: Yup.string().max(
    ACCOUNT_TEXT_FIELD_MAX_LENGTH[WEB_STORE_ACCOUNT_FIELDS.OPERATION_AREA],
    createStringMaxErrorMessage
  ),
});

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
  action,
  publisher,
  user,
}: {
  action: ORGANIZATION_ACTIONS.CREATE | ORGANIZATION_ACTIONS.UPDATE;
  publisher: string;
  user?: UserFieldsFragment;
}) =>
  Yup.object().shape({
    ...(checkCanUserDoOrganizationAction({
      action,
      id: publisher,
      user,
    })
      ? {
          [ORGANIZATION_FIELDS.ORIGIN_ID]: Yup.string()
            .when([ORGANIZATION_FIELDS.ID], ([id], schema) =>
              id
                ? schema
                : schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
            )
            .max(
              ORGANIZATION_TEXT_FIELD_MAX_LENGTH[ORGANIZATION_FIELDS.ORIGIN_ID],
              createStringMaxErrorMessage
            ),
          [ORGANIZATION_FIELDS.NAME]: Yup.string()
            .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
            .max(
              ORGANIZATION_TEXT_FIELD_MAX_LENGTH[ORGANIZATION_FIELDS.NAME],
              createStringMaxErrorMessage
            ),
          [ORGANIZATION_FIELDS.FOUNDING_DATE]: Yup.date()
            .nullable()
            .typeError(VALIDATION_MESSAGE_KEYS.DATE),
          [ORGANIZATION_FIELDS.DISSOLUTION_DATE]: Yup.date()
            .nullable()
            .typeError(VALIDATION_MESSAGE_KEYS.DATE),
          [ORGANIZATION_FIELDS.PARENT_ORGANIZATION]: Yup.string().when(
            [ORGANIZATION_FIELDS.ID],
            ([id], schema) =>
              id
                ? schema
                : schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
          ),
        }
      : /* istanbul ignore next */ {}),
    ...(featureFlagUtils.isFeatureEnabled('WEB_STORE_INTEGRATION') &&
    checkCanUserDoFinancialInfoAction({
      action:
        action === ORGANIZATION_ACTIONS.UPDATE
          ? ORGANIZATION_FINANCIAL_INFO_ACTIONS.MANAGE_IN_UPDATE
          : ORGANIZATION_FINANCIAL_INFO_ACTIONS.MANAGE_IN_CREATE,
      organizationId: publisher,
      user,
    })
      ? {
          [ORGANIZATION_FIELDS.WEB_STORE_ACCOUNTS]: Yup.array().of(
            webStoreAccountSchema
          ),
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
