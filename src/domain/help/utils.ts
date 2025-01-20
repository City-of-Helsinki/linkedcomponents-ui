import { User } from 'oidc-client-ts';

import getValue from '../../utils/getValue';
import { getFocusableFieldId } from '../../utils/validationUtils';
import {
  ASK_PERMISSION_FORM_COMBOBOX_FIELDS,
  askPermissionFormInitialValues,
  CONTACT_FORM_COMBOBOX_FIELDS,
  contactFormInitialValues,
} from './constants';
import { AskPermissionFormFields, ContactFormFields } from './types';

export const getAskPermissionFormFocusableFieldId = (fieldName: string) =>
  getFocusableFieldId(fieldName, {
    arrayFields: [],
    checkboxGroupFields: [],
    comboboxFields: ASK_PERMISSION_FORM_COMBOBOX_FIELDS,
    selectFields: [],
    textEditorFields: [],
  });

export const getContactFormFocusableFieldId = (fieldName: string) =>
  getFocusableFieldId(fieldName, {
    arrayFields: [],
    checkboxGroupFields: [],
    comboboxFields: CONTACT_FORM_COMBOBOX_FIELDS,
    selectFields: [],
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
