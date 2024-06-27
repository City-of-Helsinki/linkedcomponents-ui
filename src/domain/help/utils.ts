import { User } from 'oidc-client-ts';

import getValue from '../../utils/getValue';
import { getFocusableFieldId } from '../../utils/validationUtils';
import {
  ASK_PERMISSION_FORM_SELECT_FIELDS,
  askPermissionFormInitialValues,
  CONTACT_FORM_SELECT_FIELDS,
  contactFormInitialValues,
} from './constants';
import { AskPermissionFormFields, ContactFormFields } from './types';

export const getAskPermissionFormFocusableFieldId = (fieldName: string) =>
  getFocusableFieldId(fieldName, {
    arrayFields: [],
    checkboxGroupFields: [],
    comboboxFields: [],
    selectFields: ASK_PERMISSION_FORM_SELECT_FIELDS,
    textEditorFields: [],
  });

export const getContactFormFocusableFieldId = (fieldName: string) =>
  getFocusableFieldId(fieldName, {
    arrayFields: [],
    checkboxGroupFields: [],
    comboboxFields: [],
    selectFields: CONTACT_FORM_SELECT_FIELDS,
    textEditorFields: [],
  });

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
