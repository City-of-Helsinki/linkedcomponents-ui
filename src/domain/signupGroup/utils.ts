import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import snakeCase from 'lodash/snakeCase';

import { DATE_FORMAT_API, FORM_NAMES } from '../../constants';
import {
  ContactPersonFieldsFragment,
  ContactPersonInput,
  CreateSignupGroupMutationInput,
  RegistrationFieldsFragment,
  SeatsReservationFieldsFragment,
  SignupFieldsFragment,
  SignupGroupFieldsFragment,
  SignupInput,
  UpdateSignupGroupMutationInput,
} from '../../generated/graphql';
import formatDate from '../../utils/formatDate';
import getValue from '../../utils/getValue';
import skipFalsyType from '../../utils/skipFalsyType';
import {
  getSeatsReservationData,
  isSeatsReservationExpired,
} from '../seatsReservation/utils';
import {
  getSignupInitialValues,
  omitSensitiveDataFromContactPerson,
  omitSensitiveDataFromSignupPayload,
} from '../signup/utils';
import { signupGroup } from './__mocks__/editSignupGroupPage';
import {
  CONTACT_PERSON_FIELDS,
  NOTIFICATION_TYPE,
  NOTIFICATIONS,
  SIGNUP_FIELDS,
  SIGNUP_GROUP_FIELDS,
  SIGNUP_GROUP_INITIAL_VALUES,
  SIGNUP_INITIAL_VALUES,
} from './constants';
import {
  ContactPersonFormFields,
  SignupFormFields,
  SignupGroupFormFields,
} from './types';

export const getSignupNotificationTypes = (
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

export const getSignupNotificationsCode = (notifications: string[]): string => {
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

export const getSignupDefaultInitialValues = (): SignupFormFields => ({
  ...SIGNUP_INITIAL_VALUES,
});

export const getSignupGroupDefaultInitialValues =
  (): SignupGroupFormFields => ({
    ...SIGNUP_GROUP_INITIAL_VALUES,
    signups: [getSignupDefaultInitialValues()],
  });

export const getContactPersonInitialValues = (
  contactPerson: Partial<ContactPersonFieldsFragment>
): ContactPersonFormFields => ({
  email: getValue(contactPerson.email, ''),
  firstName: getValue(contactPerson.firstName, ''),
  id: getValue(contactPerson.id, null),
  lastName: getValue(contactPerson.lastName, ''),
  membershipNumber: getValue(contactPerson.membershipNumber, ''),
  nativeLanguage: getValue(contactPerson.nativeLanguage, ''),
  notifications: [NOTIFICATIONS.EMAIL],
  phoneNumber: getValue(contactPerson.phoneNumber, ''),
  serviceLanguage: getValue(contactPerson.serviceLanguage, ''),
});

export const getSignupGroupInitialValues = (
  signupGroup: SignupGroupFieldsFragment
): SignupGroupFormFields => {
  const signups: SignupFieldsFragment[] = (
    signupGroup.signups ?? /* istanbul ignore next */ []
  ).filter(skipFalsyType);
  return {
    contactPerson: getContactPersonInitialValues(
      signupGroup.contactPerson ?? {}
    ),
    extraInfo: getValue(signupGroup.extraInfo, ''),
    signups: signups.map((su) => getSignupInitialValues(su)),
  };
};

export const getContactPersonPayload = (
  formValues: ContactPersonFormFields
): ContactPersonInput => {
  const {
    email,
    nativeLanguage,
    notifications,
    phoneNumber,
    serviceLanguage,
    ...rest
  } = formValues;

  return {
    ...rest,
    email: getValue(email, null),
    nativeLanguage: getValue(nativeLanguage, null),
    notifications: getSignupNotificationsCode(notifications),
    phoneNumber: getValue(phoneNumber, null),
    serviceLanguage: getValue(serviceLanguage, null),
  };
};

export const getSignupGroupPayload = ({
  formValues,
  registration,
  reservationCode,
}: {
  formValues: SignupGroupFormFields;
  registration: RegistrationFieldsFragment;
  reservationCode: string;
}): CreateSignupGroupMutationInput => {
  const {
    contactPerson,
    extraInfo: groupExtraInfo,
    signups: signupsValues,
  } = formValues;

  const signups: SignupInput[] = signupsValues.map((signup, index) => {
    const {
      city,
      dateOfBirth,
      extraInfo,
      firstName,
      lastName,
      streetAddress,
      zipcode,
    } = signup;
    return {
      city: getValue(city, ''),
      dateOfBirth: dateOfBirth
        ? formatDate(new Date(dateOfBirth), DATE_FORMAT_API)
        : null,
      extraInfo,
      firstName: getValue(firstName, ''),
      lastName: getValue(lastName, ''),
      streetAddress: getValue(streetAddress, null),
      zipcode: getValue(zipcode, null),
    };
  });

  return {
    contactPerson: getContactPersonPayload(contactPerson),
    extraInfo: groupExtraInfo,
    registration: registration.id,
    reservationCode,
    signups,
  };
};

export const getUpdateSignupGroupPayload = ({
  formValues,
  registration,
}: {
  formValues: SignupGroupFormFields;
  registration: RegistrationFieldsFragment;
}): UpdateSignupGroupMutationInput => {
  const {
    contactPerson,
    extraInfo: groupExtraInfo,
    signups: signupsValues,
  } = formValues;

  const signups: SignupInput[] = signupsValues.map((signup, index) => {
    const {
      city,
      dateOfBirth,
      extraInfo,
      firstName,
      id,
      lastName,
      streetAddress,
      zipcode,
    } = signup;

    return {
      city: getValue(city, ''),
      dateOfBirth: dateOfBirth
        ? formatDate(new Date(dateOfBirth), DATE_FORMAT_API)
        : null,
      extraInfo,
      firstName: getValue(firstName, ''),
      id,
      lastName: getValue(lastName, ''),
      streetAddress: getValue(streetAddress, null),
      zipcode: getValue(zipcode, null),
    };
  });

  return {
    contactPerson: getContactPersonPayload(contactPerson),
    extraInfo: groupExtraInfo,
    registration: registration.id,
    signups,
  };
};

export const getNewSignups = ({
  seatsReservation,
  signups,
}: {
  seatsReservation: SeatsReservationFieldsFragment;
  signups: SignupFormFields[];
}): SignupFormFields[] => {
  const { seats, inWaitlist } = seatsReservation;
  const signupInitialValues = getSignupDefaultInitialValues();
  const filledSignups = signups.filter((a) => !isEqual(a, signupInitialValues));
  return [
    ...filledSignups,
    ...Array(Math.max(seats - filledSignups.length, 0)).fill(
      signupInitialValues
    ),
  ]
    .slice(0, seats)
    .map((signup) => ({ ...signup, inWaitingList: inWaitlist }));
};

export const isSignupFieldRequired = (
  registration: RegistrationFieldsFragment,
  fieldId: SIGNUP_GROUP_FIELDS | SIGNUP_FIELDS | CONTACT_PERSON_FIELDS
): boolean =>
  Boolean(registration.mandatoryFields?.includes(snakeCase(fieldId)));

export const isDateOfBirthFieldRequired = (
  registration: RegistrationFieldsFragment
): boolean => {
  const { audienceMinAge, audienceMaxAge } = registration;

  return Boolean(audienceMaxAge || audienceMinAge);
};

export const clearCreateSignupGroupFormData = (
  registrationId: string
): void => {
  sessionStorage?.removeItem(
    `${FORM_NAMES.CREATE_SIGNUP_GROUP_FORM}-${registrationId}`
  );
};

export const isRestoringSignupGroupFormDataDisabled = ({
  registrationId,
  signup,
  signupGroup,
}: {
  registrationId: string;
  signup?: SignupFieldsFragment;
  signupGroup?: SignupGroupFieldsFragment;
}) => {
  const data = getSeatsReservationData(registrationId);

  return !!signup || !!signupGroup || !data || isSeatsReservationExpired(data);
};

export const omitSensitiveDataFromSignupGroupPayload = (
  payload: CreateSignupGroupMutationInput | UpdateSignupGroupMutationInput
): Partial<
  CreateSignupGroupMutationInput | UpdateSignupGroupMutationInput
> => ({
  ...omit(payload, ['extraInfo']),
  contactPerson: signupGroup.contactPerson
    ? omitSensitiveDataFromContactPerson(signupGroup.contactPerson)
    : signupGroup.contactPerson,
  signups: payload.signups
    ?.filter(skipFalsyType)
    .map((s) => omitSensitiveDataFromSignupPayload(s)),
});
