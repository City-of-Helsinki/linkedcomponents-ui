import { ApolloClient } from '@apollo/client';
import addDays from 'date-fns/addDays';
import addWeeks from 'date-fns/addWeeks';
import endOfDay from 'date-fns/endOfDay';
import isBefore from 'date-fns/isBefore';
import isFuture from 'date-fns/isFuture';
import isValid from 'date-fns/isValid';
import isWithinInterval from 'date-fns/isWithinInterval';
import maxDate from 'date-fns/max';
import minDate from 'date-fns/min';
import parseDate from 'date-fns/parse';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import subDays from 'date-fns/subDays';
import { FormikErrors, FormikTouched } from 'formik';
import forEach from 'lodash/forEach';
import isEqual from 'lodash/isEqual';
import keys from 'lodash/keys';
import reduce from 'lodash/reduce';
import set from 'lodash/set';
import sortBy from 'lodash/sortBy';
import uniqWith from 'lodash/uniqWith';
import * as Yup from 'yup';

import { getTimeObject } from '../../common/components/timepicker/utils';
import {
  CHARACTER_LIMITS,
  DATE_FORMAT,
  DATETIME_FORMAT,
  EXTLINK,
  FORM_NAMES,
  MAX_PAGE_SIZE,
  ROUTES,
  WEEK_DAY,
} from '../../constants';
import {
  CreateEventMutationInput,
  EventFieldsFragment,
  EventQueryVariables,
  EventsDocument,
  EventsQuery,
  EventStatus,
  ExternalLinkInput,
  LocalisedFieldsFragment,
  LocalisedObject,
  Maybe,
  PublicationStatus,
  SuperEventType,
} from '../../generated/graphql';
import { Language, OptionType, PathBuilderProps } from '../../types';
import dropNilAndEmptyString from '../../utils/dropNilAndEmptyString';
import formatDate from '../../utils/formatDate';
import getLocalisedString from '../../utils/getLocalisedString';
import getNextPage from '../../utils/getNextPage';
import getPathBuilder from '../../utils/getPathBuilder';
import queryBuilder from '../../utils/queryBuilder';
import {
  createArrayError,
  createNumberError,
  createStringError,
} from '../../utils/validationUtils';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import { EVENT_SORT_OPTIONS } from '../events/constants';
import { eventsPathBuilder } from '../events/utils';
import {
  ADD_IMAGE_FIELDS,
  EMPTY_MULTI_LANGUAGE_OBJECT,
  EVENT_FIELDS,
  EVENT_INCLUDES,
  EVENT_INFO_LANGUAGES,
  EVENT_INITIAL_VALUES,
  EXTENSION_COURSE_FIELDS,
  IMAGE_ALT_TEXT_MIN_LENGTH,
  IMAGE_DETAILS_FIELDS,
  ORDERED_EVENT_INFO_LANGUAGES,
  RECURRING_EVENT_FIELDS,
  SELECT_FIELDS,
} from './constants';
import {
  EventFields,
  EventFormFields,
  EventTime,
  MultiLanguageObject,
  Offer,
  RecurringEventSettings,
} from './types';

const transformNumber = (value: number, originalValue: string) =>
  String(originalValue).trim() === '' ? null : value;

const createMultiLanguageValidation = (
  languages: string[],
  rule: Yup.Schema<string | null | undefined>
) => {
  return Yup.object().shape(
    reduce(languages, (acc, lang) => ({ ...acc, [lang]: rule }), {})
  );
};

const createMultiLanguageValidationByInfoLanguages = (
  rule: Yup.Schema<string | null | undefined>
) => {
  return Yup.object().when(
    [EVENT_FIELDS.EVENT_INFO_LANGUAGES],
    (languages: string[]) => createMultiLanguageValidation(languages, rule)
  );
};

const createExtensionCourseValidation = () => {
  return Yup.object().shape({
    [EXTENSION_COURSE_FIELDS.ENROLMENT_START_TIME]: Yup.date()
      .nullable()
      .typeError(VALIDATION_MESSAGE_KEYS.DATE)
      .test('isInTheFuture', VALIDATION_MESSAGE_KEYS.DATE_FUTURE, (startTime) =>
        startTime ? isFuture(startTime) : true
      ),
    [EXTENSION_COURSE_FIELDS.ENROLMENT_END_TIME]: Yup.date()
      .nullable()
      .typeError(VALIDATION_MESSAGE_KEYS.DATE)
      .test('isInTheFuture', VALIDATION_MESSAGE_KEYS.DATE_FUTURE, (endTime) =>
        endTime ? isFuture(endTime) : true
      )
      // test that startsTime is before endsTime
      .when(
        [EXTENSION_COURSE_FIELDS.ENROLMENT_START_TIME],
        (startTime: Date | null, schema: Yup.DateSchema) => {
          if (startTime && isValid(startTime)) {
            return schema.test(
              'isBeforeStartTime',
              () => ({
                key: VALIDATION_MESSAGE_KEYS.DATE_MIN,
                min: formatDate(startTime, DATETIME_FORMAT),
              }),
              (endTime) => {
                return endTime ? isBefore(startTime, endTime) : true;
              }
            );
          }
          return schema;
        }
      ),
    [EXTENSION_COURSE_FIELDS.MINIMUM_ATTENDEE_CAPACITY]: Yup.number()
      .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
      .min(0, (param) =>
        createNumberError(param, VALIDATION_MESSAGE_KEYS.NUMBER_MIN)
      )
      .nullable()
      .transform(transformNumber),
    [EXTENSION_COURSE_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: Yup.number().when(
      [EXTENSION_COURSE_FIELDS.MINIMUM_ATTENDEE_CAPACITY],
      (minimumAttendeeCapacity: number) => {
        return Yup.number()
          .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
          .min(minimumAttendeeCapacity || 0, (param) =>
            createNumberError(param, VALIDATION_MESSAGE_KEYS.NUMBER_MIN)
          )
          .nullable()
          .transform(transformNumber);
      }
    ),
  });
};

const createEventTimeValidation = (publicationStatus: PublicationStatus) => ({
  [EVENT_FIELDS.START_TIME]: Yup.date()
    .nullable()
    .typeError(VALIDATION_MESSAGE_KEYS.DATE)
    .test('isInTheFuture', VALIDATION_MESSAGE_KEYS.DATE_FUTURE, (startTime) =>
      startTime ? isFuture(startTime) : true
    )
    .when([], (schema: Yup.DateSchema) => {
      return publicationStatus === PublicationStatus.Draft
        ? schema
        : schema.required(VALIDATION_MESSAGE_KEYS.DATE_REQUIRED);
    }),
  [EVENT_FIELDS.END_TIME]: Yup.date()
    .nullable()
    .typeError(VALIDATION_MESSAGE_KEYS.DATE)
    .when([], (schema: Yup.DateSchema) => {
      return publicationStatus === PublicationStatus.Draft
        ? schema
        : schema.required(VALIDATION_MESSAGE_KEYS.DATE_REQUIRED);
    })
    // test that startsTime is before endsTime
    .when(
      [EVENT_FIELDS.START_TIME],
      (startTime: Date | null, schema: Yup.DateSchema) => {
        if (startTime && isValid(startTime)) {
          return schema.test(
            'isBeforeStartTime',
            () => ({
              key: VALIDATION_MESSAGE_KEYS.DATE_AFTER,
              after: formatDate(startTime, DATETIME_FORMAT),
            }),
            (endTime) => {
              return endTime ? isBefore(startTime, endTime) : true;
            }
          );
        }
        return schema;
      }
    ),
});

const imageDetailsValidation = {
  [IMAGE_DETAILS_FIELDS.ALT_TEXT]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .min(IMAGE_ALT_TEXT_MIN_LENGTH, (param) =>
      createStringError(param, VALIDATION_MESSAGE_KEYS.STRING_MIN)
    )
    .max(CHARACTER_LIMITS.SHORT_STRING, (param) =>
      createStringError(param, VALIDATION_MESSAGE_KEYS.STRING_MAX)
    ),
  [IMAGE_DETAILS_FIELDS.NAME]: Yup.string().max(
    CHARACTER_LIMITS.MEDIUM_STRING,
    (param) => createStringError(param, VALIDATION_MESSAGE_KEYS.STRING_MAX)
  ),
};

export const eventValidationSchema = Yup.object().shape({
  [EVENT_FIELDS.TYPE]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
  [EVENT_FIELDS.SUPER_EVENT]: Yup.string()
    .nullable()
    .when([EVENT_FIELDS.HAS_UMBRELLA], {
      is: (value) => value,
      then: Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
    }),
  [EVENT_FIELDS.NAME]: createMultiLanguageValidationByInfoLanguages(
    Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
  ),
  [EVENT_FIELDS.INFO_URL]: createMultiLanguageValidationByInfoLanguages(
    Yup.string().url(VALIDATION_MESSAGE_KEYS.URL)
  ),
  [EVENT_FIELDS.SHORT_DESCRIPTION]: createMultiLanguageValidationByInfoLanguages(
    Yup.string()
      .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
      .max(CHARACTER_LIMITS.SHORT_STRING, (param) =>
        createStringError(param, VALIDATION_MESSAGE_KEYS.STRING_MAX)
      )
  ),
  [EVENT_FIELDS.DESCRIPTION]: createMultiLanguageValidationByInfoLanguages(
    Yup.string()
      .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
      .max(CHARACTER_LIMITS.LONG_STRING, (param) =>
        createStringError(param, VALIDATION_MESSAGE_KEYS.STRING_MAX)
      )
  ),
  ...createEventTimeValidation(PublicationStatus.Public),
  [EVENT_FIELDS.EVENT_TIMES]: Yup.array().of(
    Yup.object().shape({
      ...createEventTimeValidation(PublicationStatus.Public),
    })
  ),
  [EVENT_FIELDS.LOCATION]: Yup.string()
    .nullable()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
  [EVENT_FIELDS.LOCATION_EXTRA_INFO]: createMultiLanguageValidationByInfoLanguages(
    Yup.string().max(CHARACTER_LIMITS.SHORT_STRING, (param) =>
      createStringError(param, VALIDATION_MESSAGE_KEYS.STRING_MAX)
    )
  ),
  [EVENT_FIELDS.OFFERS]: Yup.array().when(
    [EVENT_FIELDS.HAS_PRICE, EVENT_FIELDS.EVENT_INFO_LANGUAGES],
    (
      hasPrice: boolean,
      eventInfoLanguage: string[],
      schema: Yup.ArraySchema<any>
    ) => {
      return hasPrice
        ? Yup.array().of(
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
    }
  ),
  [EVENT_FIELDS.FACEBOOK_URL]: Yup.string().url(VALIDATION_MESSAGE_KEYS.URL),
  [EVENT_FIELDS.TWITTER_URL]: Yup.string().url(VALIDATION_MESSAGE_KEYS.URL),
  [EVENT_FIELDS.INSTAGRAM_URL]: Yup.string().url(VALIDATION_MESSAGE_KEYS.URL),
  [EVENT_FIELDS.IMAGE_DETAILS]: Yup.object().when(
    [EVENT_FIELDS.IMAGES],
    (images: string[], schema: Yup.ObjectSchema<any>) => {
      return images && images.length
        ? Yup.object().shape(imageDetailsValidation)
        : schema;
    }
  ),
  [EVENT_FIELDS.KEYWORDS]: Yup.array()
    .required(VALIDATION_MESSAGE_KEYS.ARRAY_REQUIRED)
    .min(1, (param) =>
      createArrayError(param, VALIDATION_MESSAGE_KEYS.ARRAY_MIN)
    ),
  [EVENT_FIELDS.AUDIENCE_MIN_AGE]: Yup.number()
    .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
    .min(0, (param) =>
      createNumberError(param, VALIDATION_MESSAGE_KEYS.NUMBER_MIN)
    )
    .nullable()
    .transform(transformNumber),
  [EVENT_FIELDS.AUDIENCE_MAX_AGE]: Yup.number()
    .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
    .when(
      [EVENT_FIELDS.AUDIENCE_MIN_AGE],
      (audienceMinAge: number, schema: Yup.NumberSchema) =>
        schema.min(audienceMinAge || 0, (param) =>
          createNumberError(param, VALIDATION_MESSAGE_KEYS.NUMBER_MIN)
        )
    )
    .nullable()
    .transform(transformNumber),
  [EVENT_FIELDS.EXTENSION_COURSE]: createExtensionCourseValidation(),
  [EVENT_FIELDS.IS_VERIFIED]: Yup.bool().oneOf(
    [true],
    VALIDATION_MESSAGE_KEYS.EVENT_INFO_VERIFIED
  ),
});

export const draftEventValidationSchema = Yup.object().shape({
  [EVENT_FIELDS.NAME]: createMultiLanguageValidationByInfoLanguages(
    Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
  ),
  [EVENT_FIELDS.SHORT_DESCRIPTION]: createMultiLanguageValidationByInfoLanguages(
    Yup.string().max(CHARACTER_LIMITS.SHORT_STRING)
  ),
  [EVENT_FIELDS.DESCRIPTION]: createMultiLanguageValidationByInfoLanguages(
    Yup.string().max(CHARACTER_LIMITS.LONG_STRING)
  ),
  ...createEventTimeValidation(PublicationStatus.Draft),
  [EVENT_FIELDS.EVENT_TIMES]: Yup.array().of(
    Yup.object().shape({
      ...createEventTimeValidation(PublicationStatus.Draft),
    })
  ),
  [EVENT_FIELDS.LOCATION_EXTRA_INFO]: createMultiLanguageValidationByInfoLanguages(
    Yup.string().max(CHARACTER_LIMITS.SHORT_STRING)
  ),
  [EVENT_FIELDS.FACEBOOK_URL]: Yup.string().url(),
  [EVENT_FIELDS.TWITTER_URL]: Yup.string().url(),
  [EVENT_FIELDS.INSTAGRAM_URL]: Yup.string().url(),
  [EVENT_FIELDS.IMAGE_DETAILS]: Yup.object().when(
    [EVENT_FIELDS.IMAGES],
    (images: string[], schema: Yup.ObjectSchema<any>) => {
      return images && images.length
        ? Yup.object().shape(imageDetailsValidation)
        : schema;
    }
  ),
  [EVENT_FIELDS.AUDIENCE_MIN_AGE]: Yup.number()
    .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
    .min(0, (param) =>
      createNumberError(param, VALIDATION_MESSAGE_KEYS.NUMBER_MIN)
    )
    .nullable()
    .transform(transformNumber),
  [EVENT_FIELDS.AUDIENCE_MAX_AGE]: Yup.number()
    .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
    .when(
      [EVENT_FIELDS.AUDIENCE_MIN_AGE],
      (audienceMinAge: number, schema: Yup.NumberSchema) =>
        schema.min(audienceMinAge || 0, (param) =>
          createNumberError(param, VALIDATION_MESSAGE_KEYS.NUMBER_MIN)
        )
    )
    .nullable()
    .transform(transformNumber),
  [EVENT_FIELDS.IS_VERIFIED]: Yup.bool().oneOf(
    [true],
    VALIDATION_MESSAGE_KEYS.EVENT_INFO_VERIFIED
  ),
});

export const isValidTime = (time: string) =>
  /^(([01][0-9])|(2[0-3]))(:|\.)[0-5][0-9]$/.test(time);

export const createRecurringEventValidationSchema = () => {
  return Yup.object().shape({
    [RECURRING_EVENT_FIELDS.REPEAT_INTERVAL]: Yup.string().required(
      VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
    ),
    [RECURRING_EVENT_FIELDS.REPEAT_DAYS]: Yup.array()
      .required(VALIDATION_MESSAGE_KEYS.ARRAY_REQUIRED)
      .min(1, (param) =>
        createArrayError(param, VALIDATION_MESSAGE_KEYS.ARRAY_MIN)
      ),
    [RECURRING_EVENT_FIELDS.START_DATE]: Yup.date()
      .typeError(VALIDATION_MESSAGE_KEYS.DATE)
      .required(VALIDATION_MESSAGE_KEYS.DATE_REQUIRED)
      .test('isInTheFuture', VALIDATION_MESSAGE_KEYS.DATE_FUTURE, (startTime) =>
        startTime ? isFuture(startTime) : true
      ),
    [RECURRING_EVENT_FIELDS.END_DATE]: Yup.date()
      .typeError(VALIDATION_MESSAGE_KEYS.DATE)
      .required(VALIDATION_MESSAGE_KEYS.DATE_REQUIRED)
      // test that startsTime is before endsTime
      .when(
        [RECURRING_EVENT_FIELDS.START_DATE],
        (startDate: Date | null, schema: Yup.DateSchema) => {
          if (startDate && isValid(startDate)) {
            return schema.test(
              'isBeforeStartDate',
              () => ({
                key: VALIDATION_MESSAGE_KEYS.DATE_AFTER,
                after: formatDate(startDate, DATE_FORMAT),
              }),
              (endDate) => {
                return endDate ? isBefore(startDate, endDate) : true;
              }
            );
          }
          return schema;
        }
      ),
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
      // test that startsAt is before endsAt time
      .when(
        [RECURRING_EVENT_FIELDS.START_TIME],
        (startsAt: string, schema: Yup.StringSchema) => {
          if (isValidTime(startsAt)) {
            return schema.test(
              'isBeforeStartTime',
              () => ({
                key: VALIDATION_MESSAGE_KEYS.TIME_AFTER,
                after: startsAt,
              }),
              (endsAt) => {
                if (endsAt && isValidTime(endsAt)) {
                  const modifiedStartsAt = startsAt.replace(':', '.');
                  const modifiedEndsAt = endsAt.replace(':', '.');

                  return isBefore(
                    parseDate(modifiedStartsAt, 'HH.mm', new Date()),
                    parseDate(modifiedEndsAt, 'HH.mm', new Date())
                  );
                }
                return true;
              }
            );
          }
          return schema;
        }
      ),
  });
};

export const createAddImageValidationSchema = () => {
  return Yup.object().shape(
    {
      [ADD_IMAGE_FIELDS.SELECTED_IMAGE]: Yup.array().when(
        [ADD_IMAGE_FIELDS.URL],
        (url: string, schema: Yup.ArraySchema<string>) => {
          return url ? schema.min(0) : schema.min(1);
        }
      ),
      [ADD_IMAGE_FIELDS.URL]: Yup.string().when(
        [ADD_IMAGE_FIELDS.SELECTED_IMAGE],
        (ids: string[], schema: Yup.StringSchema) => {
          return ids.length ? schema : schema.url(VALIDATION_MESSAGE_KEYS.URL);
        }
      ),
    },
    [[ADD_IMAGE_FIELDS.SELECTED_IMAGE, ADD_IMAGE_FIELDS.URL]]
  );
};

export const eventPathBuilder = ({
  args,
}: PathBuilderProps<EventQueryVariables>) => {
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

export const sortWeekDays = (a: string, b: string) =>
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

export const sortLanguage = (a: OptionType, b: OptionType) =>
  languageWeight(a.value) - languageWeight(b.value);

export const getEmptyEventTime = (): EventTime => {
  return {
    [EVENT_FIELDS.END_TIME]: null,
    [EVENT_FIELDS.START_TIME]: null,
  };
};

export const getEmptyOffer = (): Offer => {
  return {
    [EVENT_FIELDS.OFFER_DESCRIPTION]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
    [EVENT_FIELDS.OFFER_INFO_URL]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
    [EVENT_FIELDS.OFFER_PRICE]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  };
};

export const clearEventFormData = () => {
  sessionStorage.removeItem(FORM_NAMES.EVENT_FORM);
};

const getEventLocationFields = (
  event: EventFieldsFragment,
  language: Language
) => {
  const location = event.location;
  return {
    addressLocality: getLocalisedString(location?.addressLocality, language),
    locationName: getLocalisedString(location?.name, language),
    streetAddress: getLocalisedString(location?.streetAddress, language),
  };
};

export const getEventFields = (
  event: EventFieldsFragment,
  language: Language
): EventFields => {
  const id = event.id || '';

  return {
    id,
    atId: event.atId || '',
    audienceMaxAge: event.audienceMaxAge || null,
    audienceMinAge: event.audienceMinAge || null,
    createdBy: event.createdBy || '',
    endTime: event.endTime ? new Date(event.endTime) : null,
    eventStatus: event.eventStatus || EventStatus.EventScheduled,
    eventUrl: `/${language}${ROUTES.EDIT_EVENT.replace(':id', id)}`,
    freeEvent: !!event.offers[0]?.isFree,
    imageUrl: event.images.find((image) => image?.url)?.url || null,
    inLanguage: event.inLanguage
      .map((item) => getLocalisedString(item?.name, language))
      .filter((e) => e),
    lastModifiedTime: event.lastModifiedTime
      ? new Date(event.lastModifiedTime)
      : null,
    name: getLocalisedString(event.name, language),
    offers: event.offers.filter(
      (offer) => !!offer && !offer?.isFree
    ) as Offer[],
    publisher: event.publisher || null,
    publicationStatus: event.publicationStatus || PublicationStatus.Public,
    subEventAtIds:
      event.subEvents?.map((subEvent) => subEvent?.atId as string) || [],
    superEventAtId: event.superEvent?.atId || null,
    superEventType: event.superEventType || null,
    startTime: event.startTime ? new Date(event.startTime) : null,
    ...getEventLocationFields(event, language),
  };
};

export const generateEventTimesFromRecurringEvent = (
  settings: RecurringEventSettings
): EventTime[] => {
  const {
    startDate,
    startTime,
    endDate,
    endTime,
    repeatDays,
    repeatInterval,
  } = settings;
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
      [WEEK_DAY.SUN]: 7,
    };

    const recurrenceStart = endOfDay(subDays(new Date(startDate), 1));
    const recurrenceEnd = endOfDay(new Date(endDate));
    const formattedStartTime = getTimeObject(startTime);
    const formattedEndTime = getTimeObject(endTime);

    repeatDays.forEach((dayCode) => {
      const day = dayCodes[dayCode];
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
    startTime: superEventStartTime || null,
    endTime: superEventEndTime || null,
  };
};

export const getEventTimes = (formValues: EventFormFields): EventTime[] => {
  const { endTime, eventTimes, recurringEvents, startTime } = formValues;
  const allEventTimes: EventTime[] = [];

  /* istanbul ignore else  */
  if (endTime || startTime) {
    allEventTimes.push({ endTime, startTime });
  }

  allEventTimes.push(
    ...eventTimes.filter(({ endTime, startTime }) => endTime || startTime)
  );

  recurringEvents.forEach((settings) =>
    allEventTimes.push(...generateEventTimesFromRecurringEvent(settings))
  );

  return sortBy(uniqWith(allEventTimes, isEqual), 'startTime');
};

export const filterUnselectedLanguages = (
  obj: LocalisedObject,
  eventInfoLanguages: string[]
) =>
  Object.entries(obj).reduce(
    (acc, [k, v]) =>
      eventInfoLanguages.includes(k) ? { ...acc, [k]: v } : acc,
    {}
  );

export const getEventPayload = (
  formValues: EventFormFields,
  publicationStatus: PublicationStatus
): CreateEventMutationInput | CreateEventMutationInput[] => {
  const {
    audience,
    audienceMaxAge,
    audienceMinAge,
    description,
    endTime,
    eventInfoLanguages,
    facebookUrl,
    hasPrice,
    hasUmbrella,
    images,
    infoUrl,
    inLanguage,
    instagramUrl,
    isUmbrella,
    keywords,
    location,
    locationExtraInfo,
    name,
    offers,
    provider,
    shortDescription,
    startTime,
    superEvent,
    twitterUrl,
  } = formValues;

  const externalLinkFields = [
    { field: EXTLINK.EXTLINK_FACEBOOK, value: facebookUrl },
    { field: EXTLINK.EXTLINK_INSTAGRAM, value: instagramUrl },
    { field: EXTLINK.EXTLINK_TWITTER, value: twitterUrl },
  ];

  const uniqEventTimes = getEventTimes(formValues);

  const basePayload: CreateEventMutationInput = {
    publicationStatus,
    audience: audience.map((atId) => ({ atId })),
    ...(audienceMaxAge ? { audienceMaxAge } : undefined),
    ...(audienceMinAge ? { audienceMinAge } : ''),
    externalLinks: externalLinkFields
      .map((field) => {
        /* istanbul ignore else  */
        if (field.value) {
          return {
            name: field.field,
            link: field.value,
            language: EVENT_INFO_LANGUAGES.FI, // TODO: Which languages here?
          };
        } else {
          return null;
        }
      })
      .filter((item) => item) as ExternalLinkInput[],
    description: filterUnselectedLanguages(description, eventInfoLanguages),
    images: images.map((atId) => ({ atId })),
    infoUrl: filterUnselectedLanguages(infoUrl, eventInfoLanguages),
    inLanguage: inLanguage.map((atId) => ({ atId })),
    ...(location ? { location: { atId: location } } : undefined),
    keywords: keywords.map((atId) => ({ atId })),
    locationExtraInfo: filterUnselectedLanguages(
      locationExtraInfo,
      eventInfoLanguages
    ),
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
    shortDescription: filterUnselectedLanguages(
      shortDescription,
      eventInfoLanguages
    ),
    superEvent: hasUmbrella && superEvent ? { atId: superEvent } : undefined,
    superEventType:
      isUmbrella && uniqEventTimes.length <= 1 ? SuperEventType.Umbrella : null,
  };

  if (uniqEventTimes.length > 1) {
    const payload: CreateEventMutationInput[] = uniqEventTimes.map((time) => ({
      ...basePayload,
      ...(time.endTime
        ? { endTime: new Date(time.endTime).toISOString() }
        : undefined),
      ...(time.startTime
        ? { startTime: new Date(time.startTime).toISOString() }
        : undefined),
    }));

    return payload.map((item) => dropNilAndEmptyString(item));
  } else {
    const payload: CreateEventMutationInput = {
      ...basePayload,
      ...(endTime ? { endTime: new Date(endTime).toISOString() } : undefined),
      ...(startTime
        ? { startTime: new Date(startTime).toISOString() }
        : undefined),
    };

    return dropNilAndEmptyString(payload);
  }
};

export const getRecurringEventPayload = (
  basePayload: CreateEventMutationInput[],
  subEventAtIds: string[]
) => {
  const superEventTime = calculateSuperEventTime(
    basePayload.map(({ startTime, endTime }) => ({
      endTime: endTime ? new Date(endTime) : null,
      startTime: startTime ? new Date(startTime) : null,
    }))
  );
  const subEvents = subEventAtIds.map((atId) => ({
    atId: atId,
  }));

  return {
    ...basePayload[0],
    startTime: superEventTime.startTime?.toISOString(),
    endTime: superEventTime.endTime?.toISOString(),
    superEventType: SuperEventType.Recurring,
    subEvents,
  };
};

const SKIP_FIELDS = new Set([
  'location',
  'keywords',
  'audience',
  'languages',
  'in_language',
  'sub_events',
]);

// Enumerate all the property names of an object recursively.
function* propertyNames(obj: object): any {
  for (const name of keys(obj)) {
    const val = (obj as Record<string, unknown>)[name];
    if (val instanceof Object && !SKIP_FIELDS.has(name)) {
      yield* propertyNames(val);
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
      [lang]: (obj && (obj as Record<string, unknown>)[lang]) || defaultValue,
    }),
    {}
  ) as MultiLanguageObject;
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
  const hasPrice = !event.offers[0]?.isFree;

  return {
    ...EVENT_INITIAL_VALUES,
    eventInfoLanguages: getEventInfoLanguages(event),
    inLanguage: event.inLanguage
      .map((language) => language?.atId as string)
      .filter((l) => l),
    provider: getLocalisedObject(event.provider),
    hasUmbrella: hasUmbrella,
    isUmbrella: isUmbrella,
    superEvent: event.superEvent?.atId || '',
    name: getLocalisedObject(event.name),
    infoUrl: getLocalisedObject(event.infoUrl),
    shortDescription: getLocalisedObject(event.shortDescription),
    description: getLocalisedObject(event.description),
    startTime: event.startTime ? new Date(event.startTime) : null,
    endTime: event.endTime ? new Date(event.endTime) : null,
    location: event.location?.atId || '',
    locationExtraInfo: getLocalisedObject(event.locationExtraInfo),
    hasPrice,
    offers: hasPrice
      ? event.offers
          .filter((offer) => !offer?.isFree)
          .map((offer) => ({
            description: getLocalisedObject(offer?.description),
            infoUrl: getLocalisedObject(offer?.infoUrl),
            price: getLocalisedObject(offer?.price),
          }))
      : [],
    facebookUrl:
      event.externalLinks.find(
        (link) => link?.name === EXTLINK.EXTLINK_FACEBOOK
      )?.link || '',
    twitterUrl:
      event.externalLinks.find((link) => link?.name === EXTLINK.EXTLINK_TWITTER)
        ?.link || '',
    instagramUrl:
      event.externalLinks.find(
        (link) => link?.name === EXTLINK.EXTLINK_INSTAGRAM
      )?.link || '',
    images: event.images.map((image) => image?.atId as string),
    keywords: event.keywords.map((keyword) => keyword?.atId as string),
    audience: event.audience.map((keyword) => keyword?.atId as string),
    audienceMaxAge: event.audienceMaxAge || '',
    audienceMinAge: event.audienceMinAge || '',
    isVerified: true,
  };
};

const getFocusableFieldId = (fieldName: string): string => {
  // For the select elements, focus the toggle button
  if (SELECT_FIELDS.find((item) => item === fieldName)) {
    return `${fieldName}-input`;
  }

  return fieldName;
};

export const scrollToFirstError = (error: Yup.ValidationError) => {
  forEach(error.inner, (e) => {
    const field = document.getElementById(getFocusableFieldId(e.path));

    /* istanbul ignore else */
    if (field) {
      field.focus();
      return false;
    }
  });
};

export const showErrors = (
  error: Yup.ValidationError,
  setErrors: (errors: FormikErrors<EventFormFields>) => void,
  setTouched: (
    touched: FormikTouched<EventFormFields>,
    shouldValidate?: boolean
  ) => void
) => {
  /* istanbul ignore else */
  if (error.name === 'ValidationError') {
    const newErrors = error.inner.reduce(
      (acc: object, e: Yup.ValidationError) => set(acc, e.path, e.errors[0]),
      {}
    );
    const touchedFields = error.inner.reduce(
      (acc: object, e: Yup.ValidationError) => set(acc, e.path, true),
      {}
    );

    setErrors(newErrors);
    setTouched(touchedFields);
    scrollToFirstError(error);
  }
};

const getSubEvents = async ({
  event,
  apolloClient,
}: {
  apolloClient: ApolloClient<object>;
  event: EventFieldsFragment;
}) => {
  const subEvents: EventFieldsFragment[] = [];

  const id = event.id;
  const variables = {
    createPath: getPathBuilder(eventsPathBuilder),
    include: EVENT_INCLUDES,
    pageSize: MAX_PAGE_SIZE,
    showAll: true,
    sort: EVENT_SORT_OPTIONS.START_TIME,
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
      query: EventsDocument,
      variables: { ...variables, page: nextPage },
    });

    subEvents.push(...(data.events.data as EventFieldsFragment[]));

    nextPage = getNextPage(data.events.meta);
  }

  // Check is subEvent a super event and recursively add it's sub events if needed
  for (const subEvent of subEvents) {
    if (subEvent.superEventType) {
      const subSubEvents = await getSubEvents({
        apolloClient,
        event: subEvent,
      });
      subEvents.push(...subSubEvents);
    }
  }

  return subEvents;
};

export const getRelatedEvents = async ({
  event,
  apolloClient,
}: {
  apolloClient: ApolloClient<object>;
  event: EventFieldsFragment;
}): Promise<EventFieldsFragment[]> => {
  const subEvents = event.subEvents;
  const allRelatedEvents: EventFieldsFragment[] = [event];

  for (const subEvent of subEvents) {
    const subSubEvents = await getSubEvents({
      apolloClient,
      event: subEvent as EventFieldsFragment,
    });
    allRelatedEvents.push(subEvent as EventFieldsFragment);
    allRelatedEvents.push(...subSubEvents);
  }

  return allRelatedEvents;
};
