import { TFunction } from 'i18next';
import isEqual from 'lodash/isEqual';
import snakeCase from 'lodash/snakeCase';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/types';
import { DATE_FORMAT_API, FORM_NAMES } from '../../constants';
import {
  AttendeeStatus,
  CreateEnrolmentMutationInput,
  EnrolmentFieldsFragment,
  EnrolmentQueryVariables,
  OrganizationFieldsFragment,
  RegistrationFieldsFragment,
  SeatsReservationFieldsFragment,
  SignupInput,
  UpdateEnrolmentMutationInput,
  UserFieldsFragment,
} from '../../generated/graphql';
import { Editability, PathBuilderProps } from '../../types';
import formatDate from '../../utils/formatDate';
import getDateFromString from '../../utils/getDateFromString';
import getValue from '../../utils/getValue';
import { isAdminUserInOrganization } from '../organization/utils';
import {
  getSeatsReservationData,
  isSeatsReservationExpired,
} from '../reserveSeats/utils';
import {
  ATTENDEE_FIELDS,
  ATTENDEE_INITIAL_VALUES,
  AUTHENTICATION_NOT_NEEDED,
  ENROLMENT_ACTIONS,
  ENROLMENT_FIELDS,
  ENROLMENT_ICONS,
  ENROLMENT_INITIAL_VALUES,
  ENROLMENT_LABEL_KEYS,
  NOTIFICATION_TYPE,
  NOTIFICATIONS,
} from './constants';
import { AttendeeFields, EnrolmentFormFields } from './types';

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

export const getAttendeeDefaultInitialValues = (
  registration: RegistrationFieldsFragment
): AttendeeFields => ({
  ...ATTENDEE_INITIAL_VALUES,
});

export const getEnrolmentDefaultInitialValues = (
  registration: RegistrationFieldsFragment
): EnrolmentFormFields => ({
  ...ENROLMENT_INITIAL_VALUES,
  attendees: [getAttendeeDefaultInitialValues(registration)],
});

export const getEnrolmentInitialValues = (
  enrolment: EnrolmentFieldsFragment,
  registration: RegistrationFieldsFragment
): EnrolmentFormFields => {
  return {
    ...getEnrolmentDefaultInitialValues(registration),
    attendees: [
      {
        city: getValue(enrolment.city, ''),
        dateOfBirth: getDateFromString(enrolment.dateOfBirth),
        extraInfo: '',
        firstName: getValue(enrolment.firstName, ''),
        inWaitingList: enrolment.attendeeStatus === AttendeeStatus.Waitlisted,
        lastName: getValue(enrolment.lastName, ''),
        streetAddress: getValue(enrolment.streetAddress, ''),
        zipcode: getValue(enrolment.zipcode, ''),
      },
    ],
    email: getValue(enrolment.email, ''),
    extraInfo: getValue(enrolment.extraInfo, ''),
    membershipNumber: getValue(enrolment.membershipNumber, ''),
    nativeLanguage: getValue(enrolment.nativeLanguage, ''),
    // TODO: At the moment only email notifications are supported
    notifications: [NOTIFICATIONS.EMAIL],
    // notifications: getEnrolmentNotificationTypes(
    //   getValue(enrolment.notifications, '')
    // ),
    phoneNumber: getValue(enrolment.phoneNumber, ''),
    serviceLanguage: getValue(enrolment.serviceLanguage, ''),
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

export const getEnrolmentPayload = ({
  formValues,
  registration,
  reservationCode,
}: {
  formValues: EnrolmentFormFields;
  registration: RegistrationFieldsFragment;
  reservationCode: string;
}): CreateEnrolmentMutationInput => {
  const {
    attendees,
    email,
    extraInfo,
    membershipNumber,
    nativeLanguage,
    notifications,
    phoneNumber,
    serviceLanguage,
  } = formValues;

  const signups: SignupInput[] = attendees.map((attendee) => {
    const { city, dateOfBirth, firstName, lastName, streetAddress, zipcode } =
      attendee;
    return {
      city: getValue(city, ''),
      dateOfBirth: dateOfBirth
        ? formatDate(new Date(dateOfBirth), DATE_FORMAT_API)
        : null,
      email: getValue(email, null),
      extraInfo: extraInfo,
      firstName: getValue(firstName, ''),
      lastName: getValue(lastName, ''),
      membershipNumber: membershipNumber,
      nativeLanguage: getValue(nativeLanguage, null),
      notifications: getEnrolmentNotificationsCode(notifications),
      phoneNumber: getValue(phoneNumber, null),
      serviceLanguage: getValue(serviceLanguage, null),
      streetAddress: getValue(streetAddress, null),
      zipcode: getValue(zipcode, null),
    };
  });

  return {
    registration: registration.id,
    reservationCode,
    signups,
  };
};

export const getUpdateEnrolmentPayload = ({
  formValues,
  id,
  registration,
}: {
  formValues: EnrolmentFormFields;
  id: string;
  registration: RegistrationFieldsFragment;
}): UpdateEnrolmentMutationInput => {
  const {
    attendees,
    email,
    extraInfo,
    membershipNumber,
    nativeLanguage,
    phoneNumber,
    serviceLanguage,
  } = formValues;
  const { city, dateOfBirth, firstName, lastName, streetAddress, zipcode } =
    attendees[0] || {};

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
    // notifications: getEnrolmentNotificationsCode(notifications),
    phoneNumber: getValue(phoneNumber, null),
    registration: getValue(registration.id, ''),
    serviceLanguage: getValue(serviceLanguage, null),
    streetAddress: getValue(streetAddress, null),
    zipcode: getValue(zipcode, null),
  };
};

export const enrolmentPathBuilder = ({
  args,
}: PathBuilderProps<EnrolmentQueryVariables>): string => {
  const { id } = args;

  return `/signup/${id}/`;
};

export const checkCanUserDoAction = ({
  action,
  organizationAncestors,
  publisher,
  user,
}: {
  action: ENROLMENT_ACTIONS;
  organizationAncestors: OrganizationFieldsFragment[];
  publisher: string;
  user?: UserFieldsFragment;
}): boolean => {
  const isAdminUser = isAdminUserInOrganization({
    id: publisher,
    organizationAncestors,
    user,
  });

  switch (action) {
    case ENROLMENT_ACTIONS.EDIT:
      return true;
    case ENROLMENT_ACTIONS.CANCEL:
    case ENROLMENT_ACTIONS.CREATE:
    case ENROLMENT_ACTIONS.SEND_MESSAGE:
    case ENROLMENT_ACTIONS.UPDATE:
    case ENROLMENT_ACTIONS.VIEW:
      return isAdminUser;
  }
};

export const getEditEnrolmentWarning = ({
  action,
  authenticated,
  t,
  userCanDoAction,
}: {
  action: ENROLMENT_ACTIONS;
  authenticated: boolean;
  t: TFunction;
  userCanDoAction: boolean;
}): string => {
  if (AUTHENTICATION_NOT_NEEDED.includes(action)) {
    return '';
  }

  if (!authenticated) {
    return t('authentication.noRightsUpdateEnrolment');
  }

  if (!userCanDoAction) {
    switch (action) {
      case ENROLMENT_ACTIONS.CREATE:
        return t('enrolmentsPage.warningNoRightsToCreate');
      case ENROLMENT_ACTIONS.VIEW:
        return t('enrolmentsPage.warningNoRightsToView');
      default:
        return t('enrolmentsPage.warningNoRightsToEdit');
    }
  }

  return '';
};

export const checkIsEditActionAllowed = ({
  action,
  authenticated,
  organizationAncestors,
  publisher,
  t,
  user,
}: {
  action: ENROLMENT_ACTIONS;
  authenticated: boolean;
  organizationAncestors: OrganizationFieldsFragment[];
  publisher: string;
  t: TFunction;
  user?: UserFieldsFragment;
}): Editability => {
  const userCanDoAction = checkCanUserDoAction({
    action,
    organizationAncestors,
    publisher,
    user,
  });

  const warning = getEditEnrolmentWarning({
    action,
    authenticated,
    t,
    userCanDoAction,
  });

  return { editable: !warning, warning };
};

export const getEditButtonProps = ({
  action,
  authenticated,
  onClick,
  organizationAncestors,
  publisher,
  t,
  user,
}: {
  action: ENROLMENT_ACTIONS;
  authenticated: boolean;
  onClick: () => void;
  organizationAncestors: OrganizationFieldsFragment[];
  publisher: string;
  t: TFunction;
  user?: UserFieldsFragment;
}): MenuItemOptionProps => {
  const { editable, warning } = checkIsEditActionAllowed({
    action,
    authenticated,
    organizationAncestors,
    publisher,
    t,
    user,
  });

  return {
    disabled: !editable,
    icon: ENROLMENT_ICONS[action],
    label: t(ENROLMENT_LABEL_KEYS[action]),
    onClick,
    title: warning,
  };
};

export const clearCreateEnrolmentFormData = (registrationId: string): void => {
  sessionStorage?.removeItem(
    `${FORM_NAMES.CREATE_ENROLMENT_FORM}-${registrationId}`
  );
};

export const isRestoringFormDataDisabled = ({
  enrolment,
  registrationId,
}: {
  enrolment?: EnrolmentFieldsFragment;
  registrationId: string;
}) => {
  const data = getSeatsReservationData(registrationId);

  return !!enrolment || !data || isSeatsReservationExpired(data);
};

export const getNewAttendees = ({
  attendees,
  registration,
  seatsReservation,
}: {
  attendees: AttendeeFields[];
  registration: RegistrationFieldsFragment;
  seatsReservation: SeatsReservationFieldsFragment;
}): AttendeeFields[] => {
  const { seats, inWaitlist } = seatsReservation;
  const attendeeInitialValues = getAttendeeDefaultInitialValues(registration);
  const filledAttendees = attendees.filter(
    (a) => !isEqual(a, attendeeInitialValues)
  );
  return [
    ...filledAttendees,
    ...Array(Math.max(seats - filledAttendees.length, 0)).fill(
      attendeeInitialValues
    ),
  ]
    .slice(0, seats)
    .map((attendee, index) => ({ ...attendee, inWaitingList: inWaitlist }));
};

export const isEnrolmentFieldRequired = (
  registration: RegistrationFieldsFragment,
  fieldId: ENROLMENT_FIELDS | ATTENDEE_FIELDS
): boolean =>
  Boolean(registration.mandatoryFields?.includes(snakeCase(fieldId)));

export const isDateOfBirthFieldRequired = (
  registration: RegistrationFieldsFragment
): boolean => {
  const { audienceMinAge, audienceMaxAge } = registration;

  return Boolean(audienceMaxAge || audienceMinAge);
};
