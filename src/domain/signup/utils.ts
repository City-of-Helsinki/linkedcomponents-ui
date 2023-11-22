import omit from 'lodash/omit';

import { DATE_FORMAT_API } from '../../constants';
import {
  AttendeeStatus,
  ContactPersonInput,
  RegistrationFieldsFragment,
  SignupFieldsFragment,
  SignupGroupFieldsFragment,
  SignupInput,
  UpdateSignupMutationInput,
} from '../../generated/graphql';
import formatDate from '../../utils/formatDate';
import getDateFromString from '../../utils/getDateFromString';
import getValue from '../../utils/getValue';
import { SignupFormFields, SignupGroupFormFields } from '../signupGroup/types';
import {
  getContactPersonInitialValues,
  getContactPersonPayload,
} from '../signupGroup/utils';

export const getUpdateSignupPayload = ({
  formValues,
  hasSignupGroup,
  id,
  registration,
}: {
  formValues: SignupGroupFormFields;
  hasSignupGroup: boolean;
  id: string;
  registration: RegistrationFieldsFragment;
}): UpdateSignupMutationInput => {
  const { contactPerson, signups } = formValues;
  const {
    city,
    dateOfBirth,
    extraInfo,
    firstName,
    lastName,
    streetAddress,
    zipcode,
  } = signups[0] || {};

  return {
    id,
    city: getValue(city, ''),
    contactPerson: !hasSignupGroup
      ? getContactPersonPayload(contactPerson)
      : undefined,
    dateOfBirth: dateOfBirth ? formatDate(dateOfBirth, DATE_FORMAT_API) : null,
    extraInfo: getValue(extraInfo, ''),
    firstName: getValue(firstName, ''),
    lastName: getValue(lastName, ''),
    registration: getValue(registration.id, ''),
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
  streetAddress: getValue(signup.streetAddress, ''),
  zipcode: getValue(signup.zipcode, ''),
});

export const getSignupGroupInitialValuesFromSignup = (
  signup: SignupFieldsFragment,
  signupGroup?: SignupGroupFieldsFragment
): SignupGroupFormFields => {
  const contactPerson =
    signupGroup?.contactPerson ?? signup?.contactPerson ?? {};
  return {
    contactPerson: getContactPersonInitialValues(contactPerson),
    extraInfo: '',
    signups: [getSignupInitialValues(signup)],
  };
};

export const omitSensitiveDataFromContactPerson = (
  payload: ContactPersonInput
): Partial<ContactPersonInput> =>
  omit(payload, [
    '__typename',
    'email',
    'firstName',
    'lastName',
    'membershipNumber',
    'nativeLanguage',
    'phoneNumber',
    'serviceLanguage',
  ]);

export const omitSensitiveDataFromSignupPayload = (
  payload: SignupInput | UpdateSignupMutationInput
): Partial<SignupInput | UpdateSignupMutationInput> =>
  omit(
    {
      ...payload,
      contactPerson: payload.contactPerson
        ? omitSensitiveDataFromContactPerson(payload.contactPerson)
        : payload.contactPerson,
    },
    [
      '__typename',
      'city',
      'dateOfBirth',
      'extraInfo',
      'firstName',
      'lastName',
      'streetAddress',
      'zipcode',
    ]
  );
