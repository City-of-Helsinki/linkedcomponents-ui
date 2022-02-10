import { TFunction } from 'i18next';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/MenuItem';
import {
  CreateEnrolmentMutationInput,
  EnrolmentFieldsFragment,
  EnrolmentQueryVariables,
  OrganizationFieldsFragment,
  RegistrationFieldsFragment,
  UserFieldsFragment,
} from '../../generated/graphql';
import { Editability, PathBuilderProps } from '../../types';
import formatDate from '../../utils/formatDate';
import { isAdminUserInOrganization } from '../organization/utils';
import {
  AUTHENTICATION_NOT_NEEDED,
  ENROLMENT_ACTIONS,
  ENROLMENT_ICONS,
  ENROLMENT_INITIAL_VALUES,
  ENROLMENT_LABEL_KEYS,
  NOTIFICATION_TYPE,
  NOTIFICATIONS,
} from './constants';
import { EnrolmentFormFields } from './types';

export const getEnrolmentNotificationTypes = (
  notifications: string
): NOTIFICATIONS[] => {
  switch (notifications) {
    case NOTIFICATION_TYPE.SMS:
      return [NOTIFICATIONS.SMS];
    case NOTIFICATION_TYPE.EMAIL:
      return [NOTIFICATIONS.EMAIL];
    case NOTIFICATION_TYPE.SMS_EMAIL:
      return [NOTIFICATIONS.EMAIL, NOTIFICATIONS.SMS];
    default:
      return [];
  }
};

export const getEnrolmentDefaultInitialValues = (
  registration: RegistrationFieldsFragment
): EnrolmentFormFields => {
  return {
    ...ENROLMENT_INITIAL_VALUES,
    audienceMaxAge: registration.audienceMaxAge ?? null,
    audienceMinAge: registration.audienceMinAge ?? null,
  };
};

export const getEnrolmentInitialValues = (
  enrolment: EnrolmentFieldsFragment,
  registration: RegistrationFieldsFragment
): EnrolmentFormFields => {
  return {
    ...getEnrolmentDefaultInitialValues(registration),
    city: enrolment.city ?? '',
    dateOfBirth: enrolment.dateOfBirth ? new Date(enrolment.dateOfBirth) : null,
    email: enrolment.email ?? '',
    extraInfo: enrolment.extraInfo ?? '',
    membershipNumber: enrolment.membershipNumber ?? '',
    name: enrolment.name ?? '',
    nativeLanguage: enrolment.nativeLanguage ?? '',
    notifications: getEnrolmentNotificationTypes(
      enrolment.notifications as string
    ),
    phoneNumber: enrolment.phoneNumber ?? '',
    serviceLanguage: enrolment.serviceLanguage ?? '',
    streetAddress: enrolment.streetAddress ?? '',
    zip: enrolment.zipcode ?? '',
  };
};

export const getEnrolmentNotificationsCode = (
  notifications: string[]
): string => {
  if (
    notifications.includes(NOTIFICATIONS.EMAIL) &&
    notifications.includes(NOTIFICATIONS.SMS)
  ) {
    return NOTIFICATION_TYPE.SMS_EMAIL;
  } else if (notifications.includes(NOTIFICATIONS.EMAIL)) {
    return NOTIFICATION_TYPE.EMAIL;
  } else if (notifications.includes(NOTIFICATIONS.SMS)) {
    return NOTIFICATION_TYPE.SMS;
  } else {
    return NOTIFICATION_TYPE.NO_NOTIFICATION;
  }
};

export const getEnrolmentPayload = (
  formValues: EnrolmentFormFields,
  registration: RegistrationFieldsFragment
): CreateEnrolmentMutationInput => {
  const {
    city,
    dateOfBirth,
    email,
    extraInfo,
    membershipNumber,
    name,
    nativeLanguage,
    notifications,
    phoneNumber,
    serviceLanguage,
    streetAddress,
    zip,
  } = formValues;

  return {
    city: city || null,
    dateOfBirth: dateOfBirth ? formatDate(dateOfBirth, 'yyyy-MM-dd') : null,
    email: email || null,
    extraInfo: extraInfo,
    membershipNumber: membershipNumber,
    name: name || null,
    nativeLanguage: nativeLanguage || null,
    notifications: getEnrolmentNotificationsCode(notifications),
    phoneNumber: phoneNumber || null,
    registration: registration.id as string,
    serviceLanguage: serviceLanguage || null,
    streetAddress: streetAddress || null,
    zipcode: zip || null,
  };
};

export const enrolmentPathBuilder = ({
  args,
}: PathBuilderProps<EnrolmentQueryVariables>): string => {
  const { id } = args;

  return `/signup_edit/${id}/`;
};

export const checkCanUserDoAction = ({
  action,
  organizationAncestors,
  publisher,
  user,
}: {
  action: ENROLMENT_ACTIONS;
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
    case ENROLMENT_ACTIONS.EDIT:
      return true;
    case ENROLMENT_ACTIONS.CANCEL:
    case ENROLMENT_ACTIONS.CREATE:
    case ENROLMENT_ACTIONS.SEND_MESSAGE:
    case ENROLMENT_ACTIONS.UPDATE:
    case ENROLMENT_ACTIONS.VIEW:
      return isAdminUser;
  }
};

export const getEditEnrolmentWarning = ({
  action,
  authenticated,
  t,
  userCanDoAction,
}: {
  action: ENROLMENT_ACTIONS;
  authenticated: boolean;
  t: TFunction;
  userCanDoAction: boolean;
}): string => {
  if (AUTHENTICATION_NOT_NEEDED.includes(action)) {
    return '';
  }

  if (!authenticated) {
    return t('authentication.noRightsUpdateEnrolment');
  }

  if (!userCanDoAction) {
    switch (action) {
      case ENROLMENT_ACTIONS.CREATE:
        return t('enrolmentsPage.warningNoRightsToCreate');
      case ENROLMENT_ACTIONS.VIEW:
        return t('enrolmentsPage.warningNoRightsToView');
      default:
        return t('enrolmentsPage.warningNoRightsToEdit');
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
  action: ENROLMENT_ACTIONS;
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
  action: ENROLMENT_ACTIONS;
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
    icon: ENROLMENT_ICONS[action],
    label: t(ENROLMENT_LABEL_KEYS[action]),
    onClick,
    title: warning,
  };
};
