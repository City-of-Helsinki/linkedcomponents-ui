import forEach from 'lodash/forEach';
import { scroller } from 'react-scroll';
import * as Yup from 'yup';

import { VALIDATION_ERROR_SCROLLER_OPTIONS } from '../../constants';
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

const getFocusableFieldId = (
  fieldName: string
): {
  fieldId: string;
  type: 'default' | 'select';
} => {
  if (REGISTRATION_SELECT_FIELDS.find((item) => item === fieldName)) {
    return { fieldId: `${fieldName}-input`, type: 'select' };
  }
  return { fieldId: fieldName, type: 'default' };
};

export const scrollToFirstError = ({
  error,
}: {
  error: Yup.ValidationError;
}): void => {
  forEach(error.inner, (e) => {
    const path = e.path ?? /* istanbul ignore next */ '';

    const { fieldId } = getFocusableFieldId(path);
    const field = document.getElementById(fieldId);

    /* istanbul ignore else */
    if (field) {
      scroller.scrollTo(fieldId, VALIDATION_ERROR_SCROLLER_OPTIONS);

      field.focus();

      return false;
    }
  });
};
