import copyToClipboard from 'copy-to-clipboard';
import isFuture from 'date-fns/isFuture';
import isPast from 'date-fns/isPast';
import { FormikState } from 'formik';
import { TFunction } from 'i18next';
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
import formatDate from '../../utils/formatDate';
import formatDateAndTimeForApi from '../../utils/formatDateAndTimeForApi';
import getDateFromString from '../../utils/getDateFromString';
import getValue from '../../utils/getValue';
import queryBuilder from '../../utils/queryBuilder';
import skipFalsyType from '../../utils/skipFalsyType';
import { getFreeWaitlistCapacity } from '../enrolment/utils';
import { getEventFields } from '../event/utils';
import { isAdminUserInOrganization } from '../organization/utils';
import {
  AUTHENTICATION_NOT_NEEDED,
  REGISTRATION_ACTIONS,
  REGISTRATION_ICONS,
  REGISTRATION_LABEL_KEYS,
} from '../registrations/constants';
import { REGISTRATION_FIELDS } from './constants';
import { RegistrationFields, RegistrationFormFields } from './types';

export const clearRegistrationFormData = (): void => {
  sessionStorage.removeItem(FORM_NAMES.REGISTRATION_FORM);
};

export const checkCanUserDoAction = ({
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
  const adminOrganizations = [...getValue(user?.adminOrganizations, [])];

  switch (action) {
    case REGISTRATION_ACTIONS.COPY:
    case REGISTRATION_ACTIONS.COPY_LINK:
    case REGISTRATION_ACTIONS.EDIT:
      return true;
    case REGISTRATION_ACTIONS.CREATE:
      return publisher ? isAdminUser : !!adminOrganizations.length;
    case REGISTRATION_ACTIONS.DELETE:
    case REGISTRATION_ACTIONS.SHOW_ENROLMENTS:
    case REGISTRATION_ACTIONS.UPDATE:
      return isAdminUser;
  }
};

export const getEditRegistrationWarning = ({
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
  if (AUTHENTICATION_NOT_NEEDED.includes(action)) {
    return '';
  }

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
    hasEnrolments(registration) &&
    action === REGISTRATION_ACTIONS.DELETE
  )
    return t('registration.form.editButtonPanel.warningHasEnrolments');

  return '';
};

export const checkIsEditActionAllowed = ({
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
  const userCanDoAction = checkCanUserDoAction({
    action,
    organizationAncestors,
    publisher,
    user,
  });

  const warning = getEditRegistrationWarning({
    action,
    authenticated,
    registration,
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
  const { editable, warning } = checkIsEditActionAllowed({
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

export const getRegistrationInitialValues = (
  registration: RegistrationFieldsFragment
): RegistrationFormFields => {
  return {
    [REGISTRATION_FIELDS.AUDIENCE_MAX_AGE]: getValue(
      registration.audienceMaxAge,
      ''
    ),
    [REGISTRATION_FIELDS.AUDIENCE_MIN_AGE]: getValue(
      registration.audienceMinAge,
      ''
    ),
    [REGISTRATION_FIELDS.CONFIRMATION_MESSAGE]: getValue(
      registration.confirmationMessage,
      ''
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
    [REGISTRATION_FIELDS.INSTRUCTIONS]: getValue(registration.instructions, ''),
    [REGISTRATION_FIELDS.MANDATORY_FIELDS]: getValue(
      registration.mandatoryFields?.filter(skipFalsyType),
      []
    ),
    [REGISTRATION_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: getValue(
      registration.maximumAttendeeCapacity,
      ''
    ),
    [REGISTRATION_FIELDS.MINIMUM_ATTENDEE_CAPACITY]: getValue(
      registration.minimumAttendeeCapacity,
      ''
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
    instructions,
    mandatoryFields,
    maximumAttendeeCapacity,
    minimumAttendeeCapacity,
    waitingListCapacity,
  } = formValues;

  return {
    audienceMaxAge: isNumber(audienceMaxAge) ? audienceMaxAge : null,
    audienceMinAge: isNumber(audienceMinAge) ? audienceMinAge : null,
    confirmationMessage: confirmationMessage ? confirmationMessage : null,
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
    instructions: instructions ? instructions : null,
    mandatoryFields,
    maximumAttendeeCapacity: isNumber(maximumAttendeeCapacity)
      ? maximumAttendeeCapacity
      : null,
    minimumAttendeeCapacity: isNumber(minimumAttendeeCapacity)
      ? minimumAttendeeCapacity
      : null,
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
  return (
    !!registration.enrolmentStartTime &&
    isPast(new Date(registration.enrolmentStartTime)) &&
    (!registration.enrolmentEndTime ||
      isFuture(new Date(registration.enrolmentEndTime)))
  );
};

export const isAttendeeCapacityUsed = (
  registration: RegistrationFieldsFragment
): boolean => {
  const maxCapacityDefined = !!registration.maximumAttendeeCapacity;
  const maxCapacityUsed =
    registration.maximumAttendeeCapacity &&
    (registration.currentAttendeeCount ?? /* istanbul ignore next */ 0) >=
      registration.maximumAttendeeCapacity;

  // If there are seats in the event
  if (!maxCapacityDefined || !maxCapacityUsed) {
    return false;
  } else {
    return true;
  }
};

export const isWaitingCapacityUsed = (
  registration: RegistrationFieldsFragment
): boolean => {
  // If there are seats in the event
  if (
    ((registration.waitingListCapacity &&
      registration.currentWaitingListCount) ??
      0) < (registration.waitingListCapacity ?? 0)
  ) {
    return false;
  } else {
    return true;
  }
};

export const hasEnrolments = (
  registration: RegistrationFieldsFragment
): boolean => {
  return Boolean(
    registration.currentAttendeeCount || registration.currentWaitingListCount
  );
};

export const isRegistrationPossible = (
  registration: RegistrationFieldsFragment
): boolean => {
  return (
    isRegistrationOpen(registration) &&
    (!isAttendeeCapacityUsed(registration) ||
      !isWaitingCapacityUsed(registration))
  );
};

export const getRegistrationWarning = (
  registration: RegistrationFieldsFragment,
  t: TFunction
): string => {
  if (!isRegistrationPossible(registration)) {
    return t('enrolment.warnings.closed');
  } else if (
    isAttendeeCapacityUsed(registration) &&
    !isWaitingCapacityUsed(registration)
  ) {
    return t('enrolment.warnings.capacityInWaitingList', {
      count: getFreeWaitlistCapacity(registration),
    });
  }
  return '';
};

export const getEnrolmentLink = (
  registration: RegistrationFieldsFragment,
  locale: Language
): string =>
  `${process.env.REACT_APP_LINKED_REGISTRATIONS_UI_URL}/${locale}/registration/${registration.id}/enrolment/create`;

export const copyEnrolmentLinkToClipboard = ({
  locale,
  registration,
  t,
}: {
  locale: Language;
  registration: RegistrationFieldsFragment;
  t: TFunction;
}): void => {
  copyToClipboard(getEnrolmentLink(registration, locale));
  toast.success(getValue(t('registration.registrationLinkCopied'), ''));
};
