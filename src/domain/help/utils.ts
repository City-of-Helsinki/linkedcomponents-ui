import forEach from 'lodash/forEach';
import { User } from 'oidc-client';
import { scroller } from 'react-scroll';
import * as Yup from 'yup';

import { VALIDATION_ERROR_SCROLLER_OPTIONS } from '../../constants';
import { CONTACT_FORM_SELECT_FIELDS, initialValues } from './constants';
import { ContactFormFields } from './types';

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
      scroller.scrollTo(fieldId, VALIDATION_ERROR_SCROLLER_OPTIONS);

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
