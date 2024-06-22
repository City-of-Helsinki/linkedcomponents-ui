import { EMPTY_MULTI_LANGUAGE_OBJECT } from '../../constants';
import {
  CommonRegistrationAndEventFields,
  RegistrationFormFields,
} from './types';
import { formatInstructions } from './utils';

export enum REGISTRATION_MANDATORY_FIELDS {
  FIRST_NAME = 'first_name',
  LAST_NAME = 'last_name',
  PHONE_NUMBER = 'phone_number',
  STREET_ADDRESS = 'street_address',
  ZIPCODE = 'zipcode',
  CITY = 'city',
}

export enum REGISTRATION_ACCOUNT_FIELDS {
  ACCOUNT = 'account',
  BALANCE_PROFIT_CENTER = 'balanceProfitCenter',
  COMPANY_CODE = 'companyCode',
  INTERNAL_ORDER = 'internalOrder',
  MAIN_LEDGER_ACCOUNT = 'mainLedgerAccount',
  OPERATION_AREA = 'operationArea',
  PROFIT_CENTER = 'profitCenter',
  PROJECT = 'project',
}

export enum REGISTRATION_MERCHANT_FIELDS {
  MERCHANT = 'merchant',
}

export enum REGISTRATION_FIELDS {
  AUDIENCE_MAX_AGE = 'audienceMaxAge',
  AUDIENCE_MIN_AGE = 'audienceMinAge',
  CONFIRMATION_MESSAGE = 'confirmationMessage',
  ENROLMENT_END_TIME_DATE = 'enrolmentEndTimeDate',
  ENROLMENT_END_TIME_TIME = 'enrolmentEndTimeTime',
  ENROLMENT_START_TIME_DATE = 'enrolmentStartTimeDate',
  ENROLMENT_START_TIME_TIME = 'enrolmentStartTimeTime',
  EVENT = 'event',
  HAS_PRICE = 'hasPrice',
  INFO_LANGUAGES = 'infoLanguages',
  INSTRUCTIONS = 'instructions',
  MANDATORY_FIELDS = 'mandatoryFields',
  MAXIMUM_ATTENDEE_CAPACITY = 'maximumAttendeeCapacity',
  MAXIMUM_GROUP_SIZE = 'maximumGroupSize',
  MINIMUM_ATTENDEE_CAPACITY = 'minimumAttendeeCapacity',
  PRICE_GROUP_OPTIONS = 'priceGroupOptions',
  REGISTRATION_ACCOUNT = 'registrationAccount',
  REGISTRATION_MERCHANT = 'registrationMerchant',
  REGISTRATION_PRICE_GROUPS = 'registrationPriceGroups',
  REGISTRATION_PRICE_GROUPS_VAT_PERCENTAGE = 'registrationPriceGroupsVatPercentage',
  REGISTRATION_USER_ACCESSES = 'registrationUserAccesses',
  WAITING_LIST_CAPACITY = 'waitingListCapacity',
}

export enum REGISTRATION_PRICE_GROUP_FIELDS {
  ID = 'id',
  PRICE = 'price',
  PRICE_GROUP = 'priceGroup',
}

export enum REGISTRATION_USER_ACCESS_FIELDS {
  EMAIL = 'email',
  ID = 'id',
  IS_SUBSTITUTE_USER = 'isSubstituteUser',
  LANGUAGE = 'language',
}
export const DEFAULT_VAT_PERCENTAGE = '25.50';

export const REGISTRATION_INITIAL_VALUES: RegistrationFormFields = {
  [REGISTRATION_FIELDS.AUDIENCE_MAX_AGE]: '',
  [REGISTRATION_FIELDS.AUDIENCE_MIN_AGE]: '',
  [REGISTRATION_FIELDS.CONFIRMATION_MESSAGE]: {
    ...EMPTY_MULTI_LANGUAGE_OBJECT,
  },
  [REGISTRATION_FIELDS.ENROLMENT_END_TIME_DATE]: null,
  [REGISTRATION_FIELDS.ENROLMENT_END_TIME_TIME]: '',
  [REGISTRATION_FIELDS.ENROLMENT_START_TIME_DATE]: null,
  [REGISTRATION_FIELDS.ENROLMENT_START_TIME_TIME]: '',
  [REGISTRATION_FIELDS.EVENT]: '',
  [REGISTRATION_FIELDS.HAS_PRICE]: false,
  [REGISTRATION_FIELDS.INFO_LANGUAGES]: ['fi'],
  [REGISTRATION_FIELDS.INSTRUCTIONS]: formatInstructions(
    EMPTY_MULTI_LANGUAGE_OBJECT
  ),
  [REGISTRATION_FIELDS.MANDATORY_FIELDS]: [
    REGISTRATION_MANDATORY_FIELDS.FIRST_NAME,
    REGISTRATION_MANDATORY_FIELDS.LAST_NAME,
  ],
  [REGISTRATION_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: '',
  [REGISTRATION_FIELDS.MAXIMUM_GROUP_SIZE]: '',
  [REGISTRATION_FIELDS.MINIMUM_ATTENDEE_CAPACITY]: '',
  [REGISTRATION_FIELDS.PRICE_GROUP_OPTIONS]: [],
  [REGISTRATION_FIELDS.REGISTRATION_ACCOUNT]: {
    account: '',
    balanceProfitCenter: '',
    companyCode: '',
    internalOrder: '',
    mainLedgerAccount: '',
    operationArea: '',
    profitCenter: '',
    project: '',
  },
  [REGISTRATION_FIELDS.REGISTRATION_MERCHANT]: { merchant: '' },
  [REGISTRATION_FIELDS.REGISTRATION_PRICE_GROUPS]: [],
  [REGISTRATION_FIELDS.REGISTRATION_PRICE_GROUPS_VAT_PERCENTAGE]:
    DEFAULT_VAT_PERCENTAGE,
  [REGISTRATION_FIELDS.REGISTRATION_USER_ACCESSES]: [],
  [REGISTRATION_FIELDS.WAITING_LIST_CAPACITY]: '',
};

export const DEFAULT_COMMON_REGISTRATION_AND_EVENT_FIELD_VALUES: CommonRegistrationAndEventFields =
  {
    audienceMaxAge: REGISTRATION_INITIAL_VALUES.audienceMaxAge,
    audienceMinAge: REGISTRATION_INITIAL_VALUES.audienceMinAge,
    enrolmentEndTimeDate: REGISTRATION_INITIAL_VALUES.enrolmentEndTimeDate,
    enrolmentEndTimeTime: REGISTRATION_INITIAL_VALUES.enrolmentEndTimeTime,
    enrolmentStartTimeDate: REGISTRATION_INITIAL_VALUES.enrolmentStartTimeDate,
    enrolmentStartTimeTime: REGISTRATION_INITIAL_VALUES.enrolmentStartTimeTime,
    hasPrice: REGISTRATION_INITIAL_VALUES.hasPrice,
    maximumAttendeeCapacity:
      REGISTRATION_INITIAL_VALUES.maximumAttendeeCapacity,
    minimumAttendeeCapacity:
      REGISTRATION_INITIAL_VALUES.minimumAttendeeCapacity,
    registrationPriceGroups:
      REGISTRATION_INITIAL_VALUES.registrationPriceGroups,
    registrationPriceGroupsVatPercentage: DEFAULT_VAT_PERCENTAGE,
  };

export const REGISTRATION_FIELD_ARRAYS: string[] = [
  REGISTRATION_FIELDS.REGISTRATION_PRICE_GROUPS,
];

export const REGISTRATION_COMBOBOX_FIELDS = [
  REGISTRATION_FIELDS.EVENT,
  `${REGISTRATION_FIELDS.REGISTRATION_PRICE_GROUPS}[[0-9]*].${REGISTRATION_PRICE_GROUP_FIELDS.PRICE_GROUP}`,
];

export const REGISTRATION_SELECT_FIELDS = [
  REGISTRATION_FIELDS.REGISTRATION_PRICE_GROUPS_VAT_PERCENTAGE,
  `${REGISTRATION_FIELDS.REGISTRATION_MERCHANT}.${REGISTRATION_MERCHANT_FIELDS.MERCHANT}`,
  `${REGISTRATION_FIELDS.REGISTRATION_ACCOUNT}.${REGISTRATION_ACCOUNT_FIELDS.ACCOUNT}`,
  `${REGISTRATION_FIELDS.REGISTRATION_USER_ACCESSES}[[0-9]*].${REGISTRATION_USER_ACCESS_FIELDS.LANGUAGE}`,
];

export const REGISTRATION_INCLUDES = ['event', 'keywords', 'location'];

export const TEST_REGISTRATION_ID = 'registration:0';
export const TEST_REGISTRATION_USER_ID = 1;

export enum REGISTRATION_MODALS {
  DELETE = 'delete',
}
