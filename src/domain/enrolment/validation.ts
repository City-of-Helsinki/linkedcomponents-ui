import { FormikErrors, FormikTouched } from 'formik';
import forEach from 'lodash/forEach';
import set from 'lodash/set';
import { scroller } from 'react-scroll';
import * as Yup from 'yup';

import {
  createMinErrorMessage,
  isValidPhoneNumber,
  isValidZip,
} from '../../utils/validationUtils';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import {
  ENROLMENT_FIELDS,
  ENROLMENT_FORM_SELECT_FIELDS,
  NOTIFICATIONS,
} from './constants';
import { EnrolmentFormFields } from './types';

export const enrolmentSchema = Yup.object().shape({
  [ENROLMENT_FIELDS.NAME]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
  [ENROLMENT_FIELDS.STREET_ADDRESS]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
  [ENROLMENT_FIELDS.YEAR_OF_BIRTH]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
  [ENROLMENT_FIELDS.ZIP]: Yup.string()
    .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    .test(
      'isValidZip',
      VALIDATION_MESSAGE_KEYS.ZIP,
      (value) => !value || isValidZip(value)
    ),
  [ENROLMENT_FIELDS.CITY]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
  [ENROLMENT_FIELDS.EMAIL]: Yup.string()
    .email(VALIDATION_MESSAGE_KEYS.EMAIL)
    .when(
      [ENROLMENT_FIELDS.NOTIFICATIONS],
      (notifications: string[], schema) => {
        return notifications.includes(NOTIFICATIONS.EMAIL)
          ? schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
          : schema;
      }
    ),
  [ENROLMENT_FIELDS.PHONE_NUMBER]: Yup.string()
    .test(
      'isValidPhoneNumber',
      VALIDATION_MESSAGE_KEYS.PHONE,
      (value) => !value || isValidPhoneNumber(value)
    )
    .when(
      [ENROLMENT_FIELDS.NOTIFICATIONS],
      (notifications: string[], schema) => {
        return notifications.includes(NOTIFICATIONS.PHONE)
          ? schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
          : schema;
      }
    ),
  [ENROLMENT_FIELDS.NOTIFICATIONS]: Yup.array()
    .required(VALIDATION_MESSAGE_KEYS.ARRAY_REQUIRED)
    .min(1, (param) =>
      createMinErrorMessage(param, VALIDATION_MESSAGE_KEYS.ARRAY_MIN)
    ),
  [ENROLMENT_FIELDS.NOTIFICATION_LANGUAGE]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
  [ENROLMENT_FIELDS.NATIVE_LANGUAGE]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
  [ENROLMENT_FIELDS.SERVICE_LANGUAGE]: Yup.string().required(
    VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
  ),
});

// This functions sets formik errors and touched values correctly after validation.
// The reason for this is to show all errors after validating the form.
// Errors are shown only for touched fields so set all fields with error touched
export const showErrors = ({
  error,
  setErrors,
  setTouched,
}: {
  error: Yup.ValidationError;
  setErrors: (errors: FormikErrors<EnrolmentFormFields>) => void;
  setTouched: (
    touched: FormikTouched<EnrolmentFormFields>,
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
  }
};

const getFocusableFieldId = (
  fieldName: string
): {
  fieldId: string;
  fieldType: 'default' | 'checkboxGroup' | 'select';
} => {
  // For the select elements, focus the toggle button
  if (ENROLMENT_FORM_SELECT_FIELDS.find((item) => item === fieldName)) {
    return { fieldId: `${fieldName}-toggle-button`, fieldType: 'select' };
  } else if (fieldName === ENROLMENT_FIELDS.NOTIFICATIONS) {
    return { fieldId: fieldName, fieldType: 'checkboxGroup' };
  }
  return { fieldId: fieldName, fieldType: 'default' };
};

export const scrollToFirstError = ({
  error,
}: {
  error: Yup.ValidationError;
}): void => {
  forEach(error.inner, (e) => {
    const path = e.path ?? /* istanbul ignore next */ '';
    const { fieldId, fieldType } = getFocusableFieldId(path);
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
      } else {
        field.focus();
      }

      return false;
    }
  });
};
