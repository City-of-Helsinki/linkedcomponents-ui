import {
  CreateEnrolmentMutationInput,
  EnrolmentFieldsFragment,
  EnrolmentQueryVariables,
  RegistrationFieldsFragment,
} from '../../generated/graphql';
import { PathBuilderProps } from '../../types';
import {
  ENROLMENT_INITIAL_VALUES,
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

export const getEnrolmentInitialValues = (
  enrolment: EnrolmentFieldsFragment
): EnrolmentFormFields => {
  return {
    ...ENROLMENT_INITIAL_VALUES,
    name: enrolment.name ?? '',
    city: enrolment.city ?? '',
    email: enrolment.email ?? '',
    phoneNumber: enrolment.phoneNumber ?? '',
    notifications: getEnrolmentNotificationTypes(
      enrolment.notifications as string
    ),
    membershipNumber: enrolment.membershipNumber ?? '',
    extraInfo: enrolment.extraInfo ?? '',
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
    email,
    extraInfo,
    membershipNumber,
    name,
    notifications,
    phoneNumber,
  } = formValues;

  return {
    city: city || null,
    email: email || null,
    extraInfo: extraInfo,
    membershipNumber: membershipNumber,
    name: name || null,
    notifications: getEnrolmentNotificationsCode(notifications),
    phoneNumber: phoneNumber || null,
    registration: registration.id as string,
  };
};

export const enrolmentPathBuilder = ({
  args,
}: PathBuilderProps<EnrolmentQueryVariables>): string => {
  const { id } = args;

  return `/enrolment/${id}/`;
};
