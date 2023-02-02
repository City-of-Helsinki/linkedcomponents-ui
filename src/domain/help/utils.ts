import { User } from 'oidc-client';

import getValue from '../../utils/getValue';
import {
  ASK_PERMISSION_FORM_SELECT_FIELDS,
  askPermissionFormInitialValues,
  CONTACT_FORM_SELECT_FIELDS,
  contactFormInitialValues,
} from './constants';
import { AskPermissionFormFields, ContactFormFields } from './types';

export const getAskPermissionFormFocusableFieldId = (
  fieldName: string
): string => {
  // For the select elements, focus the toggle button
  if (ASK_PERMISSION_FORM_SELECT_FIELDS.find((item) => item === fieldName)) {
    return `${fieldName}-toggle-button`;
  }

  return fieldName;
};

export const getContactFormFocusableFieldId = (fieldName: string): string => {
  // For the select elements, focus the toggle button
  if (CONTACT_FORM_SELECT_FIELDS.find((item) => item === fieldName)) {
    return `${fieldName}-toggle-button`;
  }

  return fieldName;
};

export const getAskPermissionFormInitialValues = (
  user: User | null
): AskPermissionFormFields =>
  user
    ? {
        ...askPermissionFormInitialValues,
        name: getValue(user.profile.name, ''),
        email: getValue(user.profile.email, ''),
      }
    : askPermissionFormInitialValues;

export const getContactFormInitialValues = (
  user: User | null
): ContactFormFields =>
  user
    ? {
        ...contactFormInitialValues,
        name: getValue(user.profile.name, ''),
        email: getValue(user.profile.email, ''),
      }
    : contactFormInitialValues;
