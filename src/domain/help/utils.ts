import { User } from 'oidc-client';

import { CONTACT_FORM_SELECT_FIELDS, initialValues } from './constants';
import { ContactFormFields } from './types';

export const getFocusableFieldId = (fieldName: string): string => {
  // For the select elements, focus the toggle button
  if (CONTACT_FORM_SELECT_FIELDS.find((item) => item === fieldName)) {
    return `${fieldName}-toggle-button`;
  }

  return fieldName;
};

export const getInitialValues = (user?: User): ContactFormFields =>
  user
    ? {
        ...initialValues,
        name: user.profile.name ?? /* istanbul ignore next */ '',
        email: user.profile.email ?? /* istanbul ignore next */ '',
      }
    : initialValues;
