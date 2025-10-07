/* eslint-disable @typescript-eslint/no-explicit-any */
import isFuture from 'date-fns/isFuture';
import * as Yup from 'yup';

import { Maybe } from '../../types';
import { featureFlagUtils } from '../../utils/featureFlags';
import getValue from '../../utils/getValue';
import skipFalsyType from '../../utils/skipFalsyType';
import {
  createArrayMinErrorMessage,
  createMultiLanguageValidation,
  createNumberMaxErrorMessage,
  createNumberMinErrorMessage,
  createStringMaxErrorMessage,
  isAfterDate,
  isAfterStartDateAndTime,
  isAfterTime,
  isFutureDateAndTime,
  isValidPhoneNumber,
  isValidTime,
  isValidUrl,
  transformNumber,
} from '../../utils/validationUtils';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import { imageDetailsSchema } from '../image/validation';
import { PriceGroupOption } from '../priceGroup/types';
import { getPriceGroupSchema } from '../registration/validation';
import {
  ADD_EVENT_TIME_FORM_NAME,
  EDIT_EVENT_TIME_FORM_NAME,
  EVENT_EXTERNAL_LINK_TEXT_FIELD_MAX_LENGTH,
  EVENT_FIELDS,
  EVENT_OFFER_FIELDS,
  EVENT_OFFER_TEXT_FIELD_MAX_LENGTH,
  EVENT_TEXT_FIELD_MAX_LENGTH,
  EVENT_TIME_FIELDS,
  EVENT_VIDEO_TEXT_FIELD_MAX_LENGTH,
  EXTERNAL_LINK_FIELDS,
  RECURRING_EVENT_FIELDS,
  VIDEO_DETAILS_FIELDS,
} from './constants';
import { EventTime, OfferFields, RecurringEventSettings } from './types';

const createMultiLanguageValidationByInfoLanguages = (
  rule: Yup.StringSchema<Maybe<string>>
) => {
  return Yup.object().when(
    [EVENT_FIELDS.EVENT_INFO_LANGUAGES],
    ([languages]: string[][]) => createMultiLanguageValidation(languages, rule)
  );
};

const validateEventTimes = (
  values: any[],
  schema: Yup.ArraySchema<EventTime[] | undefined, Yup.AnyObject>
) => {
  const [recurringEvents, events] = values as [
    RecurringEventSettings[] | null,
    EventTime[] | null,
  ];

  return schema.test(
    'hasAtLeaseOneEventTime',
    VALIDATION_MESSAGE_KEYS.EVENT_TIMES_REQUIRED,
    (eventTimes) => {
      const allEventTimes = [
        ...getValue(eventTimes, []),
        ...getValue(events, []),
      ].filter(skipFalsyType);

      recurringEvents?.forEach((recurringEvent) => {
        allEventTimes.push(...recurringEvent.eventTimes);
      });

      return Boolean(
        allEventTimes.filter(({ endTime, startTime }) => endTime && startTime)
          .length
      );
    }
  );
};

const eventTimesSchema = Yup.array().when(
  [EVENT_FIELDS.RECURRING_EVENTS, EVENT_FIELDS.EVENTS],
  validateEventTimes
);

const getPriceGroupsSchema = (
  isRegistrationPlanned: boolean,
  priceGroupOptions: PriceGroupOption[],
  offersVatPercentage?: string
) => {
  // Only validate price groups if registration is planned AND we have VAT percentage
  return isRegistrationPlanned && offersVatPercentage
    ? Yup.array().of(getPriceGroupSchema(priceGroupOptions))
    : Yup.array();
};

const createPaidOfferSchema = (
  isRegistrationPlanned: boolean,
  eventInfoLanguage: string[],
  priceGroupOptions: PriceGroupOption[],
  offersVatPercentage?: string
) =>
  Yup.object().shape({
    [EVENT_OFFER_FIELDS.OFFER_PRICE]: createMultiLanguageValidation(
      eventInfoLanguage,
      Yup.string()
        .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
        .max(
          EVENT_OFFER_TEXT_FIELD_MAX_LENGTH[EVENT_OFFER_FIELDS.OFFER_PRICE],
          createStringMaxErrorMessage
        )
    ),
    [EVENT_OFFER_FIELDS.OFFER_INFO_URL]: createMultiLanguageValidation(
      eventInfoLanguage,
      Yup.string()
        .test('is-url-valid', VALIDATION_MESSAGE_KEYS.URL, (value) =>
          isValidUrl(value)
        )
        .max(
          EVENT_OFFER_TEXT_FIELD_MAX_LENGTH[EVENT_OFFER_FIELDS.OFFER_INFO_URL],
          createStringMaxErrorMessage
        )
    ),
    ...(featureFlagUtils.isFeatureEnabled('WEB_STORE_INTEGRATION')
      ? {
          [EVENT_OFFER_FIELDS.OFFER_PRICE_GROUPS]: getPriceGroupsSchema(
            isRegistrationPlanned,
            priceGroupOptions,
            offersVatPercentage
          ),
        }
      : /* istanbul ignore next */
        {}),
  });

type ValidateOptionsWithIndex = Yup.ValidateOptions & {
  index: number;
};

const createFreeOfferSchema = (eventInfoLanguage: string[]) =>
  Yup.object().test(async (values, { options }) => {
    const index = (options as ValidateOptionsWithIndex).index;

    if (index === 0) {
      try {
        await Yup.object()
          .shape({
            [EVENT_OFFER_FIELDS.OFFER_INFO_URL]: createMultiLanguageValidation(
              eventInfoLanguage,
              Yup.string()
                .test('is-url-valid', VALIDATION_MESSAGE_KEYS.URL, (value) =>
                  isValidUrl(value)
                )
                .max(
                  EVENT_OFFER_TEXT_FIELD_MAX_LENGTH[
                    EVENT_OFFER_FIELDS.OFFER_INFO_URL
                  ],
                  createStringMaxErrorMessage
                )
            ),
          })
          .validate(values, options);
      } catch (e) {
        return e as Yup.ValidationError;
      }

      return true;
    }

    return true;
  });

const validateOffers = (
  values: any[],
  schema: Yup.ArraySchema<OfferFields[] | undefined, Yup.AnyObject>
) => {
  const [
    hasPrice,
    isRegistrationPlanned,
    eventInfoLanguage,
    priceGroupOptions,
    offersVatPercentage,
  ] = values as [boolean, boolean, string[], PriceGroupOption[], string];

  return hasPrice
    ? schema.of(
        createPaidOfferSchema(
          isRegistrationPlanned,
          eventInfoLanguage,
          priceGroupOptions,
          offersVatPercentage
        )
      )
    : schema.of(createFreeOfferSchema(eventInfoLanguage));
};

export const externalLinksSchema = Yup.array()
  .of(
    Yup.object().shape({
      [EXTERNAL_LINK_FIELDS.LINK]: Yup.string()
        .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
        .test('is-url-valid', VALIDATION_MESSAGE_KEYS.URL, (value) =>
          isValidUrl(value)
        )
        .max(
          EVENT_EXTERNAL_LINK_TEXT_FIELD_MAX_LENGTH[EXTERNAL_LINK_FIELDS.LINK],
          createStringMaxErrorMessage
        ),
      [EXTERNAL_LINK_FIELDS.NAME]: Yup.string().required(
        VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
      ),
    })
  )
  .test(
    'unique',
    VALIDATION_MESSAGE_KEYS.SOME_LINK_DUPLICATE,
    (values, context) => {
      if (!values?.length) {
        return true;
      }

      const duplicates = values
        .map((value, duplicateIndex) => {
          const isDuplicateOf = values.findIndex(
            (item) => item.link === value.link && item.name === value.name
          );

          const isDuplicate = isDuplicateOf !== duplicateIndex;

          return isDuplicate ? { duplicateIndex, isDuplicateOf } : null;
        })
        .filter(Boolean);

      if (!duplicates.length) {
        return true;
      }

      const errors = duplicates
        .map((duplicate) => [
          context.createError({
            path: `${context.path}[${duplicate?.duplicateIndex}].link`,
            message: VALIDATION_MESSAGE_KEYS.SOME_LINK_DUPLICATE,
          }),
          context.createError({
            path: `${context.path}[${duplicate?.isDuplicateOf}].link`,
            message: VALIDATION_MESSAGE_KEYS.SOME_LINK_DUPLICATE,
          }),
        ])
        .flat();

      return context.createError({ message: () => errors });
    }
  );

const validateImageDetails = (
  values: any[],
  schema: Yup.ObjectSchema<Yup.AnyObject>
) => {
  const [images, isImageEditable] = values as [string[], boolean];

  return isImageEditable && images?.length ? imageDetailsSchema : schema;
};

const validateVideoFields = (
  [field1, field2]: string[],
  schema: Yup.StringSchema
) =>
  field1 || field2
    ? schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    : schema;

export const videoSchema = Yup.object().shape(
  {
    [VIDEO_DETAILS_FIELDS.ALT_TEXT]: Yup.string()
      .when(
        [VIDEO_DETAILS_FIELDS.NAME, VIDEO_DETAILS_FIELDS.URL],
        validateVideoFields as () => Yup.StringSchema
      )
      .max(
        EVENT_VIDEO_TEXT_FIELD_MAX_LENGTH[VIDEO_DETAILS_FIELDS.ALT_TEXT],
        createStringMaxErrorMessage
      ),
    [VIDEO_DETAILS_FIELDS.NAME]: Yup.string()
      .when(
        [VIDEO_DETAILS_FIELDS.ALT_TEXT, VIDEO_DETAILS_FIELDS.URL],
        validateVideoFields as () => Yup.StringSchema
      )
      .max(
        EVENT_VIDEO_TEXT_FIELD_MAX_LENGTH[VIDEO_DETAILS_FIELDS.NAME],
        createStringMaxErrorMessage
      ),
    [VIDEO_DETAILS_FIELDS.URL]: Yup.string()
      .test('is-url-valid', VALIDATION_MESSAGE_KEYS.URL, (value) =>
        isValidUrl(value)
      )
      .when(
        [VIDEO_DETAILS_FIELDS.ALT_TEXT, VIDEO_DETAILS_FIELDS.NAME],
        validateVideoFields as () => Yup.StringSchema
      )
      .max(
        EVENT_VIDEO_TEXT_FIELD_MAX_LENGTH[VIDEO_DETAILS_FIELDS.URL],
        createStringMaxErrorMessage
      ),
  },
  [
    [VIDEO_DETAILS_FIELDS.ALT_TEXT, VIDEO_DETAILS_FIELDS.NAME],
    [VIDEO_DETAILS_FIELDS.ALT_TEXT, VIDEO_DETAILS_FIELDS.URL],
    [VIDEO_DETAILS_FIELDS.NAME, VIDEO_DETAILS_FIELDS.URL],
  ]
);

const validateMainCategories = (
  [keywords]: string[][],
  schema: Yup.ArraySchema<string[] | undefined, Yup.AnyObject>
) =>
  schema.test(
    'atLeastOneMainCategoryIsSelected',
    VALIDATION_MESSAGE_KEYS.MAIN_CATEGORY_REQUIRED,
    (mainCategories) =>
      getValue(
        mainCategories?.some(
          (category) => category && keywords.includes(category)
        ),
        false
      )
  );

const enrolmentSchemaFields = {
  [EVENT_FIELDS.AUDIENCE_MIN_AGE]: Yup.number()
    .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
    .min(0, createNumberMinErrorMessage)
    .nullable()
    .transform(transformNumber),
  [EVENT_FIELDS.AUDIENCE_MAX_AGE]: Yup.number()
    .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
    .when([EVENT_FIELDS.AUDIENCE_MIN_AGE], ([audienceMinAge], schema) =>
      schema.min(audienceMinAge || 0, createNumberMinErrorMessage)
    )
    .nullable()
    .transform(transformNumber),
  [EVENT_FIELDS.ENROLMENT_START_TIME_DATE]: Yup.date()
    .nullable()
    .typeError(VALIDATION_MESSAGE_KEYS.DATE)
    .when([EVENT_FIELDS.ENROLMENT_END_TIME_TIME], ([endTime], schema) =>
      endTime
        ? schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
        : schema
    ),
  [EVENT_FIELDS.ENROLMENT_START_TIME_TIME]: Yup.string()
    .when([EVENT_FIELDS.ENROLMENT_START_TIME_DATE], ([startDate], schema) =>
      startDate
        ? schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
        : schema
    )
    .test('isValidTime', VALIDATION_MESSAGE_KEYS.TIME, (value) =>
      isValidTime(value)
    ),
  [EVENT_FIELDS.ENROLMENT_END_TIME_DATE]: Yup.date()
    .nullable()
    .typeError(VALIDATION_MESSAGE_KEYS.DATE)
    .when([EVENT_FIELDS.ENROLMENT_END_TIME_TIME], ([endTime], schema) =>
      endTime
        ? schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
        : schema
    )
    .when(
      [
        EVENT_FIELDS.ENROLMENT_START_TIME_DATE,
        EVENT_FIELDS.ENROLMENT_START_TIME_TIME,
        EVENT_FIELDS.ENROLMENT_END_TIME_TIME,
      ],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      isAfterStartDateAndTime as any
    ),
  [EVENT_FIELDS.ENROLMENT_END_TIME_TIME]: Yup.string()
    .when([EVENT_FIELDS.ENROLMENT_END_TIME_DATE], ([endDate], schema) =>
      endDate
        ? schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
        : schema
    )
    .test('isValidTime', VALIDATION_MESSAGE_KEYS.TIME, (value) =>
      isValidTime(value)
    ),
  [EVENT_FIELDS.MINIMUM_ATTENDEE_CAPACITY]: Yup.number()
    .nullable()
    .transform(transformNumber)
    .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
    .min(0, createNumberMinErrorMessage),
  [EVENT_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: Yup.number()
    .nullable()
    .transform(transformNumber)
    .required(VALIDATION_MESSAGE_KEYS.NUMBER_REQUIRED)
    .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
    .when(
      [EVENT_FIELDS.MINIMUM_ATTENDEE_CAPACITY],
      ([minimumAttendeeCapacity], schema) => {
        return schema.min(
          minimumAttendeeCapacity || 0,
          createNumberMinErrorMessage
        );
      }
    ),
};

const crossInstitutionalStudiesSchema = {
  [EVENT_FIELDS.EDUCATION_LEVELS_KEYWORDS]: Yup.array().when(
    [EVENT_FIELDS.CROSS_INSTITUTIONAL_STUDIES],
    {
      is: (isCrossInstitutionalStudies: boolean) => isCrossInstitutionalStudies,
      then: (schema) =>
        schema
          .required(VALIDATION_MESSAGE_KEYS.ARRAY_REQUIRED)
          .min(1, VALIDATION_MESSAGE_KEYS.KEYWORD_REQUIRED),
    }
  ),
  [EVENT_FIELDS.EDUCATION_MODELS_KEYWORDS]: Yup.array().when(
    [EVENT_FIELDS.CROSS_INSTITUTIONAL_STUDIES],
    {
      is: (isCrossInstitutionalStudies: boolean) => isCrossInstitutionalStudies,
      then: (schema) =>
        schema
          .required(VALIDATION_MESSAGE_KEYS.ARRAY_REQUIRED)
          .min(1, VALIDATION_MESSAGE_KEYS.KEYWORD_REQUIRED),
    }
  ),
};

const CYCLIC_DEPENDENCIES: [string, string][] = [
  [
    EVENT_FIELDS.ENROLMENT_START_TIME_DATE,
    EVENT_FIELDS.ENROLMENT_START_TIME_TIME,
  ],
  [
    EVENT_FIELDS.ENROLMENT_START_TIME_DATE,
    EVENT_FIELDS.ENROLMENT_END_TIME_DATE,
  ],
  [
    EVENT_FIELDS.ENROLMENT_START_TIME_DATE,
    EVENT_FIELDS.ENROLMENT_END_TIME_TIME,
  ],
  [
    EVENT_FIELDS.ENROLMENT_START_TIME_TIME,
    EVENT_FIELDS.ENROLMENT_END_TIME_DATE,
  ],
  [
    EVENT_FIELDS.ENROLMENT_START_TIME_TIME,
    EVENT_FIELDS.ENROLMENT_END_TIME_TIME,
  ],
  [EVENT_FIELDS.ENROLMENT_END_TIME_DATE, EVENT_FIELDS.ENROLMENT_END_TIME_TIME],
];

const EXTERNAL_USER_CYCLIC_DEPENDENCIES: [string, string][] = [
  ...CYCLIC_DEPENDENCIES,
  [EVENT_FIELDS.USER_EMAIL, EVENT_FIELDS.USER_PHONE_NUMBER],
];

export const publicEventSchema = Yup.object().shape(
  {
    [EVENT_FIELDS.TYPE]: Yup.string().required(
      VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
    ),
    [EVENT_FIELDS.SUPER_EVENT]: Yup.string()
      .nullable()
      .when([EVENT_FIELDS.HAS_UMBRELLA], {
        is: (hasUmbrella: boolean) => hasUmbrella,
        then: (schema) =>
          schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
      }),
    [EVENT_FIELDS.PUBLISHER]: Yup.string()
      .nullable()
      .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
    [EVENT_FIELDS.PROVIDER]: createMultiLanguageValidationByInfoLanguages(
      Yup.string().max(
        EVENT_TEXT_FIELD_MAX_LENGTH[EVENT_FIELDS.PROVIDER],
        createStringMaxErrorMessage
      )
    ),
    [EVENT_FIELDS.NAME]: createMultiLanguageValidationByInfoLanguages(
      Yup.string()
        .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
        .max(
          EVENT_TEXT_FIELD_MAX_LENGTH[EVENT_FIELDS.NAME],
          createStringMaxErrorMessage
        )
    ),
    [EVENT_FIELDS.SHORT_DESCRIPTION]:
      createMultiLanguageValidationByInfoLanguages(
        Yup.string()
          .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
          .max(
            EVENT_TEXT_FIELD_MAX_LENGTH[EVENT_FIELDS.SHORT_DESCRIPTION],
            createStringMaxErrorMessage
          )
      ),
    [EVENT_FIELDS.DESCRIPTION]: createMultiLanguageValidationByInfoLanguages(
      Yup.string()
        .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
        .max(
          EVENT_TEXT_FIELD_MAX_LENGTH[EVENT_FIELDS.DESCRIPTION],
          createStringMaxErrorMessage
        )
    ),
    [EVENT_FIELDS.EVENT_TIMES]: eventTimesSchema,
    [EVENT_FIELDS.LOCATION]: Yup.string()
      .nullable()
      .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
    [EVENT_FIELDS.LOCATION_EXTRA_INFO]:
      createMultiLanguageValidationByInfoLanguages(
        Yup.string().max(
          EVENT_TEXT_FIELD_MAX_LENGTH[EVENT_FIELDS.LOCATION_EXTRA_INFO],
          createStringMaxErrorMessage
        )
      ),
    [EVENT_FIELDS.OFFERS]: Yup.array()
      .min(1, VALIDATION_MESSAGE_KEYS.OFFERS_REQUIRED)
      .when(
        [
          EVENT_FIELDS.HAS_PRICE,
          EVENT_FIELDS.IS_REGISTRATION_PLANNED,
          EVENT_FIELDS.EVENT_INFO_LANGUAGES,
          EVENT_FIELDS.PRICE_GROUP_OPTIONS,
          EVENT_FIELDS.OFFERS_VAT_PERCENTAGE,
        ],
        validateOffers
      ),
    [EVENT_FIELDS.OFFERS_VAT_PERCENTAGE]: Yup.string().when(
      [EVENT_FIELDS.HAS_PRICE, EVENT_FIELDS.IS_REGISTRATION_PLANNED],
      ([hasPrice, isRegistrationPlanned], schema) =>
        hasPrice && isRegistrationPlanned
          ? schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
          : schema
    ),
    [EVENT_FIELDS.INFO_URL]: createMultiLanguageValidationByInfoLanguages(
      Yup.string()
        .test('is-url-valid', VALIDATION_MESSAGE_KEYS.URL, (value) =>
          isValidUrl(value)
        )
        .max(
          EVENT_TEXT_FIELD_MAX_LENGTH[EVENT_FIELDS.INFO_URL],
          createStringMaxErrorMessage
        )
    ),
    [EVENT_FIELDS.EXTERNAL_LINKS]: externalLinksSchema,
    [EVENT_FIELDS.IMAGE_DETAILS]: Yup.object().when(
      [EVENT_FIELDS.IMAGES, EVENT_FIELDS.IS_IMAGE_EDITABLE],
      validateImageDetails
    ),
    [EVENT_FIELDS.VIDEOS]: Yup.array().of(videoSchema),
    [EVENT_FIELDS.MAIN_CATEGORIES]: Yup.array().when(
      [EVENT_FIELDS.KEYWORDS],
      validateMainCategories
    ),
    [EVENT_FIELDS.KEYWORDS]: Yup.array()
      .required(VALIDATION_MESSAGE_KEYS.ARRAY_REQUIRED)
      .min(1, VALIDATION_MESSAGE_KEYS.KEYWORD_REQUIRED),
    //Validate education related fields
    ...crossInstitutionalStudiesSchema,
    // Validate enrolment related fields
    ...enrolmentSchemaFields,
    [EVENT_FIELDS.IS_VERIFIED]: Yup.bool().oneOf(
      [true],
      VALIDATION_MESSAGE_KEYS.EVENT_INFO_VERIFIED
    ),
  },
  CYCLIC_DEPENDENCIES
);

export const draftEventSchema = Yup.object().shape(
  {
    [EVENT_FIELDS.PUBLISHER]: Yup.string()
      .nullable()
      .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
    [EVENT_FIELDS.PROVIDER]: createMultiLanguageValidationByInfoLanguages(
      Yup.string().max(
        EVENT_TEXT_FIELD_MAX_LENGTH[EVENT_FIELDS.PROVIDER],
        createStringMaxErrorMessage
      )
    ),
    [EVENT_FIELDS.NAME]: createMultiLanguageValidationByInfoLanguages(
      Yup.string()
        .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
        .max(
          EVENT_TEXT_FIELD_MAX_LENGTH[EVENT_FIELDS.NAME],
          createStringMaxErrorMessage
        )
    ),
    [EVENT_FIELDS.SHORT_DESCRIPTION]:
      createMultiLanguageValidationByInfoLanguages(
        Yup.string().max(
          EVENT_TEXT_FIELD_MAX_LENGTH[EVENT_FIELDS.SHORT_DESCRIPTION],
          createStringMaxErrorMessage
        )
      ),
    [EVENT_FIELDS.DESCRIPTION]: createMultiLanguageValidationByInfoLanguages(
      Yup.string().max(
        EVENT_TEXT_FIELD_MAX_LENGTH[EVENT_FIELDS.DESCRIPTION],
        createStringMaxErrorMessage
      )
    ),
    [EVENT_FIELDS.EVENT_TIMES]: eventTimesSchema,
    [EVENT_FIELDS.LOCATION_EXTRA_INFO]:
      createMultiLanguageValidationByInfoLanguages(
        Yup.string().max(
          EVENT_TEXT_FIELD_MAX_LENGTH[EVENT_FIELDS.LOCATION_EXTRA_INFO],
          createStringMaxErrorMessage
        )
      ),
    [EVENT_FIELDS.OFFERS]: Yup.array()
      .min(1, VALIDATION_MESSAGE_KEYS.OFFERS_REQUIRED)
      .when(
        [
          EVENT_FIELDS.HAS_PRICE,
          EVENT_FIELDS.IS_REGISTRATION_PLANNED,
          EVENT_FIELDS.EVENT_INFO_LANGUAGES,
          EVENT_FIELDS.PRICE_GROUP_OPTIONS,
          EVENT_FIELDS.OFFERS_VAT_PERCENTAGE,
        ],
        validateOffers
      ),
    [EVENT_FIELDS.INFO_URL]: createMultiLanguageValidationByInfoLanguages(
      Yup.string()
        .test('is-url-valid', VALIDATION_MESSAGE_KEYS.URL, (value) =>
          isValidUrl(value)
        )
        .max(
          EVENT_TEXT_FIELD_MAX_LENGTH[EVENT_FIELDS.INFO_URL],
          createStringMaxErrorMessage
        )
    ),
    [EVENT_FIELDS.EXTERNAL_LINKS]: externalLinksSchema,
    [EVENT_FIELDS.IMAGE_DETAILS]: Yup.object().when(
      [EVENT_FIELDS.IMAGES, EVENT_FIELDS.IS_IMAGE_EDITABLE],
      validateImageDetails
    ),
    [EVENT_FIELDS.VIDEOS]: Yup.array().of(videoSchema),
    //Validate education related fields
    ...crossInstitutionalStudiesSchema,
    // Validate enrolment related fields
    ...enrolmentSchemaFields,
    [EVENT_FIELDS.IS_VERIFIED]: Yup.bool().oneOf(
      [true],
      VALIDATION_MESSAGE_KEYS.EVENT_INFO_VERIFIED
    ),
  },
  CYCLIC_DEPENDENCIES
);

export const externalUserEventSchema = Yup.object().shape(
  {
    ...publicEventSchema.fields,
    [EVENT_FIELDS.PROVIDER]: createMultiLanguageValidationByInfoLanguages(
      Yup.string()
        .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
        .max(
          EVENT_TEXT_FIELD_MAX_LENGTH[EVENT_FIELDS.PROVIDER],
          createStringMaxErrorMessage
        )
    ),
    [EVENT_FIELDS.PUBLISHER]: Yup.string().nullable().optional(),
    [EVENT_FIELDS.SHORT_DESCRIPTION]:
      createMultiLanguageValidationByInfoLanguages(
        Yup.string()
          .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
          .max(
            EVENT_TEXT_FIELD_MAX_LENGTH[EVENT_FIELDS.SHORT_DESCRIPTION],
            createStringMaxErrorMessage
          )
      ),
    [EVENT_FIELDS.ENVIRONMENTAL_CERTIFICATE]: Yup.string().when(
      [EVENT_FIELDS.HAS_ENVIRONMENTAL_CERTIFICATE],
      {
        is: (hasCertificate: boolean) => hasCertificate,
        then: (schema) =>
          schema
            .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
            .max(
              EVENT_TEXT_FIELD_MAX_LENGTH[
                EVENT_FIELDS.ENVIRONMENTAL_CERTIFICATE
              ],
              createStringMaxErrorMessage
            ),
      }
    ),
    [EVENT_FIELDS.ENVIRONMENT]: Yup.string().required(
      VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
    ),
    [EVENT_FIELDS.USER_NAME]: Yup.string()
      .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
      .max(
        EVENT_TEXT_FIELD_MAX_LENGTH[EVENT_FIELDS.USER_NAME],
        createStringMaxErrorMessage
      ),
    [EVENT_FIELDS.USER_EMAIL]: Yup.string()
      .when([EVENT_FIELDS.USER_PHONE_NUMBER], {
        is: (phoneNumber: string) => !phoneNumber || phoneNumber.length === 0,
        then: (schema) =>
          schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
      })
      .email(VALIDATION_MESSAGE_KEYS.EMAIL)
      .max(
        EVENT_TEXT_FIELD_MAX_LENGTH[EVENT_FIELDS.USER_EMAIL],
        createStringMaxErrorMessage
      ),
    [EVENT_FIELDS.USER_PHONE_NUMBER]: Yup.string()
      .when([EVENT_FIELDS.USER_EMAIL], {
        is: (email: string) => !email || email.length === 0,
        then: (schema) =>
          schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
      })
      .test(
        'is-valid-phone-number',
        VALIDATION_MESSAGE_KEYS.PHONE,
        (value) => !value || isValidPhoneNumber(value)
      )
      .max(
        EVENT_TEXT_FIELD_MAX_LENGTH[EVENT_FIELDS.USER_PHONE_NUMBER],
        createStringMaxErrorMessage
      ),
    [EVENT_FIELDS.USER_CONSENT]: Yup.bool().oneOf(
      [true],
      VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
    ),
  },
  EXTERNAL_USER_CYCLIC_DEPENDENCIES
);

export const eventTimeSchema = Yup.object().shape({
  [EVENT_TIME_FIELDS.START_DATE]: Yup.date()
    .nullable()
    .required(VALIDATION_MESSAGE_KEYS.DATE_REQUIRED)
    .typeError(VALIDATION_MESSAGE_KEYS.DATE),
  [EVENT_TIME_FIELDS.START_TIME]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.DATE_REQUIRED)
    .test('isValidTime', VALIDATION_MESSAGE_KEYS.TIME, (value) =>
      isValidTime(value)
    ),
  [EVENT_TIME_FIELDS.END_DATE]: Yup.date()
    .nullable()
    .required(VALIDATION_MESSAGE_KEYS.DATE_REQUIRED)
    .typeError(VALIDATION_MESSAGE_KEYS.DATE)
    .when([EVENT_TIME_FIELDS.END_TIME], isFutureDateAndTime)
    .when(
      [
        EVENT_TIME_FIELDS.START_DATE,
        EVENT_TIME_FIELDS.START_TIME,
        EVENT_TIME_FIELDS.END_TIME,
      ],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      isAfterStartDateAndTime
    ),
  [EVENT_TIME_FIELDS.END_TIME]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.DATE_REQUIRED)
    .test('isValidTime', VALIDATION_MESSAGE_KEYS.TIME, (value) =>
      isValidTime(value)
    ),
});

export const addEventTimeSchema = Yup.object().shape({
  [ADD_EVENT_TIME_FORM_NAME]: eventTimeSchema,
});

export const editEventTimeSchema = Yup.object().shape({
  [EDIT_EVENT_TIME_FORM_NAME]: eventTimeSchema,
});

export const recurringEventSchema = Yup.object().shape({
  [RECURRING_EVENT_FIELDS.REPEAT_INTERVAL]: Yup.number()
    .nullable()
    .min(1, createNumberMinErrorMessage)
    .max(4, createNumberMaxErrorMessage)
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
  [RECURRING_EVENT_FIELDS.REPEAT_DAYS]: Yup.array()
    .required(VALIDATION_MESSAGE_KEYS.ARRAY_REQUIRED)
    .min(1, createArrayMinErrorMessage),
  [RECURRING_EVENT_FIELDS.START_DATE]: Yup.date()
    .nullable()
    .typeError(VALIDATION_MESSAGE_KEYS.DATE)
    .required(VALIDATION_MESSAGE_KEYS.DATE_REQUIRED)
    .test(
      'isInTheFuture',
      VALIDATION_MESSAGE_KEYS.DATE_FUTURE,
      (startDate) => !startDate || isFuture(startDate)
    ),
  [RECURRING_EVENT_FIELDS.END_DATE]: Yup.date()
    .nullable()
    .typeError(VALIDATION_MESSAGE_KEYS.DATE)
    .required(VALIDATION_MESSAGE_KEYS.DATE_REQUIRED)
    // test that startsTime is before endsTime
    .when([RECURRING_EVENT_FIELDS.START_DATE], isAfterDate),
  [RECURRING_EVENT_FIELDS.START_TIME]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.TIME_REQUIRED)
    .test('isValidTime', VALIDATION_MESSAGE_KEYS.TIME, (value) =>
      isValidTime(value)
    ),
  [RECURRING_EVENT_FIELDS.END_TIME]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.TIME_REQUIRED)
    .test('isValidTime', VALIDATION_MESSAGE_KEYS.TIME, (value) =>
      isValidTime(value)
    )
    // test that endsAt is after startsAt time
    .when([RECURRING_EVENT_FIELDS.START_TIME], isAfterTime),
});
