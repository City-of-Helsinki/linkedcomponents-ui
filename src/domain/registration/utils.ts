/* eslint-disable max-len */
import copyToClipboard from 'copy-to-clipboard';
import isFuture from 'date-fns/isFuture';
import isPast from 'date-fns/isPast';
import { FormikState } from 'formik';
import { TFunction } from 'i18next';
import isNil from 'lodash/isNil';
import isNumber from 'lodash/isNumber';
import { toast } from 'react-toastify';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/types';
import { FORM_NAMES, ROUTES, TIME_FORMAT_DATA } from '../../constants';
import {
  CreateRegistrationMutationInput,
  OrganizationFieldsFragment,
  RegistrationFieldsFragment,
  RegistrationQueryVariables,
  UserFieldsFragment,
} from '../../generated/graphql';
import { Editability, Language, PathBuilderProps } from '../../types';
import { filterUnselectedLanguages } from '../../utils/filterUnselectedLanguages';
import formatDate from '../../utils/formatDate';
import formatDateAndTimeForApi from '../../utils/formatDateAndTimeForApi';
import getDateFromString from '../../utils/getDateFromString';
import { getInfoLanguages } from '../../utils/getInfoLanguages';
import getLocalisedObject from '../../utils/getLocalisedObject';
import getValue from '../../utils/getValue';
import queryBuilder from '../../utils/queryBuilder';
import skipFalsyType from '../../utils/skipFalsyType';
import { getEventFields } from '../event/utils';
import {
  hasAdminOrganization,
  hasRegistrationAdminOrganization,
  isAdminUserInOrganization,
  isRegistrationAdminUserInOrganization,
} from '../organization/utils';
import {
  REGISTRATION_ACTIONS,
  REGISTRATION_ICONS,
  REGISTRATION_LABEL_KEYS,
} from '../registrations/constants';
import {
  getSeatsReservationData,
  isSeatsReservationExpired,
} from '../seatsReservation/utils';
import { REGISTRATION_FIELDS } from './constants';
import {
  RegistrationFields,
  RegistrationFormFields,
  RegistrationUserAccessFormFields,
} from './types';

export const clearRegistrationFormData = (): void => {
  sessionStorage.removeItem(FORM_NAMES.REGISTRATION_FORM);
};

export const checkCanUserDoRegistrationAction = ({
  action,
  organizationAncestors,
  publisher,
  user,
}: {
  action: REGISTRATION_ACTIONS;
  organizationAncestors: OrganizationFieldsFragment[];
  publisher: string;
  user?: UserFieldsFragment;
}): boolean => {
  const isAdminUser = isAdminUserInOrganization({
    id: publisher,
    organizationAncestors,
    user,
  });
  const isRegistrationAdminUser = isRegistrationAdminUserInOrganization({
    id: publisher,
    organizationAncestors,
    user,
  });

  const hasAdminOrg =
    hasAdminOrganization(user) || hasRegistrationAdminOrganization(user);

  switch (action) {
    case REGISTRATION_ACTIONS.CREATE:
      return publisher ? isAdminUser || isRegistrationAdminUser : hasAdminOrg;
    case REGISTRATION_ACTIONS.COPY:
    case REGISTRATION_ACTIONS.COPY_LINK:
    case REGISTRATION_ACTIONS.EDIT:
    case REGISTRATION_ACTIONS.DELETE:
    case REGISTRATION_ACTIONS.UPDATE:
      return isAdminUser || isRegistrationAdminUser;
    case REGISTRATION_ACTIONS.SHOW_SIGNUPS:
    case REGISTRATION_ACTIONS.EDIT_ATTENDANCE_LIST:
      return isRegistrationAdminUser;
  }
};

export const getRegistrationActionWarning = ({
  action,
  authenticated,
  registration,
  t,
  userCanDoAction,
}: {
  action: REGISTRATION_ACTIONS;
  authenticated: boolean;
  registration?: RegistrationFieldsFragment;
  t: TFunction;
  userCanDoAction: boolean;
}): string => {
  if (!authenticated) {
    return t('authentication.noRightsUpdateRegistration');
  }

  if (!userCanDoAction) {
    if (action === REGISTRATION_ACTIONS.CREATE) {
      return t('registration.form.editButtonPanel.warningNoRightsToCreate');
    }
    return t('registration.form.editButtonPanel.warningNoRightsToEdit');
  }

  if (
    registration &&
    hasSignups(registration) &&
    action === REGISTRATION_ACTIONS.DELETE
  )
    return t('registration.form.editButtonPanel.warningHasSignups');

  return '';
};

export const checkIsRegistrationActionAllowed = ({
  action,
  authenticated,
  organizationAncestors,
  registration,
  publisher,
  t,
  user,
}: {
  action: REGISTRATION_ACTIONS;
  authenticated: boolean;
  organizationAncestors: OrganizationFieldsFragment[];
  publisher: string;
  registration?: RegistrationFieldsFragment;
  t: TFunction;
  user?: UserFieldsFragment;
}): Editability => {
  const userCanDoAction = checkCanUserDoRegistrationAction({
    action,
    organizationAncestors,
    publisher,
    user,
  });

  const warning = getRegistrationActionWarning({
    action,
    authenticated,
    registration,
    t,
    userCanDoAction,
  });

  return { editable: !warning, warning };
};

export const getRegistrationActionButtonProps = ({
  action,
  authenticated,
  onClick,
  organizationAncestors,
  registration,
  t,
  user,
}: {
  action: REGISTRATION_ACTIONS;
  authenticated: boolean;
  onClick: () => void;
  organizationAncestors: OrganizationFieldsFragment[];
  registration?: RegistrationFieldsFragment;
  t: TFunction;
  user?: UserFieldsFragment;
}): MenuItemOptionProps => {
  const publisher = getValue(registration?.publisher, '');
  const { editable, warning } = checkIsRegistrationActionAllowed({
    action,
    authenticated,
    organizationAncestors,
    publisher,
    registration,
    t,
    user,
  });

  return {
    disabled: !editable,
    icon: REGISTRATION_ICONS[action],
    label: t(REGISTRATION_LABEL_KEYS[action]),
    onClick,
    title: warning,
  };
};

export const getRegistrationFields = (
  registration: RegistrationFieldsFragment,
  language: Language
): RegistrationFields => {
  const id = getValue(registration.id, '');
  const event = registration.event;

  return {
    id,
    atId: getValue(registration.atId, ''),
    createdBy: getValue(registration.createdBy, ''),
    currentAttendeeCount: registration.currentAttendeeCount ?? 0,
    currentWaitingListCount: registration.currentWaitingListCount ?? 0,
    enrolmentEndTime: getDateFromString(registration.enrolmentEndTime),
    enrolmentStartTime: getDateFromString(registration.enrolmentStartTime),
    event: event?.id ? getEventFields(event, language) : null,
    lastModifiedAt: getDateFromString(registration.lastModifiedAt),
    mandatoryFields: getValue(
      registration.mandatoryFields?.filter(skipFalsyType),
      []
    ),
    maximumAttendeeCapacity: registration.maximumAttendeeCapacity ?? 0,
    publisher: getValue(registration.publisher, null),
    registrationUrl: `/${language}${ROUTES.EDIT_REGISTRATION.replace(
      ':id',
      id
    )}`,
    waitingListCapacity: registration.waitingListCapacity ?? 0,
  };
};

export const getEmptyRegistrationUserAccess =
  (): RegistrationUserAccessFormFields => ({
    email: '',
    id: null,
    language: '',
  });

export const getRegistrationInitialValues = (
  registration: RegistrationFieldsFragment
): RegistrationFormFields => {
  const infoLanguages = getInfoLanguages(registration, new Set(['event']));

  return {
    [REGISTRATION_FIELDS.AUDIENCE_MAX_AGE]: getValue(
      registration.audienceMaxAge,
      ''
    ),
    [REGISTRATION_FIELDS.AUDIENCE_MIN_AGE]: getValue(
      registration.audienceMinAge,
      ''
    ),
    [REGISTRATION_FIELDS.CONFIRMATION_MESSAGE]: getLocalisedObject(
      registration.confirmationMessage
    ),
    [REGISTRATION_FIELDS.ENROLMENT_END_TIME_DATE]: getDateFromString(
      registration.enrolmentEndTime
    ),
    [REGISTRATION_FIELDS.ENROLMENT_END_TIME_TIME]: registration.enrolmentEndTime
      ? formatDate(new Date(registration.enrolmentEndTime), TIME_FORMAT_DATA)
      : '',
    [REGISTRATION_FIELDS.ENROLMENT_START_TIME_DATE]: getDateFromString(
      registration.enrolmentStartTime
    ),
    [REGISTRATION_FIELDS.ENROLMENT_START_TIME_TIME]:
      registration.enrolmentStartTime
        ? formatDate(
            new Date(registration.enrolmentStartTime),
            TIME_FORMAT_DATA
          )
        : '',
    [REGISTRATION_FIELDS.EVENT]: getValue(registration.event?.atId, ''),
    [REGISTRATION_FIELDS.INFO_LANGUAGES]: infoLanguages.length
      ? infoLanguages
      : ['fi'],
    [REGISTRATION_FIELDS.INSTRUCTIONS]: getLocalisedObject(
      registration.instructions
    ),
    [REGISTRATION_FIELDS.MANDATORY_FIELDS]: getValue(
      registration.mandatoryFields?.filter(skipFalsyType),
      []
    ),
    [REGISTRATION_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: getValue(
      registration.maximumAttendeeCapacity,
      ''
    ),
    [REGISTRATION_FIELDS.MAXIMUM_GROUP_SIZE]: getValue(
      registration.maximumGroupSize,
      ''
    ),
    [REGISTRATION_FIELDS.MINIMUM_ATTENDEE_CAPACITY]: getValue(
      registration.minimumAttendeeCapacity,
      ''
    ),
    [REGISTRATION_FIELDS.REGISTRATION_USER_ACCESSES]: getValue(
      registration.registrationUserAccesses?.map((ru) => ({
        email: getValue(ru?.email, ''),
        id: getValue(ru?.id, null),
        language: getValue(ru?.language, ''),
      })),
      []
    ),
    [REGISTRATION_FIELDS.WAITING_LIST_CAPACITY]: getValue(
      registration.waitingListCapacity,
      ''
    ),
  };
};

export const copyRegistrationToSessionStorage = async (
  registration: RegistrationFieldsFragment
): Promise<void> => {
  const state: FormikState<RegistrationFormFields> = {
    errors: {},
    isSubmitting: false,
    isValidating: false,
    submitCount: 0,
    touched: {},
    values: {
      ...getRegistrationInitialValues(registration),
    },
  };

  sessionStorage.setItem(FORM_NAMES.REGISTRATION_FORM, JSON.stringify(state));
};

export const getRegistrationItemId = (id: string): string =>
  `registration-item-${id}`;

export const getRegistrationPayload = (
  formValues: RegistrationFormFields
): CreateRegistrationMutationInput => {
  const {
    audienceMaxAge,
    audienceMinAge,
    confirmationMessage,
    enrolmentEndTimeDate,
    enrolmentEndTimeTime,
    enrolmentStartTimeDate,
    enrolmentStartTimeTime,
    event,
    infoLanguages,
    instructions,
    mandatoryFields,
    maximumAttendeeCapacity,
    maximumGroupSize,
    minimumAttendeeCapacity,
    registrationUserAccesses,
    waitingListCapacity,
  } = formValues;

  return {
    audienceMaxAge: isNumber(audienceMaxAge) ? audienceMaxAge : null,
    audienceMinAge: isNumber(audienceMinAge) ? audienceMinAge : null,
    confirmationMessage: filterUnselectedLanguages(
      confirmationMessage,
      infoLanguages
    ),
    enrolmentEndTime:
      enrolmentEndTimeDate && enrolmentEndTimeTime
        ? formatDateAndTimeForApi(enrolmentEndTimeDate, enrolmentEndTimeTime)
        : null,
    enrolmentStartTime:
      enrolmentStartTimeDate && enrolmentStartTimeTime
        ? formatDateAndTimeForApi(
            enrolmentStartTimeDate,
            enrolmentStartTimeTime
          )
        : null,
    event: { atId: event },
    instructions: filterUnselectedLanguages(instructions, infoLanguages),
    mandatoryFields,
    maximumAttendeeCapacity: isNumber(maximumAttendeeCapacity)
      ? maximumAttendeeCapacity
      : null,
    maximumGroupSize: isNumber(maximumGroupSize) ? maximumGroupSize : null,
    minimumAttendeeCapacity: isNumber(minimumAttendeeCapacity)
      ? minimumAttendeeCapacity
      : null,
    registrationUserAccesses: registrationUserAccesses.map((ru) => ({
      email: ru.email,
      id: getValue(ru.id, null),
      language: getValue(ru.language, null),
    })),
    waitingListCapacity: isNumber(waitingListCapacity)
      ? waitingListCapacity
      : null,
  };
};

export const registrationPathBuilder = ({
  args,
}: PathBuilderProps<RegistrationQueryVariables>): string => {
  const { id, include } = args;

  const variableToKeyItems = [{ key: 'include', value: include }];

  const query = queryBuilder(variableToKeyItems);

  return `/registration/${id}/${query}`;
};

export const isRegistrationOpen = (
  registration: RegistrationFieldsFragment
): boolean => {
  const enrolmentStartTime = registration.enrolmentStartTime;
  const enrolmentEndTime = registration.enrolmentEndTime;

  // Registration is not open if enrolment start time is defined and in the future
  if (enrolmentStartTime && isFuture(new Date(enrolmentStartTime))) {
    return false;
  }
  // Registration is not open if enrolment end time is defined and in the past
  if (enrolmentEndTime && isPast(new Date(enrolmentEndTime))) {
    return false;
  }

  return true;
};

export const isAttendeeCapacityUsed = (
  registration: RegistrationFieldsFragment
): boolean =>
  !isNil(registration.maximumAttendeeCapacity) &&
  registration.maximumAttendeeCapacity <=
    (registration.currentAttendeeCount as number);

export const isWaitingListCapacityUsed = (
  registration: RegistrationFieldsFragment
): boolean =>
  !isNil(registration.waitingListCapacity) &&
  registration.waitingListCapacity <=
    (registration.currentWaitingListCount as number);

export const getFreeAttendeeCapacity = (
  registration: RegistrationFieldsFragment
): number | undefined =>
  isNil(registration.maximumAttendeeCapacity)
    ? undefined
    : (registration.remainingAttendeeCapacity as number);

export const getFreeWaitingListCapacity = (
  registration: RegistrationFieldsFragment
): number | undefined =>
  isNil(registration.waitingListCapacity)
    ? undefined
    : (registration.remainingWaitingListCapacity as number);

export const getFreeAttendeeOrWaitingListCapacity = (
  registration: RegistrationFieldsFragment
): number | undefined => {
  const freeAttendeeCapacity = getFreeAttendeeCapacity(registration);
  // Return the amount of free capacity if there are still capacity left
  // Seat reservations are not counted
  if (!isAttendeeCapacityUsed(registration)) {
    return freeAttendeeCapacity;
  }

  return getFreeWaitingListCapacity(registration);
};

const getReservedSeats = (registration: RegistrationFieldsFragment): number => {
  const data = getSeatsReservationData(registration.id as string);
  return data && !isSeatsReservationExpired(data) ? data.seats : 0;
};

export const getMaxSeatsAmount = (
  registration: RegistrationFieldsFragment
): number | undefined => {
  const reservedSeats = getReservedSeats(registration);
  const maximumGroupSize = registration.maximumGroupSize;
  const freeCapacity = getFreeAttendeeOrWaitingListCapacity(registration);
  const maxSeatsAmount =
    freeCapacity !== undefined
      ? freeCapacity + reservedSeats
      : /* istanbul ignore next */ undefined;
  const maxValues = [maximumGroupSize, maxSeatsAmount].filter(
    (v) => !isNil(v)
  ) as number[];

  return maxValues.length ? Math.min(...maxValues) : undefined;
};

export const hasSignups = (
  registration: RegistrationFieldsFragment
): boolean => {
  return Boolean(
    registration.currentAttendeeCount || registration.currentWaitingListCount
  );
};

export const isRegistrationPossible = (
  registration: RegistrationFieldsFragment
): boolean => {
  const registrationOpen = isRegistrationOpen(registration);
  const attendeeCapacityUsed = isAttendeeCapacityUsed(registration);
  const freeAttendeeCapacity = getFreeAttendeeCapacity(registration);
  const waitingListCapacityUsed = isWaitingListCapacityUsed(registration);
  const freeWaitingListCapacity = getFreeWaitingListCapacity(registration);

  // Enrolment is not opened or is already closed
  if (!registrationOpen) {
    return false;
  }
  // Attendee capacity and waiting list capacity is used
  if (attendeeCapacityUsed && waitingListCapacityUsed) {
    return false;
  }
  // Attendee capacity is not used
  if (!attendeeCapacityUsed) {
    return freeAttendeeCapacity !== 0;
  }

  // Waiting list capacity is not used
  return freeWaitingListCapacity !== 0;
};

export const getRegistrationWarning = (
  registration: RegistrationFieldsFragment,
  t: TFunction
): string => {
  const registrationOpen = isRegistrationOpen(registration);
  const registrationPossible = isRegistrationPossible(registration);
  const attendeeCapacityUsed = isAttendeeCapacityUsed(registration);
  const waitingListCapacityUsed = isWaitingListCapacityUsed(registration);
  const freeWaitlistCapacity = getFreeWaitingListCapacity(registration);

  if (!registrationOpen) {
    return t('signup.warnings.closed');
  }

  if (!registrationPossible) {
    return t('signup.warnings.allSeatsReserved');
  }

  if (attendeeCapacityUsed && !waitingListCapacityUsed) {
    return isNil(freeWaitlistCapacity)
      ? t('signup.warnings.capacityInWaitingListNoLimit')
      : t('signup.warnings.capacityInWaitingList', {
          count: freeWaitlistCapacity,
        });
  }
  return '';
};

export const getSignupLink = (
  registration: RegistrationFieldsFragment,
  locale: Language
): string =>
  `${
    import.meta.env.REACT_APP_LINKED_REGISTRATIONS_UI_URL
  }/${locale}/registration/${registration.id}/signup-group/create`;

export const copySignupLinkToClipboard = ({
  locale,
  registration,
  t,
}: {
  locale: Language;
  registration: RegistrationFieldsFragment;
  t: TFunction;
}): void => {
  copyToClipboard(getSignupLink(registration, locale));
  toast.success(getValue(t('registration.registrationLinkCopied'), ''));
};
