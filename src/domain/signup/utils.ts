import omit from 'lodash/omit';

import { DATE_FORMAT_API } from '../../constants';
import {
  AttendeeStatus,
  ContactPersonInput,
  CreateSignupsMutationInput,
  RegistrationFieldsFragment,
  SignupFieldsFragment,
  SignupGroupFieldsFragment,
  SignupInput,
  UpdateSignupMutationInput,
} from '../../generated/graphql';
import { featureFlagUtils } from '../../utils/featureFlags';
import formatDate from '../../utils/formatDate';
import getDateFromString from '../../utils/getDateFromString';
import getValue from '../../utils/getValue';
import { SignupFormFields, SignupGroupFormFields } from '../signupGroup/types';
import {
  getContactPersonInitialValues,
  getContactPersonPayload,
} from '../signupGroup/utils';

export const getSignupPayload = ({
  signupData,
}: {
  signupData: SignupFormFields;
}): SignupInput => {
  const {
    city,
    dateOfBirth,
    extraInfo,
    firstName,
    id,
    lastName,
    phoneNumber,
    priceGroup,
    streetAddress,
    zipcode,
  } = signupData;
  return {
    city: getValue(city, ''),
    dateOfBirth: dateOfBirth ? formatDate(dateOfBirth, DATE_FORMAT_API) : null,
    extraInfo: getValue(extraInfo, ''),
    id: id ?? undefined,
    firstName: getValue(firstName, ''),
    lastName: getValue(lastName, ''),
    phoneNumber: getValue(phoneNumber, ''),
    ...(featureFlagUtils.isFeatureEnabled('WEB_STORE_INTEGRATION')
      ? {
          priceGroup: priceGroup
            ? { registrationPriceGroup: priceGroup }
            : undefined,
        }
      : {}),
    streetAddress: getValue(streetAddress, null),
    zipcode: getValue(zipcode, null),
  };
};

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
  const signupData = signups[0] ?? {};
  return {
    ...getSignupPayload({ signupData }),
    contactPerson: !hasSignupGroup
      ? getContactPersonPayload(contactPerson)
      : undefined,
    id,
    registration: registration.id,
  };
};

export const getCreateSignupsPayload = ({
  formValues,
  registration,
  reservationCode,
}: {
  formValues: SignupGroupFormFields;
  registration: RegistrationFieldsFragment;
  reservationCode: string;
}): CreateSignupsMutationInput => {
  const { contactPerson, signups: signupsValues } = formValues;

  const signups: SignupInput[] = signupsValues.map((signupData, index) => ({
    ...getSignupPayload({ signupData }),
    contactPerson: getContactPersonPayload(contactPerson),
  }));

  return {
    registration: registration.id,
    reservationCode,
    signups,
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
  phoneNumber: getValue(signup.phoneNumber, ''),
  priceGroup: getValue(
    signup.priceGroup?.registrationPriceGroup?.toString(),
    ''
  ),
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
      'phoneNumber',
      'streetAddress',
      'zipcode',
    ]
  );

export const omitSensitiveDataFromSignupsPayload = (
  payload: CreateSignupsMutationInput
) => ({
  ...payload,
  signups: payload.signups?.map((s) => omitSensitiveDataFromSignupPayload(s)),
});
