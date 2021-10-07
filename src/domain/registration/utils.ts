import { FormikState } from 'formik';
import { TFunction } from 'i18next';
import { scroller } from 'react-scroll';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/MenuItem';
import { FORM_NAMES } from '../../constants';
import { Registration } from '../../generated/graphql';
import getPageHeaderHeight from '../../utils/getPageHeaderHeight';
import setFocusToFirstFocusable from '../../utils/setFocusToFirstFocusable';
import {
  AUTHENTICATION_NOT_NEEDED,
  REGISTRATION_EDIT_ACTIONS,
  REGISTRATION_EDIT_ICONS,
  REGISTRATION_EDIT_LABEL_KEYS,
} from '../registrations/constants';
import { REGISTRATION_FIELDS, REGISTRATION_INITIAL_VALUES } from './constants';
import { RegistrationFormFields } from './types';

export const clearRegistrationFormData = (): void => {
  sessionStorage.removeItem(FORM_NAMES.REGISTRATION_FORM);
};

// TODO: Check also user organizations when API is available
export const isCreateRegistrationButtonDisabled = ({
  authenticated,
}: {
  authenticated: boolean;
}): boolean => {
  return !authenticated;
};

// TODO: Check also user organizations when API is available
export const getCreateRegistrationButtonWarning = ({
  authenticated,
  t,
}: {
  authenticated: boolean;
  t: TFunction;
}): string => {
  if (!authenticated) {
    return t('registration.form.buttonPanel.warningNotAuthenticated');
  }

  return '';
};

type RegistrationEditability = {
  editable: boolean;
  warning: string;
};

// TODO: Check also user organizations when API is available e.g. similar funtion in events
export const checkCanUserDoAction = ({
  action,
}: {
  action: REGISTRATION_EDIT_ACTIONS;
}): boolean => {
  switch (action) {
    case REGISTRATION_EDIT_ACTIONS.COPY:
    case REGISTRATION_EDIT_ACTIONS.DELETE:
    case REGISTRATION_EDIT_ACTIONS.EDIT:
    case REGISTRATION_EDIT_ACTIONS.SHOW_ENROLMENTS:
    case REGISTRATION_EDIT_ACTIONS.UPDATE:
      return true;
  }
};

export const getEditRegistrationWarning = ({
  action,
  authenticated,
  t,
  userCanDoAction,
}: {
  action: REGISTRATION_EDIT_ACTIONS;
  authenticated: boolean;
  t: TFunction;
  userCanDoAction: boolean;
}): string => {
  if (AUTHENTICATION_NOT_NEEDED.includes(action)) {
    return '';
  }

  if (!authenticated) {
    return t('authentication.noRightsUpdateRegistration');
  }

  if (!userCanDoAction) {
    return t('registration.form.editButtonPanel.warningNoRightsToEdit');
  }

  return '';
};

export const checkIsEditActionAllowed = ({
  action,
  authenticated,
  registration,
  t,
}: {
  action: REGISTRATION_EDIT_ACTIONS;
  authenticated: boolean;
  registration: Registration;
  t: TFunction;
}): RegistrationEditability => {
  const userCanDoAction = checkCanUserDoAction({ action });

  const warning = getEditRegistrationWarning({
    action,
    authenticated,
    t,
    userCanDoAction,
  });

  return { editable: !warning, warning };
};

export const getEditButtonProps = ({
  action,
  authenticated,
  onClick,
  registration,
  t,
}: {
  action: REGISTRATION_EDIT_ACTIONS;
  authenticated: boolean;
  onClick: () => void;
  registration: Registration;
  t: TFunction;
}): MenuItemOptionProps => {
  const { editable, warning } = checkIsEditActionAllowed({
    action,
    authenticated,
    registration,
    t,
  });

  return {
    disabled: !editable,
    icon: REGISTRATION_EDIT_ICONS[action],
    label: t(REGISTRATION_EDIT_LABEL_KEYS[action]),
    onClick,
    title: warning,
  };
};

export const getRegistrationInitialValues = (
  registration: Registration
): RegistrationFormFields => {
  return {
    ...REGISTRATION_INITIAL_VALUES,
    [REGISTRATION_FIELDS.AUDIENCE_MAX_AGE]: registration.audienceMaxAge ?? '',
    [REGISTRATION_FIELDS.AUDIENCE_MIN_AGE]: registration.audienceMinAge ?? '',
    [REGISTRATION_FIELDS.CONFIRMATION_MESSAGE]:
      registration.confirmationMessage ?? '',
    [REGISTRATION_FIELDS.ENROLMENT_END_TIME]: registration.enrolmentEndTime
      ? new Date(registration.enrolmentEndTime)
      : null,
    [REGISTRATION_FIELDS.ENROLMENT_START_TIME]: registration.enrolmentStartTime
      ? new Date(registration.enrolmentStartTime)
      : null,
    [REGISTRATION_FIELDS.INSTRUCTIONS]: registration.instructions ?? '',
    [REGISTRATION_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]:
      registration.maximumAttendeeCapacity ?? '',
    [REGISTRATION_FIELDS.MINIMUM_ATTENDEE_CAPACITY]:
      registration.minimumAttendeeCapacity ?? '',
    [REGISTRATION_FIELDS.WAITING_ATTENDEE_CAPACITY]:
      registration.waitingAttendeeCapacity ?? '',
  };
};

export const copyRegistrationToSessionStorage = async (
  registration: Registration
): Promise<void> => {
  const state: FormikState<RegistrationFormFields> = {
    errors: {},
    isSubmitting: false,
    isValidating: false,
    submitCount: 0,
    touched: {},
    values: {
      ...getRegistrationInitialValues(registration),
    },
  };

  sessionStorage.setItem(FORM_NAMES.REGISTRATION_FORM, JSON.stringify(state));
};

export const getRegistrationItemId = (id: string): string =>
  `registration-item-${id}`;

export const scrollToRegistrationItem = (id: string): void => {
  const offset = 24;
  const duration = 300;

  scroller.scrollTo(id, {
    delay: 50,
    duration: 300,
    offset: 0 - (getPageHeaderHeight() + offset),
    smooth: true,
  });

  setTimeout(() => setFocusToFirstFocusable(id), duration);
};
