import * as Yup from 'yup';

import { PriceGroup } from '../../generated/graphql';
import { featureFlagUtils } from '../../utils/featureFlags';
import {
  createNumberMinErrorMessage,
  createStringMaxErrorMessage,
  isAfterStartDateAndTime,
  isEmailInAllowedDomain,
  isValidTime,
  transformNumber,
} from '../../utils/validationUtils';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import { ACCOUNT_TEXT_FIELD_MAX_LENGTH } from '../organization/constants';
import { PriceGroupOption } from '../priceGroup/types';
import {
  REGISTRATION_ACCOUNT_FIELDS,
  REGISTRATION_COMBOBOX_FIELDS,
  REGISTRATION_FIELD_ARRAYS,
  REGISTRATION_FIELDS,
  REGISTRATION_MERCHANT_FIELDS,
  REGISTRATION_PRICE_GROUP_FIELDS,
  REGISTRATION_SELECT_FIELDS,
  REGISTRATION_USER_ACCESS_FIELDS,
} from './constants';

export const getPriceGroupSchema = (priceGroupOptions: PriceGroupOption[]) =>
  Yup.object().shape({
    [REGISTRATION_PRICE_GROUP_FIELDS.PRICE_GROUP]: Yup.string().required(
      VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
    ),
    [REGISTRATION_PRICE_GROUP_FIELDS.PRICE]: Yup.number().when(
      [REGISTRATION_PRICE_GROUP_FIELDS.PRICE_GROUP],
      ([priceGroup]: string[], schema) =>
        priceGroupOptions?.find((pg) => pg.value === priceGroup)?.isFree
          ? schema.nullable().transform(transformNumber)
          : schema
              .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
              .min(0, createNumberMinErrorMessage)
              .test(
                'maxDigitsAfterDecimal',
                VALIDATION_MESSAGE_KEYS.PRICE_INVALID,
                (number) => Number.isInteger(number * 10 ** 2)
              )
    ),
  });

const priceGroupsSchema = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: any[],
  schema: Yup.ArraySchema<PriceGroup[] | undefined, Yup.AnyObject>
) => {
  const [hasPrice, priceGroupOptions] = values as [
    boolean[],
    PriceGroupOption[],
  ];
  return hasPrice
    ? schema
        .min(1, VALIDATION_MESSAGE_KEYS.PRICE_GROUPS_REQUIRED)
        .of(getPriceGroupSchema(priceGroupOptions))
    : schema;
};

const registrationAccountSchema = Yup.object().shape({
  [REGISTRATION_ACCOUNT_FIELDS.ACCOUNT]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
  [REGISTRATION_ACCOUNT_FIELDS.COMPANY_CODE]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .max(
      ACCOUNT_TEXT_FIELD_MAX_LENGTH[REGISTRATION_ACCOUNT_FIELDS.COMPANY_CODE],
      createStringMaxErrorMessage
    ),
  [REGISTRATION_ACCOUNT_FIELDS.MAIN_LEDGER_ACCOUNT]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .max(
      ACCOUNT_TEXT_FIELD_MAX_LENGTH[
        REGISTRATION_ACCOUNT_FIELDS.MAIN_LEDGER_ACCOUNT
      ],
      createStringMaxErrorMessage
    ),
  [REGISTRATION_ACCOUNT_FIELDS.BALANCE_PROFIT_CENTER]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .max(
      ACCOUNT_TEXT_FIELD_MAX_LENGTH[
        REGISTRATION_ACCOUNT_FIELDS.BALANCE_PROFIT_CENTER
      ],
      createStringMaxErrorMessage
    ),
  [REGISTRATION_ACCOUNT_FIELDS.INTERNAL_ORDER]: Yup.string().max(
    ACCOUNT_TEXT_FIELD_MAX_LENGTH[REGISTRATION_ACCOUNT_FIELDS.INTERNAL_ORDER],
    createStringMaxErrorMessage
  ),
  [REGISTRATION_ACCOUNT_FIELDS.PROFIT_CENTER]: Yup.string().max(
    ACCOUNT_TEXT_FIELD_MAX_LENGTH[REGISTRATION_ACCOUNT_FIELDS.PROFIT_CENTER],
    createStringMaxErrorMessage
  ),
  [REGISTRATION_ACCOUNT_FIELDS.PROJECT]: Yup.string().max(
    ACCOUNT_TEXT_FIELD_MAX_LENGTH[REGISTRATION_ACCOUNT_FIELDS.PROJECT],
    createStringMaxErrorMessage
  ),
  [REGISTRATION_ACCOUNT_FIELDS.OPERATION_AREA]: Yup.string().max(
    ACCOUNT_TEXT_FIELD_MAX_LENGTH[REGISTRATION_ACCOUNT_FIELDS.OPERATION_AREA],
    createStringMaxErrorMessage
  ),
});

const registrationMerchantSchema = Yup.object().shape({
  [REGISTRATION_MERCHANT_FIELDS.MERCHANT]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
});

const registrationUserAccessSchema = Yup.object().shape({
  [REGISTRATION_USER_ACCESS_FIELDS.EMAIL]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .email(VALIDATION_MESSAGE_KEYS.EMAIL)
    .when(
      [REGISTRATION_USER_ACCESS_FIELDS.IS_SUBSTITUTE_USER],
      ([IsSubstituteUser]: boolean[], schema: Yup.StringSchema<string>) =>
        IsSubstituteUser
          ? schema.test(
              'isAllowedEmailDomain',
              VALIDATION_MESSAGE_KEYS.EMAIL_ALLOWED_DOMAIN,
              (value) => isEmailInAllowedDomain(value)
            )
          : schema
    ),
});

export const registrationSchema = Yup.object().shape({
  [REGISTRATION_FIELDS.EVENT]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .nullable(),
  [REGISTRATION_FIELDS.ENROLMENT_START_TIME_DATE]: Yup.date()
    .nullable()
    .required(VALIDATION_MESSAGE_KEYS.DATE_REQUIRED)
    .typeError(VALIDATION_MESSAGE_KEYS.DATE),
  [REGISTRATION_FIELDS.ENROLMENT_START_TIME_TIME]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.TIME_REQUIRED)
    .test('isValidTime', VALIDATION_MESSAGE_KEYS.TIME, (value) =>
      isValidTime(value)
    ),
  [REGISTRATION_FIELDS.ENROLMENT_END_TIME_DATE]: Yup.date()
    .nullable()
    .required(VALIDATION_MESSAGE_KEYS.DATE_REQUIRED)
    .typeError(VALIDATION_MESSAGE_KEYS.DATE)
    .when(
      [
        REGISTRATION_FIELDS.ENROLMENT_START_TIME_DATE,
        REGISTRATION_FIELDS.ENROLMENT_START_TIME_TIME,
        REGISTRATION_FIELDS.ENROLMENT_END_TIME_TIME,
      ],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      isAfterStartDateAndTime as any
    ),
  [REGISTRATION_FIELDS.ENROLMENT_END_TIME_TIME]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.TIME_REQUIRED)
    .test('isValidTime', VALIDATION_MESSAGE_KEYS.TIME, (value) =>
      isValidTime(value)
    ),
  [REGISTRATION_FIELDS.MINIMUM_ATTENDEE_CAPACITY]: Yup.number()
    .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
    .min(0, createNumberMinErrorMessage)
    .nullable()
    .transform(transformNumber),
  [REGISTRATION_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: Yup.number()
    .nullable()
    .transform(transformNumber)
    .required(VALIDATION_MESSAGE_KEYS.NUMBER_REQUIRED)
    .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
    .when(
      [REGISTRATION_FIELDS.MINIMUM_ATTENDEE_CAPACITY],
      ([minimumAttendeeCapacity], schema) => {
        return schema.min(
          minimumAttendeeCapacity || 0,
          createNumberMinErrorMessage
        );
      }
    ),
  [REGISTRATION_FIELDS.WAITING_LIST_CAPACITY]: Yup.number()
    .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
    .min(0, createNumberMinErrorMessage)
    .nullable()
    .transform(transformNumber),
  [REGISTRATION_FIELDS.MAXIMUM_GROUP_SIZE]: Yup.number()
    .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
    .min(1, createNumberMinErrorMessage)
    .nullable()
    .transform(transformNumber),
  [REGISTRATION_FIELDS.AUDIENCE_MIN_AGE]: Yup.number()
    .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
    .min(0, createNumberMinErrorMessage)
    .nullable()
    .transform(transformNumber),
  [REGISTRATION_FIELDS.AUDIENCE_MAX_AGE]: Yup.number()
    .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
    .when([REGISTRATION_FIELDS.AUDIENCE_MIN_AGE], ([audienceMinAge], schema) =>
      schema.min(audienceMinAge || 0, createNumberMinErrorMessage)
    )
    .nullable()
    .transform(transformNumber),
  ...(featureFlagUtils.isFeatureEnabled('WEB_STORE_INTEGRATION')
    ? {
        [REGISTRATION_FIELDS.REGISTRATION_PRICE_GROUPS]: Yup.array().when(
          [
            REGISTRATION_FIELDS.HAS_PRICE,
            REGISTRATION_FIELDS.PRICE_GROUP_OPTIONS,
          ],
          priceGroupsSchema
        ),
        [REGISTRATION_FIELDS.REGISTRATION_PRICE_GROUPS_VAT_PERCENTAGE]:
          Yup.string().when(
            [REGISTRATION_FIELDS.HAS_PRICE],
            ([hasPrice], schema) =>
              hasPrice
                ? schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
                : schema
          ),
        [REGISTRATION_FIELDS.REGISTRATION_MERCHANT]: Yup.object().when(
          [REGISTRATION_FIELDS.HAS_PRICE],
          ([hasPrice], schema) =>
            hasPrice ? registrationMerchantSchema : schema
        ),
        [REGISTRATION_FIELDS.REGISTRATION_ACCOUNT]: Yup.object().when(
          [REGISTRATION_FIELDS.HAS_PRICE],
          ([hasPrice], schema) =>
            hasPrice ? registrationAccountSchema : schema
        ),
      }
    : {}),
  [REGISTRATION_FIELDS.REGISTRATION_USER_ACCESSES]: Yup.array().of(
    registrationUserAccessSchema
  ),
});

export const getFocusableFieldId = (fieldName: string): string => {
  if (REGISTRATION_COMBOBOX_FIELDS.find((item) => item === fieldName)) {
    return `${fieldName}-input`;
  } else if (REGISTRATION_SELECT_FIELDS.find((item) => item === fieldName)) {
    return `${fieldName}-toggle-button`;
  } else if (REGISTRATION_FIELD_ARRAYS.includes(fieldName)) {
    return `${fieldName}-error`;
  }
  return fieldName;
};
