import * as Yup from 'yup';

import {
  createMinErrorMessage,
  isMinStartDate,
  transformNumber,
} from '../../utils/validationUtils';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import { REGISTRATION_FIELDS, REGISTRATION_SELECT_FIELDS } from './constants';

export const registrationSchema = Yup.object().shape({
  [REGISTRATION_FIELDS.EVENT]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .nullable(),
  [REGISTRATION_FIELDS.ENROLMENT_START_TIME]: Yup.date()
    .required(VALIDATION_MESSAGE_KEYS.DATE_REQUIRED)
    .nullable()
    .typeError(VALIDATION_MESSAGE_KEYS.DATE),
  [REGISTRATION_FIELDS.ENROLMENT_END_TIME]: Yup.date()
    .required(VALIDATION_MESSAGE_KEYS.DATE_REQUIRED)
    .nullable()
    .typeError(VALIDATION_MESSAGE_KEYS.DATE)
    // test that startsTime is before endsTime
    .when([REGISTRATION_FIELDS.ENROLMENT_START_TIME], isMinStartDate),

  [REGISTRATION_FIELDS.MINIMUM_ATTENDEE_CAPACITY]: Yup.number()
    .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
    .min(0, (param) =>
      createMinErrorMessage(param, VALIDATION_MESSAGE_KEYS.NUMBER_MIN)
    )
    .nullable()
    .transform(transformNumber),
  [REGISTRATION_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: Yup.number().when(
    [REGISTRATION_FIELDS.MINIMUM_ATTENDEE_CAPACITY],
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

  [REGISTRATION_FIELDS.WAITING_LIST_CAPACITY]: Yup.number()
    .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
    .min(0, (param) =>
      createMinErrorMessage(param, VALIDATION_MESSAGE_KEYS.NUMBER_MIN)
    )
    .nullable()
    .transform(transformNumber),

  [REGISTRATION_FIELDS.AUDIENCE_MIN_AGE]: Yup.number()
    .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
    .min(0, (param) =>
      createMinErrorMessage(param, VALIDATION_MESSAGE_KEYS.NUMBER_MIN)
    )
    .nullable()
    .transform(transformNumber),
  [REGISTRATION_FIELDS.AUDIENCE_MAX_AGE]: Yup.number()
    .integer(VALIDATION_MESSAGE_KEYS.NUMBER_INTEGER)
    .when(
      [REGISTRATION_FIELDS.AUDIENCE_MIN_AGE],
      (audienceMinAge: number, schema: Yup.NumberSchema) =>
        schema.min(audienceMinAge || 0, (param) =>
          createMinErrorMessage(param, VALIDATION_MESSAGE_KEYS.NUMBER_MIN)
        )
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
