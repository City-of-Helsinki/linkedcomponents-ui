import addMinutes from 'date-fns/addMinutes';
import isPast from 'date-fns/isPast';
import { TFunction } from 'i18next';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/types';
import {
  DATE_FORMAT_API,
  FORM_NAMES,
  RESERVATION_NAMES,
} from '../../constants';
import {
  CreateEnrolmentMutationInput,
  EnrolmentFieldsFragment,
  EnrolmentQueryVariables,
  OrganizationFieldsFragment,
  RegistrationFieldsFragment,
  UserFieldsFragment,
} from '../../generated/graphql';
import { Editability, PathBuilderProps } from '../../types';
import formatDate from '../../utils/formatDate';
import getUnixTime from '../../utils/getUnixTime';
import { VALIDATION_MESSAGE_KEYS } from '../app/i18n/constants';
import { isAdminUserInOrganization } from '../organization/utils';
import {
  ATTENDEE_INITIAL_VALUES,
  AUTHENTICATION_NOT_NEEDED,
  ENROLMENT_ACTIONS,
  ENROLMENT_ICONS,
  ENROLMENT_INITIAL_VALUES,
  ENROLMENT_LABEL_KEYS,
  ENROLMENT_TIME_IN_MINUTES,
  ENROLMENT_TIME_PER_PARTICIPANT_IN_MINUTES,
  NOTIFICATION_TYPE,
  NOTIFICATIONS,
} from './constants';
import {
  AttendeeFields,
  EnrolmentFormFields,
  EnrolmentReservation,
} from './types';

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
  audienceMaxAge: registration.audienceMaxAge ?? null,
  audienceMinAge: registration.audienceMinAge ?? null,
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
        audienceMaxAge: registration.audienceMaxAge ?? null,
        audienceMinAge: registration.audienceMinAge ?? null,
        city: enrolment.city ?? '',
        dateOfBirth: enrolment.dateOfBirth
          ? new Date(enrolment.dateOfBirth)
          : null,
        extraInfo: '',
        name: enrolment.name ?? '',
        streetAddress: enrolment.streetAddress ?? '',
        zip: enrolment.zipcode ?? '',
      },
    ],
    email: enrolment.email ?? '',
    extraInfo: enrolment.extraInfo ?? '',
    membershipNumber: enrolment.membershipNumber ?? '',
    nativeLanguage: enrolment.nativeLanguage ?? '',
    notifications: getEnrolmentNotificationTypes(
      enrolment.notifications as string
    ),
    phoneNumber: enrolment.phoneNumber ?? '',
    serviceLanguage: enrolment.serviceLanguage ?? '',
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
    attendees,
    email,
    extraInfo,
    membershipNumber,
    nativeLanguage,
    notifications,
    phoneNumber,
    serviceLanguage,
  } = formValues;
  const { city, dateOfBirth, name, streetAddress, zip } = attendees[0] || {};

  return {
    city: city || null,
    dateOfBirth: dateOfBirth ? formatDate(dateOfBirth, DATE_FORMAT_API) : null,
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

export const getFreeAttendeeCapacity = (
  registration: RegistrationFieldsFragment
): number | undefined => {
  // If there are seats in the event
  if (!registration.maximumAttendeeCapacity) {
    return undefined;
  }
  return Math.max(
    registration.maximumAttendeeCapacity -
      (registration.currentAttendeeCount ?? /* istanbul ignore next */ 0),
    0
  );
};

export const getAttendeeCapacityError = (
  registration: RegistrationFieldsFragment,
  participantAmount: number,
  t: TFunction
): string | undefined => {
  if (participantAmount < 1) {
    return t(VALIDATION_MESSAGE_KEYS.CAPACITY_MIN, { min: 1 });
  }

  const freeCapacity = getFreeAttendeeCapacity(registration);

  if (freeCapacity && participantAmount > freeCapacity) {
    return t(VALIDATION_MESSAGE_KEYS.CAPACITY_MAX, {
      max: freeCapacity,
    });
  }

  return undefined;
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

export const clearEnrolmentReservationData = (registrationId: string): void => {
  sessionStorage?.removeItem(
    `${RESERVATION_NAMES.ENROLMENT_RESERVATION}-${registrationId}`
  );
};

export const getEnrolmentReservationData = (
  registrationId: string
): EnrolmentReservation | null => {
  /* istanbul ignore next */
  if (typeof sessionStorage === 'undefined') return null;

  const data = sessionStorage?.getItem(
    `${RESERVATION_NAMES.ENROLMENT_RESERVATION}-${registrationId}`
  );

  return data ? JSON.parse(data) : null;
};

export const setEnrolmentReservationData = (
  registrationId: string,
  reservationData: EnrolmentReservation
): void => {
  sessionStorage?.setItem(
    `${RESERVATION_NAMES.ENROLMENT_RESERVATION}-${registrationId}`,
    JSON.stringify(reservationData)
  );
};

export const updateEnrolmentReservationData = (
  registration: RegistrationFieldsFragment,
  participants: number
) => {
  const data = getEnrolmentReservationData(registration.id as string);
  // TODO: Get this data from the API when BE part is implemented
  /* istanbul ignore else */
  if (data && !isPast(data.expires * 1000)) {
    setEnrolmentReservationData(registration.id as string, {
      ...data,
      expires: getUnixTime(
        addMinutes(
          data.started * 1000,
          ENROLMENT_TIME_IN_MINUTES +
            Math.max(participants - 1, 0) *
              ENROLMENT_TIME_PER_PARTICIPANT_IN_MINUTES
        )
      ),
      participants,
    });
  }
};

export const getRegistrationTimeLeft = (
  registration: RegistrationFieldsFragment
) => {
  const now = new Date();

  const reservationData = getEnrolmentReservationData(
    registration.id as string
  );
  return reservationData ? reservationData.expires - getUnixTime(now) : 0;
};
