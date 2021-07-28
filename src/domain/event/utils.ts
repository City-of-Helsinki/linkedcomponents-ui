import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import addDays from 'date-fns/addDays';
import addWeeks from 'date-fns/addWeeks';
import endOfDay from 'date-fns/endOfDay';
import isBefore from 'date-fns/isBefore';
import isFuture from 'date-fns/isFuture';
import isPast from 'date-fns/isPast';
import isWithinInterval from 'date-fns/isWithinInterval';
import maxDate from 'date-fns/max';
import minDate from 'date-fns/min';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import startOfDay from 'date-fns/startOfDay';
import subDays from 'date-fns/subDays';
import { FormikErrors, FormikState, FormikTouched } from 'formik';
import { TFunction } from 'i18next';
import capitalize from 'lodash/capitalize';
import forEach from 'lodash/forEach';
import isNumber from 'lodash/isNumber';
import keys from 'lodash/keys';
import reduce from 'lodash/reduce';
import set from 'lodash/set';
import sortBy from 'lodash/sortBy';
import { scroller } from 'react-scroll';
import * as Yup from 'yup';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/MenuItem';
import { getTimeObject } from '../../common/components/timepicker/utils';
import {
  CHARACTER_LIMITS,
  FORM_NAMES,
  ROUTES,
  WEEK_DAY,
} from '../../constants';
import {
  CreateEventMutationInput,
  EventDocument,
  EventFieldsFragment,
  EventQuery,
  EventQueryVariables,
  EventsDocument,
  EventsQuery,
  EventStatus,
  EventTypeId,
  Language as LELanguage,
  LocalisedFieldsFragment,
  LocalisedObject,
  Maybe,
  OrganizationFieldsFragment,
  PublicationStatus,
  SuperEventType,
  UserFieldsFragment,
} from '../../generated/graphql';
import { Language, PathBuilderProps } from '../../types';
import getLocalisedString from '../../utils/getLocalisedString';
import getNextPage from '../../utils/getNextPage';
import getPathBuilder from '../../utils/getPathBuilder';
import queryBuilder from '../../utils/queryBuilder';
import sanitizeHtml from '../../utils/sanitizeHtml';
import {
  createMaxErrorMessage,
  createMinErrorMessage,
  isAfterStartDate,
  isAfterStartTime,
  isMinStartDate,
  isValidTime,
  transformNumber,
} from '../../utils/validationUtils';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import {
  isAdminUserInOrganization,
  isReqularUserInOrganization,
} from '../organization/utils';
import {
  ADD_EVENT_TIME_FORM_NAME,
  ADD_IMAGE_FIELDS,
  AUHENTICATION_NOT_NEEDED,
  DESCRIPTION_SECTION_FIELDS,
  EDIT_EVENT_TIME_FORM_NAME,
  EMPTY_MULTI_LANGUAGE_OBJECT,
  EVENT_CREATE_ACTIONS,
  EVENT_EDIT_ACTIONS,
  EVENT_EDIT_ICONS,
  EVENT_EDIT_LABEL_KEYS,
  EVENT_FIELD_ARRAYS,
  EVENT_FIELDS,
  EVENT_INCLUDES,
  EVENT_INFO_LANGUAGES,
  EVENT_INITIAL_VALUES,
  EVENT_SELECT_FIELDS,
  EVENT_TIME_FIELDS,
  EVENT_TYPE,
  EXTERNAL_LINK_FIELDS,
  IMAGE_ALT_TEXT_MIN_LENGTH,
  IMAGE_DETAILS_FIELDS,
  NOT_ALLOWED_WHEN_CANCELLED,
  NOT_ALLOWED_WHEN_DELETED,
  NOT_ALLOWED_WHEN_IN_PAST,
  ORDERED_EVENT_INFO_LANGUAGES,
  RECURRING_EVENT_FIELDS,
  SUB_EVENTS_VARIABLES,
  TEXT_EDITOR_ALLOWED_TAGS,
  TEXT_EDITOR_FIELDS,
  VIDEO_DETAILS_FIELDS,
} from './constants';
import { sortEventTimes } from './formSections/timeSection/utils';
import {
  EventFields,
  EventFormFields,
  EventTime,
  ImageDetails,
  MultiLanguageObject,
  Offer,
  RecurringEventSettings,
  VideoDetails,
} from './types';

const createMultiLanguageValidation = (
  languages: string[],
  rule: Yup.StringSchema<string | null | undefined>
) => {
  return Yup.object().shape(
    reduce(languages, (acc, lang) => ({ ...acc, [lang]: rule }), {})
  );
};

const createMultiLanguageValidationByInfoLanguages = (
  rule: Yup.StringSchema<string | null | undefined>
) => {
  return Yup.object().when(
    [EVENT_FIELDS.EVENT_INFO_LANGUAGES],
    (languages: string[]) => createMultiLanguageValidation(languages, rule)
  );
};

export const eventTimeSchema = Yup.object().shape({
  [EVENT_TIME_FIELDS.START_TIME]: Yup.date()
    .nullable()
    .required(VALIDATION_MESSAGE_KEYS.DATE_REQUIRED)
    .typeError(VALIDATION_MESSAGE_KEYS.DATE),
  [EVENT_TIME_FIELDS.END_TIME]: Yup.date()
    .nullable()
    .required(VALIDATION_MESSAGE_KEYS.DATE_REQUIRED)
    .typeError(VALIDATION_MESSAGE_KEYS.DATE)
    .test(
      'isInTheFuture',
      VALIDATION_MESSAGE_KEYS.DATE_FUTURE,
      (endTime) => !endTime || isFuture(endTime)
    )
    // test that end time is after start time
    .when([EVENT_TIME_FIELDS.START_TIME], isMinStartDate),
});

export const addEventTimeSchema = Yup.object().shape({
  [ADD_EVENT_TIME_FORM_NAME]: eventTimeSchema,
});

export const editEventTimeSchema = Yup.object().shape({
  [EDIT_EVENT_TIME_FORM_NAME]: eventTimeSchema,
});

const validateEventTimes = (
  recurringEvents: RecurringEventSettings[] | null,
  events: EventTime[] | null,
  schema: Yup.SchemaOf<EventTime[]>
) =>
  schema.test(
    'hasAtLeaseOneEventTime',
    VALIDATION_MESSAGE_KEYS.EVENT_TIMES_REQUIRED,
    (eventTimes) => {
      const allEventTimes = [...(eventTimes ?? []), ...(events ?? [])];
      recurringEvents?.forEach((recurringEvent) => {
        allEventTimes.push(...recurringEvent.eventTimes);
      });
      return Boolean(
        allEventTimes.filter(({ endTime, startTime }) => endTime && startTime)
          .length
      );
    }
  );

const eventTimesSchema = Yup.array().when(
  [EVENT_FIELDS.RECURRING_EVENTS, EVENT_FIELDS.EVENTS],
  validateEventTimes as () => Yup.SchemaOf<EventTime[]>
);

const validateOffers = (
  hasPrice: boolean,
  eventInfoLanguage: string[],
  schema: Yup.SchemaOf<Offer[]>
) =>
  hasPrice
    ? Yup.array()
        .min(1, VALIDATION_MESSAGE_KEYS.OFFERS_REQUIRED)
        .of(
          Yup.object().shape({
            [EVENT_FIELDS.OFFER_PRICE]: createMultiLanguageValidation(
              eventInfoLanguage,
              Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
            ),
            [EVENT_FIELDS.OFFER_INFO_URL]: createMultiLanguageValidation(
              eventInfoLanguage,
              Yup.string().url(VALIDATION_MESSAGE_KEYS.URL)
            ),
          })
        )
    : schema;

const externalLinksSchema = Yup.object().shape({
  [EXTERNAL_LINK_FIELDS.LINK]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .url(VALIDATION_MESSAGE_KEYS.URL),
  [IMAGE_DETAILS_FIELDS.NAME]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
});

const imageDetailsSchema = Yup.object().shape({
  [IMAGE_DETAILS_FIELDS.ALT_TEXT]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .min(IMAGE_ALT_TEXT_MIN_LENGTH, (param) =>
      createMinErrorMessage(param, VALIDATION_MESSAGE_KEYS.STRING_MIN)
    )
    .max(CHARACTER_LIMITS.SHORT_STRING, (param) =>
      createMaxErrorMessage(param, VALIDATION_MESSAGE_KEYS.STRING_MAX)
    ),
  [IMAGE_DETAILS_FIELDS.NAME]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .max(CHARACTER_LIMITS.MEDIUM_STRING, (param) =>
      createMaxErrorMessage(param, VALIDATION_MESSAGE_KEYS.STRING_MAX)
    ),
});

const validateImageDetails = (
  images: string[],
  isImageEditable: boolean,
  schema: Yup.SchemaOf<ImageDetails>
) => (isImageEditable && images && images.length ? imageDetailsSchema : schema);

const validateVideoFields = (
  field1: string,
  field2: string,
  schema: Yup.StringSchema
) =>
  field1 || field2
    ? schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    : schema;

const videoSchema = Yup.object().shape(
  {
    [VIDEO_DETAILS_FIELDS.ALT_TEXT]: Yup.string().when(
      [VIDEO_DETAILS_FIELDS.NAME, VIDEO_DETAILS_FIELDS.URL],
      validateVideoFields as () => Yup.StringSchema
    ),
    [VIDEO_DETAILS_FIELDS.NAME]: Yup.string().when(
      [VIDEO_DETAILS_FIELDS.ALT_TEXT, VIDEO_DETAILS_FIELDS.URL],
      validateVideoFields as () => Yup.StringSchema
    ),
    [VIDEO_DETAILS_FIELDS.URL]: Yup.string()
      .url(VALIDATION_MESSAGE_KEYS.URL)
      .when(
        [VIDEO_DETAILS_FIELDS.ALT_TEXT, VIDEO_DETAILS_FIELDS.NAME],
        validateVideoFields as () => Yup.StringSchema
      ),
  },
  [
    [VIDEO_DETAILS_FIELDS.ALT_TEXT, VIDEO_DETAILS_FIELDS.NAME],
    [VIDEO_DETAILS_FIELDS.ALT_TEXT, VIDEO_DETAILS_FIELDS.URL],
    [VIDEO_DETAILS_FIELDS.NAME, VIDEO_DETAILS_FIELDS.URL],
  ]
);

const validateMainCategories = (
  keywords: string[],
  schema: Yup.SchemaOf<string[]>
) =>
  schema.test(
    'atLeastOneMainCategoryIsSelected',
    VALIDATION_MESSAGE_KEYS.MAIN_CATEGORY_REQUIRED,
    (mainCategories) =>
      mainCategories?.some(
        (category) => category && keywords.includes(category)
      ) ?? false
  );

const enrolmentSchemaFields = {
  [EVENT_FIELDS.AUDIENCE_MIN_AGE]: Yup.number()
    .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
    .min(0, (param) =>
      createMinErrorMessage(param, VALIDATION_MESSAGE_KEYS.NUMBER_MIN)
    )
    .nullable()
    .transform(transformNumber),
  [EVENT_FIELDS.AUDIENCE_MAX_AGE]: Yup.number()
    .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
    .when(
      [EVENT_FIELDS.AUDIENCE_MIN_AGE],
      (audienceMinAge: number, schema: Yup.NumberSchema) =>
        schema.min(audienceMinAge || 0, (param) =>
          createMinErrorMessage(param, VALIDATION_MESSAGE_KEYS.NUMBER_MIN)
        )
    )
    .nullable()
    .transform(transformNumber),
  [EVENT_FIELDS.ENROLMENT_START_TIME]: Yup.date()
    .nullable()
    .typeError(VALIDATION_MESSAGE_KEYS.DATE),
  [EVENT_FIELDS.ENROLMENT_END_TIME]: Yup.date()
    .nullable()
    .typeError(VALIDATION_MESSAGE_KEYS.DATE)
    // test that startsTime is before endsTime
    .when([EVENT_FIELDS.ENROLMENT_START_TIME], isMinStartDate),
  [EVENT_FIELDS.MINIMUM_ATTENDEE_CAPACITY]: Yup.number()
    .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
    .min(0, (param) =>
      createMinErrorMessage(param, VALIDATION_MESSAGE_KEYS.NUMBER_MIN)
    )
    .nullable()
    .transform(transformNumber),
  [EVENT_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: Yup.number().when(
    [EVENT_FIELDS.MINIMUM_ATTENDEE_CAPACITY],
    (minimumAttendeeCapacity: number) => {
      return Yup.number()
        .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
        .min(minimumAttendeeCapacity || 0, (param) =>
          createMinErrorMessage(param, VALIDATION_MESSAGE_KEYS.NUMBER_MIN)
        )
        .nullable()
        .transform(transformNumber);
    }
  ),
};

export const publicEventSchema = Yup.object().shape({
  [EVENT_FIELDS.TYPE]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
  [EVENT_FIELDS.SUPER_EVENT]: Yup.string()
    .nullable()
    .when([EVENT_FIELDS.HAS_UMBRELLA], {
      is: (value: string) => value,
      then: (schema) =>
        schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
    }),
  [EVENT_FIELDS.PUBLISHER]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
  [EVENT_FIELDS.NAME]: createMultiLanguageValidationByInfoLanguages(
    Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
  ),
  [EVENT_FIELDS.SHORT_DESCRIPTION]:
    createMultiLanguageValidationByInfoLanguages(
      Yup.string()
        .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
        .max(CHARACTER_LIMITS.SHORT_STRING, (param) =>
          createMaxErrorMessage(param, VALIDATION_MESSAGE_KEYS.STRING_MAX)
        )
    ),
  [EVENT_FIELDS.DESCRIPTION]: createMultiLanguageValidationByInfoLanguages(
    Yup.string()
      .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
      .max(CHARACTER_LIMITS.LONG_STRING, (param) =>
        createMaxErrorMessage(param, VALIDATION_MESSAGE_KEYS.STRING_MAX)
      )
  ),
  [EVENT_FIELDS.EVENT_TIMES]: eventTimesSchema,
  [EVENT_FIELDS.LOCATION]: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
  [EVENT_FIELDS.LOCATION_EXTRA_INFO]:
    createMultiLanguageValidationByInfoLanguages(
      Yup.string().max(CHARACTER_LIMITS.SHORT_STRING, (param) =>
        createMaxErrorMessage(param, VALIDATION_MESSAGE_KEYS.STRING_MAX)
      )
    ),
  [EVENT_FIELDS.OFFERS]: Yup.array().when(
    [EVENT_FIELDS.HAS_PRICE, EVENT_FIELDS.EVENT_INFO_LANGUAGES],
    validateOffers as () => Yup.SchemaOf<Offer[]>
  ),
  [EVENT_FIELDS.INFO_URL]: createMultiLanguageValidationByInfoLanguages(
    Yup.string().url(VALIDATION_MESSAGE_KEYS.URL)
  ),
  [EVENT_FIELDS.EXTERNAL_LINKS]: Yup.array().of(externalLinksSchema),
  [EVENT_FIELDS.IMAGE_DETAILS]: Yup.object().when(
    [EVENT_FIELDS.IMAGES, EVENT_FIELDS.IS_IMAGE_EDITABLE],
    validateImageDetails as () => Yup.SchemaOf<ImageDetails>
  ),
  [EVENT_FIELDS.VIDEOS]: Yup.array().of(videoSchema),
  [EVENT_FIELDS.MAIN_CATEGORIES]: Yup.array().when(
    [EVENT_FIELDS.KEYWORDS],
    validateMainCategories
  ),
  [EVENT_FIELDS.KEYWORDS]: Yup.array()
    .required(VALIDATION_MESSAGE_KEYS.ARRAY_REQUIRED)
    .min(1, VALIDATION_MESSAGE_KEYS.KEYWORD_REQUIRED),
  // Validate enrolment related fields
  ...enrolmentSchemaFields,
  [EVENT_FIELDS.IS_VERIFIED]: Yup.bool().oneOf(
    [true],
    VALIDATION_MESSAGE_KEYS.EVENT_INFO_VERIFIED
  ),
});

export const draftEventSchema = Yup.object().shape({
  [EVENT_FIELDS.PUBLISHER]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
  [EVENT_FIELDS.NAME]: createMultiLanguageValidationByInfoLanguages(
    Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
  ),
  [EVENT_FIELDS.SHORT_DESCRIPTION]:
    createMultiLanguageValidationByInfoLanguages(
      Yup.string().max(CHARACTER_LIMITS.SHORT_STRING)
    ),
  [EVENT_FIELDS.DESCRIPTION]: createMultiLanguageValidationByInfoLanguages(
    Yup.string().max(CHARACTER_LIMITS.LONG_STRING)
  ),
  [EVENT_FIELDS.LOCATION_EXTRA_INFO]:
    createMultiLanguageValidationByInfoLanguages(
      Yup.string().max(CHARACTER_LIMITS.SHORT_STRING)
    ),
  [EVENT_FIELDS.EVENT_TIMES]: eventTimesSchema,
  [EVENT_FIELDS.INFO_URL]: createMultiLanguageValidationByInfoLanguages(
    Yup.string().url(VALIDATION_MESSAGE_KEYS.URL)
  ),
  [EVENT_FIELDS.EXTERNAL_LINKS]: Yup.array().of(externalLinksSchema),
  [EVENT_FIELDS.IMAGE_DETAILS]: Yup.object().when(
    [EVENT_FIELDS.IMAGES, EVENT_FIELDS.IS_IMAGE_EDITABLE],
    validateImageDetails as () => Yup.SchemaOf<ImageDetails>
  ),
  [EVENT_FIELDS.VIDEOS]: Yup.array().of(videoSchema),
  // Validate enrolment related fields
  ...enrolmentSchemaFields,
  [EVENT_FIELDS.IS_VERIFIED]: Yup.bool().oneOf(
    [true],
    VALIDATION_MESSAGE_KEYS.EVENT_INFO_VERIFIED
  ),
});

export const recurringEventSchema = Yup.object().shape({
  [RECURRING_EVENT_FIELDS.REPEAT_INTERVAL]: Yup.number()
    .nullable()
    .min(1, (param) =>
      createMinErrorMessage(param, VALIDATION_MESSAGE_KEYS.NUMBER_MIN)
    )
    .max(4, (param) =>
      createMaxErrorMessage(param, VALIDATION_MESSAGE_KEYS.NUMBER_MAX)
    )
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
  [RECURRING_EVENT_FIELDS.REPEAT_DAYS]: Yup.array()
    .required(VALIDATION_MESSAGE_KEYS.ARRAY_REQUIRED)
    .min(1, (param) =>
      createMinErrorMessage(param, VALIDATION_MESSAGE_KEYS.ARRAY_MIN)
    ),
  [RECURRING_EVENT_FIELDS.START_DATE]: Yup.date()
    .typeError(VALIDATION_MESSAGE_KEYS.DATE)
    .required(VALIDATION_MESSAGE_KEYS.DATE_REQUIRED)
    .test(
      'isInTheFuture',
      VALIDATION_MESSAGE_KEYS.DATE_FUTURE,
      (startTime) => !startTime || isFuture(startTime)
    ),
  [RECURRING_EVENT_FIELDS.END_DATE]: Yup.date()
    .typeError(VALIDATION_MESSAGE_KEYS.DATE)
    .required(VALIDATION_MESSAGE_KEYS.DATE_REQUIRED)
    // test that startsTime is before endsTime
    .when([RECURRING_EVENT_FIELDS.START_DATE], isAfterStartDate),
  [RECURRING_EVENT_FIELDS.START_TIME]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.TIME_REQUIRED)
    .test(
      'isValidTime',
      VALIDATION_MESSAGE_KEYS.TIME,
      (value) => !!value && isValidTime(value)
    ),
  [RECURRING_EVENT_FIELDS.END_TIME]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.TIME_REQUIRED)
    .test(
      'isValidTime',
      VALIDATION_MESSAGE_KEYS.TIME,
      (value) => !!value && isValidTime(value)
    )
    // test that endsAt is after startsAt time
    .when([RECURRING_EVENT_FIELDS.START_TIME], isAfterStartTime),
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

export const eventPathBuilder = ({
  args,
}: PathBuilderProps<EventQueryVariables>): string => {
  const { id, include } = args;
  const variableToKeyItems = [{ key: 'include', value: include }];

  const query = queryBuilder(variableToKeyItems);

  return `/event/${id}/${query}`;
};

const weekDayWeight = (day: WEEK_DAY): number => {
  switch (day) {
    case WEEK_DAY.MON:
      return 0;
    case WEEK_DAY.TUE:
      return 1;
    case WEEK_DAY.WED:
      return 2;
    case WEEK_DAY.THU:
      return 3;
    case WEEK_DAY.FRI:
      return 4;
    case WEEK_DAY.SAT:
      return 5;
    case WEEK_DAY.SUN:
      return 6;
  }
};

export const sortWeekDays = (a: string, b: string): number =>
  weekDayWeight(a as WEEK_DAY) - weekDayWeight(b as WEEK_DAY);

const languageWeight = (lang: string): number => {
  switch (lang) {
    case 'fi':
      return 1;
    case 'sv':
      return 2;
    case 'en':
      return 3;
    default:
      return 4;
  }
};

export const sortLanguage = (a: LELanguage, b: LELanguage): number =>
  languageWeight(a.id as string) - languageWeight(b.id as string);

export const getEmptyOffer = (): Offer => {
  return {
    [EVENT_FIELDS.OFFER_DESCRIPTION]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
    [EVENT_FIELDS.OFFER_INFO_URL]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
    [EVENT_FIELDS.OFFER_PRICE]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  };
};

export const getEmptyVideo = (): VideoDetails => {
  return {
    [VIDEO_DETAILS_FIELDS.ALT_TEXT]: '',
    [VIDEO_DETAILS_FIELDS.NAME]: '',
    [VIDEO_DETAILS_FIELDS.URL]: '',
  };
};

export const clearEventFormData = (): void => {
  sessionStorage.removeItem(FORM_NAMES.EVENT_FORM);
};

export const getEventFields = (
  event: EventFieldsFragment,
  language: Language
): EventFields => {
  const id = event.id || '';
  const publicationStatus = event.publicationStatus || PublicationStatus.Public;

  return {
    id,
    atId: event.atId || '',
    audienceMaxAge: event.audienceMaxAge || null,
    audienceMinAge: event.audienceMinAge || null,
    createdBy: event.createdBy || '',
    deleted: event.deleted ?? null,
    endTime: event.endTime ? new Date(event.endTime) : null,
    eventStatus: event.eventStatus || EventStatus.EventScheduled,
    eventUrl: `/${language}${ROUTES.EDIT_EVENT.replace(':id', id)}`,
    freeEvent: !!event.offers[0]?.isFree,
    imageUrl: event.images.find((image) => image?.url)?.url || null,
    inLanguage: event.inLanguage
      .map((item) => getLocalisedString(item?.name, language))
      .filter((e) => e),
    isDraft: publicationStatus === PublicationStatus.Draft,
    isPublic: publicationStatus === PublicationStatus.Public,
    lastModifiedTime: event.lastModifiedTime
      ? new Date(event.lastModifiedTime)
      : null,
    name: getLocalisedString(event.name, language),
    offers: event.offers.filter(
      (offer) => !!offer && !offer?.isFree
    ) as Offer[],
    publisher: event.publisher || null,
    publicationStatus,
    subEventAtIds:
      event.subEvents?.map((subEvent) => subEvent?.atId as string) || [],
    superEventAtId: event.superEvent?.atId || null,
    superEventType: event.superEventType || null,
    startTime: event.startTime ? new Date(event.startTime) : null,
  };
};

export const generateEventTimesFromRecurringEvent = (
  settings: RecurringEventSettings
): EventTime[] => {
  const { startDate, startTime, endDate, endTime, repeatDays, repeatInterval } =
    settings;
  const eventTimes: EventTime[] = [];

  /* istanbul ignore else  */
  if (startDate && endDate && repeatInterval > 0) {
    const dayCodes: Record<string, number> = {
      [WEEK_DAY.MON]: 1,
      [WEEK_DAY.TUE]: 2,
      [WEEK_DAY.WED]: 3,
      [WEEK_DAY.THU]: 4,
      [WEEK_DAY.FRI]: 5,
      [WEEK_DAY.SAT]: 6,
      [WEEK_DAY.SUN]: 0,
    };

    const recurrenceStart = endOfDay(subDays(new Date(startDate), 1));
    const recurrenceEnd = endOfDay(new Date(endDate));
    const formattedStartTime = getTimeObject(startTime);
    const formattedEndTime = getTimeObject(endTime);

    repeatDays.forEach((dayCode) => {
      const startDay = new Date(startDate).getDay();
      const day =
        startDay > dayCodes[dayCode]
          ? 7 - (startDay - dayCodes[dayCode])
          : dayCodes[dayCode] - startDay;
      let firstMatchWeekday;

      for (let i = 0; i <= repeatInterval; i = i + 1) {
        const possibleStartDate = setMinutes(
          setHours(
            addDays(new Date(startDate), day + i * 7),
            formattedStartTime.hours
          ),
          formattedStartTime.minutes
        );
        /* istanbul ignore else  */
        if (
          isWithinInterval(possibleStartDate, {
            start: recurrenceStart,
            end: recurrenceEnd,
          })
        ) {
          firstMatchWeekday = possibleStartDate;
          break;
        }
      }

      /* istanbul ignore else  */
      if (firstMatchWeekday) {
        let matchWeekday = firstMatchWeekday;
        while (
          isWithinInterval(matchWeekday, {
            start: recurrenceStart,
            end: recurrenceEnd,
          })
        ) {
          eventTimes.push({
            id: null,
            endTime: setMinutes(
              setHours(matchWeekday, formattedEndTime.hours),
              formattedEndTime.minutes
            ),
            startTime: matchWeekday,
          });

          matchWeekday = addWeeks(matchWeekday, repeatInterval);
        }
      }
    });
  }

  return eventTimes;
};

/**
 * take an array of sub event times, return start and end time for the
 * corresponding super event with:
 * - earliest date of sub events as startTime
 * - latest date of sub events as endTime
 */
export const calculateSuperEventTime = (eventTimes: EventTime[]): EventTime => {
  const startTimes: Date[] = [];
  const endTimes: Date[] = [];

  eventTimes.forEach(({ startTime, endTime }) => {
    if (startTime) {
      startTimes.push(new Date(startTime));
    }
    if (endTime) {
      endTimes.push(new Date(endTime));
    }
  });

  const superEventStartTime = startTimes.length
    ? minDate(startTimes)
    : undefined;
  const superEventEndTime = endTimes.length
    ? maxDate(endTimes)
    : startTimes.length
    ? endOfDay(maxDate(startTimes))
    : undefined;

  return {
    id: null,
    startTime: superEventStartTime || null,
    endTime: superEventEndTime || null,
  };
};

export const getEventTimes = (formValues: EventFormFields): EventTime[] => {
  const { events, eventTimes, recurringEvents } = formValues;

  const allEventTimes: EventTime[] = [...events, ...eventTimes];

  recurringEvents.forEach((settings) =>
    allEventTimes.push(...settings.eventTimes)
  );

  return sortBy(allEventTimes, 'startTime');
};

export const getNewEventTimes = (
  eventTimes: EventTime[],
  recurringEvents: RecurringEventSettings[]
): EventTime[] => [
  ...eventTimes,
  ...recurringEvents.reduce(
    (previous: EventTime[], current) => [...previous, ...current.eventTimes],
    []
  ),
];

export const filterUnselectedLanguages = (
  obj: LocalisedObject,
  eventInfoLanguages: string[]
): LocalisedObject =>
  Object.entries(obj).reduce(
    (acc, [k, v]) => ({
      ...acc,
      [k]: eventInfoLanguages.includes(k) ? v : null,
    }),
    {}
  );

export const formatSingleDescription = ({
  audience = [],
  description,
  lang,
}: {
  audience: string[];
  description: string;
  lang: string;
}): string => {
  // look for the Service Centre Card keyword
  const shouldAppendDescription = audience.find((item) =>
    item.includes('/keyword/helsinki:aflfbat76e/')
  );
  const descriptionDataMapping = {
    fi: {
      text: [
        'Tapahtuma on tarkoitettu vain eläkeläisille ja työttömille, joilla on',
        'palvelukeskuskortti',
      ],
      link: 'https://www.hel.fi/sote/fi/palvelut/palvelukuvaus?id=3252',
    },
    sv: {
      text: [
        'Evenemanget är avsett endast för pensionärer eller arbetslösa med',
        'servicecentralkort',
      ],
      link: 'https://www.hel.fi/sote/sv/tjanster/tjanstebeskrivning?id=3252',
    },
    en: {
      text: [
        'The event is intended only for retired or unemployed persons with a',
        'Service Centre Card',
      ],
      link: 'https://www.hel.fi/sote/en/services/service-desription?id=3252',
    },
  };

  if (description) {
    const trimmedDescription = description.trim();
    let formattedDescription =
      TEXT_EDITOR_ALLOWED_TAGS.find((tag: string) =>
        trimmedDescription.startsWith(`<${tag}>`)
      ) &&
      TEXT_EDITOR_ALLOWED_TAGS.find((tag: string) =>
        trimmedDescription.endsWith(`</${tag}>`)
      )
        ? trimmedDescription
        : `<p>${trimmedDescription}</p>`;

    formattedDescription = sanitizeHtml(formattedDescription);

    // append description if Service Centre Card is selected in audience
    // only append languages that are defined in the data mapping
    const descriptionAppendData =
      descriptionDataMapping[lang as keyof typeof descriptionDataMapping];
    if (
      shouldAppendDescription &&
      descriptionDataMapping.hasOwnProperty(lang) &&
      !formattedDescription.includes(descriptionAppendData.link)
    ) {
      // eslint-disable-next-line max-len
      const specialDescription = `<p>${descriptionAppendData.text[0]} <a href="${descriptionAppendData.link}">${descriptionAppendData.text[1]}</a>.</p>`;
      return specialDescription + formattedDescription;
    } else {
      return formattedDescription;
    }
  }
  return '';
};

const formatDescription = (formValues: EventFormFields) => {
  const formattedDescriptions = { ...formValues.description };
  const audience = formValues.audience;

  Object.entries(formattedDescriptions).forEach(([lang, description]) => {
    const formattedDescription = formatSingleDescription({
      audience,
      description,
      lang,
    });
    if (formattedDescription) {
      formattedDescriptions[lang as keyof MultiLanguageObject] =
        formattedDescription;
    }
  });

  return formattedDescriptions;
};

export const getEventBasePayload = (
  formValues: EventFormFields,
  publicationStatus: PublicationStatus
): Omit<CreateEventMutationInput, 'endTime' | 'startTime'> => {
  const {
    audience,
    audienceMaxAge,
    audienceMinAge,
    enrolmentEndTime,
    enrolmentStartTime,
    eventInfoLanguages,
    externalLinks,
    hasPrice,
    hasUmbrella,
    images,
    infoUrl,
    inLanguage,
    isUmbrella,
    keywords,
    location,
    locationExtraInfo,
    maximumAttendeeCapacity,
    minimumAttendeeCapacity,
    name,
    offers,
    provider,
    publisher,
    shortDescription,
    superEvent,
    type,
    videos,
  } = formValues;

  return {
    publicationStatus,
    audience: audience.map((atId) => ({ atId })),
    audienceMaxAge: isNumber(audienceMaxAge) ? audienceMaxAge : null,
    audienceMinAge: isNumber(audienceMinAge) ? audienceMinAge : null,
    description: filterUnselectedLanguages(
      formatDescription(formValues),
      eventInfoLanguages
    ),
    enrolmentEndTime: enrolmentEndTime
      ? new Date(enrolmentEndTime).toISOString()
      : null,
    enrolmentStartTime: enrolmentStartTime
      ? new Date(enrolmentStartTime).toISOString()
      : null,
    externalLinks: externalLinks.map((item) => ({
      ...item,
      language: EVENT_INFO_LANGUAGES.FI,
    })),
    images: images.map((atId) => ({ atId })),
    infoUrl: filterUnselectedLanguages(infoUrl, eventInfoLanguages),
    inLanguage: inLanguage.map((atId) => ({ atId })),
    keywords: keywords.map((atId) => ({ atId })),
    location: location ? { atId: location } : null,
    locationExtraInfo: filterUnselectedLanguages(
      locationExtraInfo,
      eventInfoLanguages
    ),
    maximumAttendeeCapacity: isNumber(maximumAttendeeCapacity)
      ? maximumAttendeeCapacity
      : null,
    minimumAttendeeCapacity: isNumber(minimumAttendeeCapacity)
      ? minimumAttendeeCapacity
      : null,
    name: filterUnselectedLanguages(name, eventInfoLanguages),
    offers: hasPrice
      ? offers.map((offer) => ({
          description: filterUnselectedLanguages(
            offer.description,
            eventInfoLanguages
          ),
          infoUrl: filterUnselectedLanguages(offer.infoUrl, eventInfoLanguages),
          price: filterUnselectedLanguages(offer.price, eventInfoLanguages),
          isFree: false,
        }))
      : [{ isFree: true }],
    provider: filterUnselectedLanguages(provider, eventInfoLanguages),
    publisher,
    shortDescription: filterUnselectedLanguages(
      shortDescription,
      eventInfoLanguages
    ),
    superEvent: hasUmbrella && superEvent ? { atId: superEvent } : null,
    superEventType: isUmbrella ? SuperEventType.Umbrella : null,
    typeId: capitalize(type) as EventTypeId,
    videos: videos.filter((video) => video.altText || video.name || video.url),
  };
};

export const getEventPayload = (
  formValues: EventFormFields,
  publicationStatus: PublicationStatus
): CreateEventMutationInput | CreateEventMutationInput[] => {
  const eventTimes = getEventTimes(formValues);
  const basePayload = getEventBasePayload(formValues, publicationStatus);

  if (eventTimes.length > 1) {
    return eventTimes.map((time) => ({
      ...basePayload,
      // Make sure that super event and super event type is set to null
      superEvent: null,
      superEventType: null,
      endTime: time.endTime ? new Date(time.endTime).toISOString() : null,
      startTime: time.startTime ? new Date(time.startTime).toISOString() : null,
    }));
  } else {
    return {
      ...basePayload,
      endTime: eventTimes[0]?.endTime
        ? new Date(eventTimes[0]?.endTime).toISOString()
        : null,
      startTime: eventTimes[0]?.startTime
        ? new Date(eventTimes[0]?.startTime).toISOString()
        : null,
    };
  }
};

export const getRecurringEventPayload = (
  basePayload: CreateEventMutationInput[],
  subEventAtIds: string[],
  values: EventFormFields
): CreateEventMutationInput => {
  const { hasUmbrella, superEvent } = values;
  const superEventTime = calculateSuperEventTime(
    basePayload.map(({ startTime, endTime }) => ({
      id: null,
      endTime: endTime ? new Date(endTime) : null,
      startTime: startTime ? new Date(startTime) : null,
    }))
  );
  const subEvents = subEventAtIds.map((atId) => ({
    atId: atId,
  }));

  /* istanbul ignore next */
  return {
    ...basePayload[0],
    endTime: superEventTime.endTime?.toISOString() ?? null,
    startTime: superEventTime.startTime?.toISOString() ?? null,
    superEvent: hasUmbrella && superEvent ? { atId: superEvent } : null,
    superEventType: SuperEventType.Recurring,
    subEvents,
  };
};

const SKIP_FIELDS = new Set([
  'location',
  'keywords',
  'audience',
  'languages',
  'inLanguage',
  'subEvents',
  'superEvent',
]);

// Enumerate all the property names of an object recursively.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* propertyNames(obj: Record<string, unknown>): any {
  for (const name of keys(obj)) {
    const val = (obj as Record<string, unknown>)[name];
    if (val instanceof Object && !SKIP_FIELDS.has(name)) {
      yield* propertyNames(val as Record<string, unknown>);
    }
    if (val && val !== '') {
      yield name;
    }
  }
}

export const getEventInfoLanguages = (event: EventFieldsFragment): string[] => {
  const languages = new Set(ORDERED_EVENT_INFO_LANGUAGES);
  const foundLanguages = new Set<string>();

  for (const name of propertyNames(event)) {
    if (foundLanguages.size === languages.size) {
      break;
    }
    if (languages.has(name)) {
      foundLanguages.add(name);
    }
  }
  return Array.from(foundLanguages);
};

export const getLocalisedObject = (
  obj?: Maybe<LocalisedFieldsFragment>,
  defaultValue = ''
): MultiLanguageObject => {
  return reduce(
    ORDERED_EVENT_INFO_LANGUAGES,
    (acc, lang) => ({
      ...acc,
      [lang]: (obj && obj[lang]) || defaultValue,
    }),
    {}
  ) as MultiLanguageObject;
};

const getSanitizedDescription = (event: EventFieldsFragment) => {
  const description = getLocalisedObject(event.description);

  for (const lang in description) {
    /* istanbul ignore else */
    if (description[lang as keyof MultiLanguageObject]) {
      description[lang as keyof MultiLanguageObject] = sanitizeHtml(
        description[lang as keyof MultiLanguageObject]
      );
    }
  }
  return description;
};

export const getEventInitialValues = (
  event: EventFieldsFragment
): EventFormFields => {
  // set the 'hasUmbrella' checkbox as checked, if:
  //  - the event has a super event with the super event type 'umbrella'
  //  - the super event value is not empty
  const hasUmbrella =
    event.superEvent?.superEventType === SuperEventType.Umbrella &&
    !!event.superEvent.atId;
  // set the 'isUmbrella' checkbox as checked, if:
  //  - super event type of the event is 'umbrella'
  const isUmbrella = event.superEventType === SuperEventType.Umbrella;
  const hasPrice = event.offers?.[0]?.isFree === false;
  const events: EventTime[] =
    event.superEventType === SuperEventType.Recurring
      ? event.subEvents
          .map((subEvent) => ({
            endTime: subEvent?.endTime ? new Date(subEvent?.endTime) : null,
            id: subEvent?.id || null,
            startTime: subEvent?.startTime
              ? new Date(subEvent?.startTime)
              : null,
          }))
          .sort(sortEventTimes)
      : [
          {
            endTime: event.endTime ? new Date(event.endTime) : null,
            id: event.id,
            startTime: event.startTime ? new Date(event.startTime) : null,
          },
        ];

  return {
    ...EVENT_INITIAL_VALUES,
    audience: event.audience.map((keyword) => keyword?.atId as string),
    audienceMaxAge: event.audienceMaxAge ?? '',
    audienceMinAge: event.audienceMinAge ?? '',
    description: getSanitizedDescription(event),
    events,
    enrolmentStartTime: event.enrolmentStartTime
      ? new Date(event.enrolmentStartTime)
      : null,
    enrolmentEndTime: event.enrolmentEndTime
      ? new Date(event.enrolmentEndTime)
      : null,
    eventInfoLanguages: getEventInfoLanguages(event),
    externalLinks: sortBy(event.externalLinks, ['name']).map(
      (externalLink) => ({
        link: externalLink?.link ?? '',
        name: externalLink?.name ?? '',
      })
    ),
    hasPrice,
    hasUmbrella: hasUmbrella,
    imageDetails: {
      altText:
        event.images[0]?.altText || EVENT_INITIAL_VALUES.imageDetails.altText,
      license:
        event.images[0]?.license || EVENT_INITIAL_VALUES.imageDetails.license,
      name: event.images[0]?.name || EVENT_INITIAL_VALUES.imageDetails.name,
      photographerName:
        event.images[0]?.photographerName ||
        EVENT_INITIAL_VALUES.imageDetails.photographerName,
    },
    images: event.images.map((image) => image?.atId as string),
    infoUrl: getLocalisedObject(event.infoUrl),
    inLanguage: event.inLanguage
      .map((language) => language?.atId as string)
      .filter((l) => l),
    isUmbrella: isUmbrella,
    isVerified: true,
    keywords: event.keywords.map((keyword) => keyword?.atId as string),
    location: event.location?.atId || '',
    locationExtraInfo: getLocalisedObject(event.locationExtraInfo),
    maximumAttendeeCapacity: event.maximumAttendeeCapacity ?? '',
    minimumAttendeeCapacity: event.minimumAttendeeCapacity ?? '',
    name: getLocalisedObject(event.name),
    offers: hasPrice
      ? event.offers
          .filter((offer) => !offer?.isFree)
          .map((offer) => ({
            description: getLocalisedObject(offer?.description),
            infoUrl: getLocalisedObject(offer?.infoUrl),
            price: getLocalisedObject(offer?.price),
          }))
      : [],
    publisher: event.publisher ?? '',
    provider: getLocalisedObject(event.provider),
    recurringEventEndTime:
      event.superEventType === SuperEventType.Recurring
        ? event.endTime
          ? new Date(event.endTime)
          : null
        : null,
    recurringEventStartTime:
      event.superEventType === SuperEventType.Recurring
        ? event.startTime
          ? new Date(event.startTime)
          : null
        : null,
    shortDescription: getLocalisedObject(event.shortDescription),
    superEvent: event.superEvent?.atId || '',
    type: event.typeId?.toLowerCase() ?? EVENT_TYPE.General,
    videos: event.videos.length
      ? event.videos.map((video) => ({
          altText: video?.altText ?? '',
          name: video?.name ?? '',
          url: video?.url ?? '',
        }))
      : [getEmptyVideo()],
  };
};

const getFocusableFieldId = (
  fieldName: string
): {
  fieldId: string;
  type: 'default' | 'checkboxGroup' | 'eventTimes' | 'select' | 'textEditor';
} => {
  // For the select elements, focus the toggle button
  if (EVENT_SELECT_FIELDS.find((item) => item === fieldName)) {
    return { fieldId: `${fieldName}-input`, type: 'select' };
  } else if (TEXT_EDITOR_FIELDS.find((item) => fieldName.startsWith(item))) {
    return { fieldId: `${fieldName}-text-editor`, type: 'textEditor' };
  } else if (fieldName === EVENT_FIELDS.MAIN_CATEGORIES) {
    return { fieldId: fieldName, type: 'checkboxGroup' };
  } else if (EVENT_FIELD_ARRAYS.includes(fieldName)) {
    return { fieldId: `${fieldName}-error`, type: 'default' };
  }

  return { fieldId: fieldName, type: 'default' };
};

export const scrollToFirstError = ({
  descriptionLanguage,
  error,
  setDescriptionLanguage,
}: {
  descriptionLanguage: EVENT_INFO_LANGUAGES;
  error: Yup.ValidationError;
  setDescriptionLanguage: (value: EVENT_INFO_LANGUAGES) => void;
}): void => {
  forEach(error.inner, (e) => {
    const path = e.path ?? /* istanbul ignore next */ '';
    const descriptionField = DESCRIPTION_SECTION_FIELDS.find((field) =>
      path.startsWith(field)
    );
    if (descriptionField) {
      const fieldLanguage = path.split('.')[1];

      // Change description section language if selected language
      // is different than field language
      if (fieldLanguage !== descriptionLanguage) {
        setDescriptionLanguage(fieldLanguage as EVENT_INFO_LANGUAGES);
      }
    }

    const { fieldId, type: fieldType } = getFocusableFieldId(path);
    const field = document.getElementById(fieldId);

    /* istanbul ignore else */
    if (field) {
      scroller.scrollTo(fieldId, {
        delay: 0,
        duration: 500,
        offset: -200,
        smooth: true,
      });

      if (fieldType === 'checkboxGroup') {
        const focusable = field.querySelectorAll('input');

        /* istanbul ignore else */
        if (focusable?.[0]) {
          focusable[0].focus();
        }
      }
      if (fieldType === 'textEditor') {
        field.click();
      } else {
        field.focus();
      }

      return false;
    }
  });
};

// This functions sets formik errors and touched values correctly after validation.
// The reason for this is to show all errors after validating the form.
// Errors are shown only for touched fields so set all fields with error touched
export const showErrors = ({
  descriptionLanguage,
  error,
  setErrors,
  setDescriptionLanguage,
  setTouched,
}: {
  descriptionLanguage: EVENT_INFO_LANGUAGES;
  error: Yup.ValidationError;
  setErrors: (errors: FormikErrors<EventFormFields>) => void;
  setDescriptionLanguage: (value: EVENT_INFO_LANGUAGES) => void;
  setTouched: (
    touched: FormikTouched<EventFormFields>,
    shouldValidate?: boolean
  ) => void;
}): void => {
  /* istanbul ignore else */
  if (error.name === 'ValidationError') {
    const newErrors = error.inner.reduce(
      (acc, e: Yup.ValidationError) =>
        set(acc, e.path ?? /* istanbul ignore next */ '', e.errors[0]),
      {}
    );
    const touchedFields = error.inner.reduce(
      (acc, e: Yup.ValidationError) =>
        set(acc, e.path ?? /* istanbul ignore next */ '', true),
      {}
    );

    setErrors(newErrors);
    setTouched(touchedFields);
    scrollToFirstError({ descriptionLanguage, error, setDescriptionLanguage });
  }
};

const getSubEvents = async ({
  apolloClient,
  event,
}: {
  apolloClient: ApolloClient<NormalizedCacheObject>;
  event: EventFieldsFragment;
}) => {
  if (!event.superEventType) return [];

  const subEvents: EventFieldsFragment[] = [];
  const subSubEvents: EventFieldsFragment[] = [];

  const id = event.id;
  const variables = {
    ...SUB_EVENTS_VARIABLES,
    superEvent: id,
  };

  const { data } = await apolloClient.query<EventsQuery>({
    query: EventsDocument,
    variables,
  });

  subEvents.push(...(data.events.data as EventFieldsFragment[]));

  let nextPage = getNextPage(data.events.meta);

  while (nextPage) {
    const { data } = await apolloClient.query<EventsQuery>({
      fetchPolicy: 'no-cache',
      query: EventsDocument,
      variables: { ...variables, page: nextPage },
    });

    subEvents.push(...(data.events.data as EventFieldsFragment[]));
    nextPage = getNextPage(data.events.meta);
  }

  // Check is subEvent a super event and recursively add it's sub events if needed
  for (const subEvent of subEvents) {
    if (subEvent.superEventType) {
      const items = await getSubEvents({
        apolloClient,
        event: subEvent,
      });

      subSubEvents.push(...items);
    }
  }

  return [...subEvents, ...subSubEvents];
};

export const getRelatedEvents = async ({
  apolloClient,
  event,
}: {
  apolloClient: ApolloClient<NormalizedCacheObject>;
  event: EventFieldsFragment;
}): Promise<EventFieldsFragment[]> => {
  const allRelatedEvents: EventFieldsFragment[] = [event];

  const subEvents = await getSubEvents({
    apolloClient,
    event,
  });
  allRelatedEvents.push(...subEvents);

  return allRelatedEvents;
};

export const checkCanUserDoAction = ({
  action,
  event,
  organizationAncestors,
  user,
}: {
  action: EVENT_EDIT_ACTIONS;
  event: EventFieldsFragment;
  organizationAncestors: OrganizationFieldsFragment[];
  user?: UserFieldsFragment;
}): boolean => {
  const { isDraft, publisher } = getEventFields(event, 'fi');

  const isRegularUser = isReqularUserInOrganization({
    id: publisher,
    user,
  });

  const isAdminUser = isAdminUserInOrganization({
    id: publisher,
    organizationAncestors,
    user,
  });

  switch (action) {
    case EVENT_EDIT_ACTIONS.CANCEL:
    case EVENT_EDIT_ACTIONS.DELETE:
    case EVENT_EDIT_ACTIONS.POSTPONE:
      return isDraft ? isRegularUser || isAdminUser : isAdminUser;
    case EVENT_EDIT_ACTIONS.PUBLISH:
    case EVENT_EDIT_ACTIONS.UPDATE_PUBLIC:
      return isAdminUser;
    case EVENT_EDIT_ACTIONS.UPDATE_DRAFT:
      return isRegularUser || isAdminUser;
  }

  return true;
};

const getIsEditButtonVisible = ({
  action,
  event,
  organizationAncestors,
  user,
}: {
  action: EVENT_EDIT_ACTIONS;
  event: EventFieldsFragment;
  organizationAncestors: OrganizationFieldsFragment[];
  user?: UserFieldsFragment;
}) => {
  const { isDraft, isPublic } = getEventFields(event, 'fi');

  switch (action) {
    case EVENT_EDIT_ACTIONS.CANCEL:
    case EVENT_EDIT_ACTIONS.COPY:
    case EVENT_EDIT_ACTIONS.DELETE:
    case EVENT_EDIT_ACTIONS.EDIT:
    case EVENT_EDIT_ACTIONS.POSTPONE:
      return true;
    case EVENT_EDIT_ACTIONS.PUBLISH:
      return (
        isDraft &&
        checkCanUserDoAction({ action, event, organizationAncestors, user })
      );
    case EVENT_EDIT_ACTIONS.UPDATE_DRAFT:
      return isDraft;
    case EVENT_EDIT_ACTIONS.UPDATE_PUBLIC:
      return isPublic;
  }
};

export const getEditEventWarning = ({
  action,
  authenticated,
  event,
  t,
  userCanDoAction,
}: {
  action: EVENT_EDIT_ACTIONS;
  authenticated: boolean;
  event: EventFieldsFragment;
  t: TFunction;
  userCanDoAction: boolean;
}): string => {
  const { deleted, endTime, eventStatus, isDraft, startTime } = getEventFields(
    event,
    'fi'
  );
  const isCancelled = eventStatus === EventStatus.EventCancelled;

  const isSubEvent = Boolean(event.superEvent);
  const eventIsInThePast =
    (endTime && isPast(endTime)) ||
    (!endTime && startTime && isBefore(startTime, startOfDay(new Date())));

  if (AUHENTICATION_NOT_NEEDED.includes(action)) {
    return '';
  }

  if (!authenticated) {
    return t('authentication.noRightsUpdateEvent');
  }

  if (isCancelled && NOT_ALLOWED_WHEN_CANCELLED.includes(action)) {
    return t('event.form.editButtonPanel.warningCancelledEvent');
  }

  if (deleted && NOT_ALLOWED_WHEN_DELETED.includes(action)) {
    return t('event.form.editButtonPanel.warningDeletedEvent');
  }

  if (eventIsInThePast && NOT_ALLOWED_WHEN_IN_PAST.includes(action)) {
    return t('event.form.editButtonPanel.warningEventInPast');
  }

  if (isDraft && action === EVENT_EDIT_ACTIONS.CANCEL) {
    return t('event.form.editButtonPanel.warningCannotCancelDraft');
  }

  if (isDraft && action === EVENT_EDIT_ACTIONS.POSTPONE) {
    return t('event.form.editButtonPanel.warningCannotPostponeDraft');
  }

  if (isDraft && action === EVENT_EDIT_ACTIONS.PUBLISH && isSubEvent) {
    return t('event.form.editButtonPanel.warningCannotPublishSubEvent');
  }

  if (!userCanDoAction) {
    return t('event.form.editButtonPanel.warningNoRightsToEdit');
  }

  return '';
};

type EventEditability = {
  editable: boolean;
  warning: string;
};

export const checkIsEditActionAllowed = ({
  action,
  authenticated,
  event,
  organizationAncestors,
  t,
  user,
}: {
  action: EVENT_EDIT_ACTIONS;
  authenticated: boolean;
  event: EventFieldsFragment;
  organizationAncestors: OrganizationFieldsFragment[];
  t: TFunction;
  user?: UserFieldsFragment;
}): EventEditability => {
  const userCanDoAction = checkCanUserDoAction({
    action,
    event,
    organizationAncestors,
    user,
  });

  const warning = getEditEventWarning({
    action,
    authenticated,
    event,
    t,
    userCanDoAction,
  });

  return { editable: !warning, warning };
};

export const getEditButtonProps = ({
  action,
  authenticated,
  event,
  onClick,
  organizationAncestors,
  t,
  user,
}: {
  action: EVENT_EDIT_ACTIONS;
  authenticated: boolean;
  event: EventFieldsFragment;
  onClick: () => void;
  organizationAncestors: OrganizationFieldsFragment[];
  t: TFunction;
  user?: UserFieldsFragment;
}): MenuItemOptionProps | null => {
  const { editable, warning } = checkIsEditActionAllowed({
    action,
    authenticated,
    event,
    organizationAncestors,
    t,
    user,
  });

  return getIsEditButtonVisible({
    action,
    event,
    organizationAncestors,
    user,
  })
    ? {
        disabled: !editable,
        icon: EVENT_EDIT_ICONS[action],
        label: t(EVENT_EDIT_LABEL_KEYS[action]),
        onClick,
        title: warning,
      }
    : null;
};

export const isCreateEventButtonVisible = ({
  action,
  authenticated,
  publisher,
  user,
}: {
  action: EVENT_CREATE_ACTIONS;
  authenticated: boolean;
  publisher: string;
  user?: UserFieldsFragment;
}): boolean => {
  const adminOrganizations = user?.adminOrganizations ?? [];
  const organizationMemberships = user?.organizationMemberships ?? [];
  const canCreateDraft = organizationMemberships.includes(publisher);
  const canPublish = adminOrganizations.includes(publisher);

  switch (action) {
    case EVENT_CREATE_ACTIONS.CREATE_DRAFT:
      return canCreateDraft || canPublish;
    case EVENT_CREATE_ACTIONS.PUBLISH:
      return !authenticated || canPublish;
  }
};

export const getCreateEventButtonWarning = ({
  action,
  authenticated,
  publisher,
  t,
  user,
}: {
  action: EVENT_CREATE_ACTIONS;
  authenticated: boolean;
  publisher: string;
  t: TFunction;
  user?: UserFieldsFragment;
}): string => {
  const adminOrganizations = user?.adminOrganizations ?? [];
  const organizationMemberships = user?.organizationMemberships ?? [];
  const canCreateDraft = organizationMemberships.includes(publisher);
  const canPublish = adminOrganizations.includes(publisher);

  if (!authenticated) {
    return t('event.form.buttonPanel.warningNotAuthenticated');
  }

  if (
    action === EVENT_CREATE_ACTIONS.CREATE_DRAFT &&
    !(canCreateDraft || canPublish)
  ) {
    return t('event.form.buttonPanel.warningNoRightsCreate');
  }

  if (action === EVENT_CREATE_ACTIONS.PUBLISH && !canPublish) {
    return t('event.form.buttonPanel.warningNoRightsPublish');
  }

  return '';
};

export const copyEventToSessionStorage = async (
  event: EventFieldsFragment
): Promise<void> => {
  const state: FormikState<EventFormFields> = {
    errors: {},
    isSubmitting: false,
    isValidating: false,
    submitCount: 0,
    touched: {},
    values: {
      ...getEventInitialValues(event),
      events: [],
      eventTimes: [],
      recurringEvents: [],
      recurringEventEndTime: null,
      recurringEventStartTime: null,
      hasUmbrella: false,
      isUmbrella: false,
      isVerified: false,
      publisher: '',
      superEvent: null,
    },
  };

  sessionStorage.setItem(FORM_NAMES.EVENT_FORM, JSON.stringify(state));
};

export const getRecurringEvent = async (
  id: string,
  apolloClient: ApolloClient<NormalizedCacheObject>
): Promise<EventFieldsFragment | null> => {
  try {
    const { data: eventData } = await apolloClient.query<EventQuery>({
      query: EventDocument,
      fetchPolicy: 'no-cache',
      variables: {
        id,
        include: EVENT_INCLUDES,
        createPath: getPathBuilder(eventPathBuilder),
      },
    });

    return eventData.event;
  } catch (e) /* istanbul ignore next */ {
    return null;
  }
};
