import isEqual from 'lodash/isEqual';
import snakeCase from 'lodash/snakeCase';

import { DATE_FORMAT_API, FORM_NAMES } from '../../constants';
import {
  AttendeeStatus,
  CreateSignupGroupMutationInput,
  RegistrationFieldsFragment,
  SeatsReservationFieldsFragment,
  SignupFieldsFragment,
  SignupGroupFieldsFragment,
  SignupInput,
  SignupQueryVariables,
  UpdateSignupGroupMutationInput,
} from '../../generated/graphql';
import { PathBuilderProps } from '../../types';
import formatDate from '../../utils/formatDate';
import getDateFromString from '../../utils/getDateFromString';
import getValue from '../../utils/getValue';
import skipFalsyType from '../../utils/skipFalsyType';
import {
  getSeatsReservationData,
  isSeatsReservationExpired,
} from '../seatsReservation/utils';
import {
  NOTIFICATION_TYPE,
  NOTIFICATIONS,
  SIGNUP_FIELDS,
  SIGNUP_GROUP_FIELDS,
  SIGNUP_GROUP_INITIAL_VALUES,
  SIGNUP_INITIAL_VALUES,
} from './constants';
import { SignupFields, SignupGroupFormFields } from './types';

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

export const getSignupDefaultInitialValues = (): SignupFields => ({
  ...SIGNUP_INITIAL_VALUES,
});

export const getSignupGroupDefaultInitialValues =
  (): SignupGroupFormFields => ({
    ...SIGNUP_GROUP_INITIAL_VALUES,
    signups: [getSignupDefaultInitialValues()],
  });

export const getSignupGroupInitialValues = (
  signupGroup: SignupGroupFieldsFragment
): SignupGroupFormFields => {
  const signups: SignupFieldsFragment[] = (signupGroup.signups ?? [])
    .filter(skipFalsyType)
    .sort((a: SignupFieldsFragment, b: SignupFieldsFragment) => {
      if (a.responsibleForGroup === b.responsibleForGroup) {
        return 0;
      }
      return a.responsibleForGroup === true ? -1 : 1;
    });

  const responsibleSignup =
    signups.find((su) => su.responsibleForGroup) ?? signups[0];

  return {
    email: getValue(responsibleSignup?.email, ''),
    extraInfo: getValue(signupGroup.extraInfo, ''),
    membershipNumber: getValue(responsibleSignup?.membershipNumber, ''),
    nativeLanguage: getValue(responsibleSignup?.nativeLanguage, ''),
    notifications: [NOTIFICATIONS.EMAIL],
    phoneNumber: getValue(responsibleSignup?.phoneNumber, ''),
    serviceLanguage: getValue(responsibleSignup?.serviceLanguage, ''),
    signups: signups.map((su, index) => ({
      city: getValue(su.city, ''),
      dateOfBirth: getDateFromString(su.dateOfBirth),
      extraInfo: getValue(su.extraInfo, ''),
      firstName: getValue(su.firstName, ''),
      id: getValue(su.id, null),
      inWaitingList: su.attendeeStatus === AttendeeStatus.Waitlisted,
      lastName: getValue(su.lastName, ''),
      responsibleForGroup: !!su.responsibleForGroup,
      streetAddress: getValue(su.streetAddress, ''),
      zipcode: getValue(su.zipcode, ''),
    })),
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
    email,
    extraInfo: groupExtraInfo,
    membershipNumber,
    nativeLanguage,
    notifications,
    phoneNumber,
    serviceLanguage,
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
      email: getValue(email, null),
      extraInfo,
      firstName: getValue(firstName, ''),
      lastName: getValue(lastName, ''),
      membershipNumber: membershipNumber,
      nativeLanguage: getValue(nativeLanguage, null),
      notifications: getSignupNotificationsCode(notifications),
      phoneNumber: getValue(phoneNumber, null),
      responsibleForGroup: index === 0,
      serviceLanguage: getValue(serviceLanguage, null),
      streetAddress: getValue(streetAddress, null),
      zipcode: getValue(zipcode, null),
    };
  });

  return {
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
    email,
    extraInfo: groupExtraInfo,
    membershipNumber,
    nativeLanguage,
    notifications,
    phoneNumber,
    serviceLanguage,
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
      responsibleForGroup,
      streetAddress,
      zipcode,
    } = signup;

    return {
      city: getValue(city, ''),
      dateOfBirth: dateOfBirth
        ? formatDate(new Date(dateOfBirth), DATE_FORMAT_API)
        : null,
      email: getValue(email, null),
      extraInfo,
      firstName: getValue(firstName, ''),
      id,
      lastName: getValue(lastName, ''),
      membershipNumber: membershipNumber,
      nativeLanguage: getValue(nativeLanguage, null),
      notifications: getSignupNotificationsCode(notifications),
      phoneNumber: getValue(phoneNumber, null),
      responsibleForGroup: index === 0 || responsibleForGroup,
      serviceLanguage: getValue(serviceLanguage, null),
      streetAddress: getValue(streetAddress, null),
      zipcode: getValue(zipcode, null),
    };
  });

  return {
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
  signups: SignupFields[];
}): SignupFields[] => {
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
  fieldId: SIGNUP_GROUP_FIELDS | SIGNUP_FIELDS
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
  signupGroup,
}: {
  registrationId: string;
  signupGroup?: SignupGroupFieldsFragment;
}) => {
  const data = getSeatsReservationData(registrationId);

  return !!signupGroup || !data || isSeatsReservationExpired(data);
};

export const getResponsiblePerson = (
  signupGroup: SignupGroupFieldsFragment
): SignupFieldsFragment | undefined =>
  signupGroup?.signups?.find((su) => su?.responsibleForGroup) ?? undefined;

export const signupPathBuilder = ({
  args,
}: PathBuilderProps<SignupQueryVariables>): string => {
  const { id } = args;

  return `/signup/${id}/`;
};
