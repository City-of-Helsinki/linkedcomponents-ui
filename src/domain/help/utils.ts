import { FormikErrors, FormikTouched } from 'formik';
import forEach from 'lodash/forEach';
import set from 'lodash/set';
import { User } from 'oidc-client';
import { scroller } from 'react-scroll';
import * as Yup from 'yup';

import { CONTACT_FORM_SELECT_FIELDS, initialValues } from './constants';
import { ContactFormFields } from './types';

// This functions sets formik errors and touched values correctly after validation.
// The reason for this is to show all errors after validating the form.
// Errors are shown only for touched fields so set all fields with error touched
export const showErrors = ({
  error,
  setErrors,
  setTouched,
}: {
  error: Yup.ValidationError;
  setErrors: (errors: FormikErrors<ContactFormFields>) => void;
  setTouched: (
    touched: FormikTouched<ContactFormFields>,
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

const getFocusableFieldId = (fieldName: string): string => {
  // For the select elements, focus the toggle button
  if (CONTACT_FORM_SELECT_FIELDS.find((item) => item === fieldName)) {
    return `${fieldName}-toggle-button`;
  }

  return fieldName;
};

export const scrollToFirstError = ({
  error,
}: {
  error: Yup.ValidationError;
}): void => {
  forEach(error.inner, (e) => {
    const path = e.path ?? /* istanbul ignore next */ '';
    const fieldId = getFocusableFieldId(path);
    const field = document.getElementById(fieldId);

    /* istanbul ignore else */
    if (field) {
      scroller.scrollTo(fieldId, {
        delay: 0,
        duration: 500,
        offset: -200,
        smooth: true,
      });

      field.focus();
      return false;
    }
  });
};

export const getInitialValues = (user?: User): ContactFormFields =>
  user
    ? {
        ...initialValues,
        name: user.profile.name ?? /* istanbul ignore next */ '',
        email: user.profile.email ?? /* istanbul ignore next */ '',
      }
    : initialValues;
