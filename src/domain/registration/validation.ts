import isBefore from 'date-fns/isBefore';
import * as Yup from 'yup';

import { DATETIME_FORMAT_2 } from '../../constants';
import formatDate from '../../utils/formatDate';
import parseDateText from '../../utils/parseDateText';
import {
  createNumberMinErrorMessage,
  isValidDate,
  isValidTime,
  transformNumber,
} from '../../utils/validationUtils';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import { REGISTRATION_FIELDS, REGISTRATION_SELECT_FIELDS } from './constants';

export const isAfterStartTime = (
  startDateStr: string,
  startTimeStr: string,
  endTimeStr: string,
  schema: Yup.StringSchema<string | null | undefined>
): Yup.StringSchema<string | null | undefined> => {
  /* istanbul ignore else */
  if (
    isValidDate(startDateStr) &&
    isValidTime(startTimeStr) &&
    isValidTime(endTimeStr)
  ) {
    const startDate = parseDateText(startDateStr, startTimeStr);

    return schema.test(
      'isAfterStartTime',
      () => ({
        key: VALIDATION_MESSAGE_KEYS.DATE_AFTER,
        after: formatDate(startDate, DATETIME_FORMAT_2),
      }),
      (endDateStr) => {
        if (endDateStr && isValidDate(endDateStr)) {
          const endDate = parseDateText(endDateStr, endTimeStr);

          return !isBefore(endDate, startDate);
        }
        return true;
      }
    );
  } else {
    return schema;
  }
};

export const registrationSchema = Yup.object().shape({
  [REGISTRATION_FIELDS.EVENT]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .nullable(),
  [REGISTRATION_FIELDS.ENROLMENT_START_TIME_DATE]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.DATE_REQUIRED)
    .test('isValidDate', VALIDATION_MESSAGE_KEYS.DATE, (value) =>
      isValidDate(value)
    ),
  [REGISTRATION_FIELDS.ENROLMENT_START_TIME_TIME]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.TIME_REQUIRED)
    .test(
      'isValidTime',
      VALIDATION_MESSAGE_KEYS.TIME,
      (value) => !!value && isValidTime(value)
    ),
  [REGISTRATION_FIELDS.ENROLMENT_END_TIME_DATE]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.DATE_REQUIRED)
    .test('isValidDate', VALIDATION_MESSAGE_KEYS.DATE, (value) =>
      isValidDate(value)
    )
    .when(
      [
        REGISTRATION_FIELDS.ENROLMENT_START_TIME_DATE,
        REGISTRATION_FIELDS.ENROLMENT_START_TIME_TIME,
        REGISTRATION_FIELDS.ENROLMENT_END_TIME_TIME,
      ],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      isAfterStartTime as any
    ),
  [REGISTRATION_FIELDS.ENROLMENT_END_TIME_TIME]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.TIME_REQUIRED)
    .test(
      'isValidTime',
      VALIDATION_MESSAGE_KEYS.TIME,
      (value) => !!value && isValidTime(value)
    ),
  [REGISTRATION_FIELDS.MINIMUM_ATTENDEE_CAPACITY]: Yup.number()
    .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
    .min(0, createNumberMinErrorMessage)
    .nullable()
    .transform(transformNumber),
  [REGISTRATION_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: Yup.number().when(
    [REGISTRATION_FIELDS.MINIMUM_ATTENDEE_CAPACITY],
    (minimumAttendeeCapacity: number) => {
      return Yup.number()
        .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
        .min(minimumAttendeeCapacity || 0, createNumberMinErrorMessage)
        .nullable()
        .transform(transformNumber);
    }
  ),

  [REGISTRATION_FIELDS.WAITING_LIST_CAPACITY]: Yup.number()
    .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
    .min(0, createNumberMinErrorMessage)
    .nullable()
    .transform(transformNumber),

  [REGISTRATION_FIELDS.AUDIENCE_MIN_AGE]: Yup.number()
    .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
    .min(0, createNumberMinErrorMessage)
    .nullable()
    .transform(transformNumber),
  [REGISTRATION_FIELDS.AUDIENCE_MAX_AGE]: Yup.number()
    .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
    .when(
      [REGISTRATION_FIELDS.AUDIENCE_MIN_AGE],
      (audienceMinAge: number, schema: Yup.NumberSchema) =>
        schema.min(audienceMinAge || 0, createNumberMinErrorMessage)
    )
    .nullable()
    .transform(transformNumber),
});

export const getFocusableFieldId = (fieldName: string): string => {
  if (REGISTRATION_SELECT_FIELDS.find((item) => item === fieldName)) {
    return `${fieldName}-input`;
  }
  return fieldName;
};
