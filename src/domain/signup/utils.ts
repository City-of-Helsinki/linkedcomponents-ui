import { DATE_FORMAT_API } from '../../constants';
import {
  AttendeeStatus,
  RegistrationFieldsFragment,
  SignupFieldsFragment,
  UpdateSignupMutationInput,
} from '../../generated/graphql';
import formatDate from '../../utils/formatDate';
import getDateFromString from '../../utils/getDateFromString';
import getValue from '../../utils/getValue';
import { NOTIFICATION_TYPE, NOTIFICATIONS } from '../signupGroup/constants';
import { SignupFormFields, SignupGroupFormFields } from '../signupGroup/types';

export const getUpdateSignupPayload = ({
  formValues,
  id,
  registration,
}: {
  formValues: SignupGroupFormFields;
  id: string;
  registration: RegistrationFieldsFragment;
}): UpdateSignupMutationInput => {
  const {
    email,
    membershipNumber,
    nativeLanguage,
    phoneNumber,
    serviceLanguage,
    signups,
  } = formValues;
  const {
    city,
    dateOfBirth,
    extraInfo,
    firstName,
    lastName,
    responsibleForGroup,
    streetAddress,
    zipcode,
  } = signups[0] || {};

  return {
    id,
    city: getValue(city, ''),
    dateOfBirth: dateOfBirth ? formatDate(dateOfBirth, DATE_FORMAT_API) : null,
    email: getValue(email, null),
    extraInfo: getValue(extraInfo, ''),
    firstName: getValue(firstName, ''),
    lastName: getValue(lastName, ''),
    membershipNumber: membershipNumber,
    nativeLanguage: getValue(nativeLanguage, null),
    notifications: NOTIFICATION_TYPE.EMAIL,
    phoneNumber: getValue(phoneNumber, null),
    registration: getValue(registration.id, ''),
    responsibleForGroup: !!responsibleForGroup,
    serviceLanguage: getValue(serviceLanguage, null),
    streetAddress: getValue(streetAddress, null),
    zipcode: getValue(zipcode, null),
  };
};

export const getSignupInitialValues = (
  signup: SignupFieldsFragment
): SignupFormFields => ({
  city: getValue(signup.city, ''),
  dateOfBirth: getDateFromString(signup.dateOfBirth),
  extraInfo: getValue(signup.extraInfo, ''),
  firstName: getValue(signup.firstName, ''),
  id: getValue(signup.id, null),
  inWaitingList: signup.attendeeStatus === AttendeeStatus.Waitlisted,
  lastName: getValue(signup.lastName, ''),
  responsibleForGroup: !!signup.responsibleForGroup,
  streetAddress: getValue(signup.streetAddress, ''),
  zipcode: getValue(signup.zipcode, ''),
});

export const getSignupGroupInitialValuesFromSignup = (
  signup: SignupFieldsFragment
): SignupGroupFormFields => {
  return {
    email: getValue(signup.email, ''),
    extraInfo: '',
    membershipNumber: getValue(signup.membershipNumber, ''),
    nativeLanguage: getValue(signup.nativeLanguage, ''),
    notifications: [NOTIFICATIONS.EMAIL],
    phoneNumber: getValue(signup.phoneNumber, ''),
    serviceLanguage: getValue(signup.serviceLanguage, ''),
    signups: [getSignupInitialValues(signup)],
  };
};
