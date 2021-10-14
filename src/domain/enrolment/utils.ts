import { Enrolment, Notification } from '../../generated/graphql';
import { ENROLMENT_INITIAL_VALUES } from './constants';
import { EnrolmentFormFields } from './types';

export const getEnrolmentInitialValues = (
  enrolment: Enrolment
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
    notifications:
      enrolment.notifications?.filter((item) =>
        Object.values(Notification).includes(item)
      ) ?? [],
    notificationLanguage: enrolment.notificationLanguage ?? '',
    membershipNumber: enrolment.membershipNumber ?? '',
    nativeLanguage: enrolment.nativeLanguage ?? '',
    serviceLanguage: enrolment.serviceLanguage ?? '',
    extraInfo: enrolment.extraInfo ?? '',
  };
};
