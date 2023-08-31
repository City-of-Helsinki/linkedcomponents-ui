import { TFunction } from 'i18next';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/types';
import { DATE_FORMAT_API } from '../../constants';
import {
  OrganizationFieldsFragment,
  RegistrationFieldsFragment,
  SignupQueryVariables,
  UpdateEnrolmentMutationInput,
  UserFieldsFragment,
} from '../../generated/graphql';
import { Editability, PathBuilderProps } from '../../types';
import formatDate from '../../utils/formatDate';
import getValue from '../../utils/getValue';
import { isAdminUserInOrganization } from '../organization/utils';
import { NOTIFICATION_TYPE } from '../signupGroup/constants';
import { SignupGroupFormFields } from '../signupGroup/types';
import {
  AUTHENTICATION_NOT_NEEDED,
  SIGNUP_ACTIONS,
  SIGNUP_ICONS,
  SIGNUP_LABEL_KEYS,
} from './constants';

export const getUpdateEnrolmentPayload = ({
  formValues,
  id,
  registration,
}: {
  formValues: SignupGroupFormFields;
  id: string;
  registration: RegistrationFieldsFragment;
}): UpdateEnrolmentMutationInput => {
  const {
    email,
    extraInfo,
    membershipNumber,
    nativeLanguage,
    phoneNumber,
    serviceLanguage,
    signups,
  } = formValues;
  const { city, dateOfBirth, firstName, lastName, streetAddress, zipcode } =
    signups[0] || {};

  return {
    id,
    city: getValue(city, ''),
    dateOfBirth: dateOfBirth ? formatDate(dateOfBirth, DATE_FORMAT_API) : null,
    email: getValue(email, null),
    extraInfo: extraInfo,
    firstName: getValue(firstName, ''),
    lastName: getValue(lastName, ''),
    membershipNumber: membershipNumber,
    nativeLanguage: getValue(nativeLanguage, null),
    // TODO: At the moment only email notifications are supported
    notifications: NOTIFICATION_TYPE.EMAIL,
    // notifications: getEnrolmentNotificationsCode(notifications),
    phoneNumber: getValue(phoneNumber, null),
    registration: getValue(registration.id, ''),
    serviceLanguage: getValue(serviceLanguage, null),
    streetAddress: getValue(streetAddress, null),
    zipcode: getValue(zipcode, null),
  };
};

export const enrolmentPathBuilder = ({
  args,
}: PathBuilderProps<SignupQueryVariables>): string => {
  const { id } = args;

  return `/signup/${id}/`;
};

export const checkCanUserDoAction = ({
  action,
  organizationAncestors,
  publisher,
  user,
}: {
  action: SIGNUP_ACTIONS;
  organizationAncestors: OrganizationFieldsFragment[];
  publisher: string;
  user?: UserFieldsFragment;
}): boolean => {
  const isAdminUser = isAdminUserInOrganization({
    id: publisher,
    organizationAncestors,
    user,
  });

  switch (action) {
    case SIGNUP_ACTIONS.EDIT:
      return true;
    case SIGNUP_ACTIONS.CANCEL:
    case SIGNUP_ACTIONS.CREATE:
    case SIGNUP_ACTIONS.SEND_MESSAGE:
    case SIGNUP_ACTIONS.UPDATE:
    case SIGNUP_ACTIONS.VIEW:
      return isAdminUser;
  }
};

export const getEditEnrolmentWarning = ({
  action,
  authenticated,
  t,
  userCanDoAction,
}: {
  action: SIGNUP_ACTIONS;
  authenticated: boolean;
  t: TFunction;
  userCanDoAction: boolean;
}): string => {
  if (AUTHENTICATION_NOT_NEEDED.includes(action)) {
    return '';
  }

  if (!authenticated) {
    return t('authentication.noRightsUpdateSignup');
  }

  if (!userCanDoAction) {
    switch (action) {
      case SIGNUP_ACTIONS.CREATE:
        return t('signupsPage.warningNoRightsToCreate');
      case SIGNUP_ACTIONS.VIEW:
        return t('signupsPage.warningNoRightsToView');
      default:
        return t('signupsPage.warningNoRightsToEdit');
    }
  }

  return '';
};

export const checkIsEditActionAllowed = ({
  action,
  authenticated,
  organizationAncestors,
  publisher,
  t,
  user,
}: {
  action: SIGNUP_ACTIONS;
  authenticated: boolean;
  organizationAncestors: OrganizationFieldsFragment[];
  publisher: string;
  t: TFunction;
  user?: UserFieldsFragment;
}): Editability => {
  const userCanDoAction = checkCanUserDoAction({
    action,
    organizationAncestors,
    publisher,
    user,
  });

  const warning = getEditEnrolmentWarning({
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
  organizationAncestors,
  publisher,
  t,
  user,
}: {
  action: SIGNUP_ACTIONS;
  authenticated: boolean;
  onClick: () => void;
  organizationAncestors: OrganizationFieldsFragment[];
  publisher: string;
  t: TFunction;
  user?: UserFieldsFragment;
}): MenuItemOptionProps => {
  const { editable, warning } = checkIsEditActionAllowed({
    action,
    authenticated,
    organizationAncestors,
    publisher,
    t,
    user,
  });

  return {
    disabled: !editable,
    icon: SIGNUP_ICONS[action],
    label: t(SIGNUP_LABEL_KEYS[action]),
    onClick,
    title: warning,
  };
};
