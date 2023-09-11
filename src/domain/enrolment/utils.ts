import { DATE_FORMAT_API } from '../../constants';
import {
  RegistrationFieldsFragment,
  UpdateSignupMutationInput,
} from '../../generated/graphql';
import formatDate from '../../utils/formatDate';
import getValue from '../../utils/getValue';
import { NOTIFICATION_TYPE } from '../signupGroup/constants';
import { SignupGroupFormFields } from '../signupGroup/types';

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
    // notifications: getSignupNotificationsCode(notifications),
    phoneNumber: getValue(phoneNumber, null),
    registration: getValue(registration.id, ''),
    serviceLanguage: getValue(serviceLanguage, null),
    streetAddress: getValue(streetAddress, null),
    zipcode: getValue(zipcode, null),
  };
};
