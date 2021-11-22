import {
  CreateEnrolmentMutationInput,
  EnrolmentFieldsFragment,
  EnrolmentQueryVariables,
  RegistrationFieldsFragment,
} from '../../generated/graphql';
import { PathBuilderProps } from '../../types';
import { ENROLMENT_INITIAL_VALUES, NOTIFICATIONS } from './constants';
import { EnrolmentFormFields } from './types';

export const getEnrolmentNotificationTypes = (
  notifications: number
): NOTIFICATIONS[] => {
  switch (notifications) {
    case 1:
      return [NOTIFICATIONS.SMS];
    case 2:
      return [NOTIFICATIONS.EMAIL];
    case 3:
      return [NOTIFICATIONS.EMAIL, NOTIFICATIONS.SMS];
    case 0:
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
    streetAddress: enrolment.streetAddress ?? '',
    yearOfBirth: enrolment.yearOfBirth ?? '',
    zip: enrolment.zip ?? '',
    city: enrolment.city ?? '',
    email: enrolment.email ?? '',
    phoneNumber: enrolment.phoneNumber ?? '',
    notifications: getEnrolmentNotificationTypes(
      enrolment.notifications as number
    ),
    notificationLanguage: enrolment.notificationLanguage ?? '',
    membershipNumber: enrolment.membershipNumber ?? '',
    nativeLanguage: enrolment.nativeLanguage ?? '',
    serviceLanguage: enrolment.serviceLanguage ?? '',
    extraInfo: enrolment.extraInfo ?? '',
  };
};

export const getEnrolmentNotificationsCode = (
  notifications: string[]
): number => {
  if (
    notifications.includes(NOTIFICATIONS.EMAIL) &&
    notifications.includes(NOTIFICATIONS.SMS)
  ) {
    return 3;
  } else if (notifications.includes(NOTIFICATIONS.EMAIL)) {
    return 2;
  } else if (notifications.includes(NOTIFICATIONS.SMS)) {
    return 1;
  } else {
    return 0;
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
    extraInfo: extraInfo || null,
    membershipNumber: membershipNumber || null,
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
