import {
  CreateEnrolmentMutationInput,
  EnrolmentFieldsFragment,
  EnrolmentQueryVariables,
  RegistrationFieldsFragment,
} from '../../generated/graphql';
import { PathBuilderProps } from '../../types';
import formatDate from '../../utils/formatDate';
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
