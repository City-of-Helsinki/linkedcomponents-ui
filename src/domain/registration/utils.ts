/* eslint-disable max-len */
import copyToClipboard from 'copy-to-clipboard';
import isFuture from 'date-fns/isFuture';
import isPast from 'date-fns/isPast';
import { FormikState } from 'formik';
import { TFunction } from 'i18next';
import isNil from 'lodash/isNil';
import omit from 'lodash/omit';

import { NotificationProps } from '../../common/components/notification/Notification';
import {
  FORM_NAMES,
  ROUTES,
  TIME_FORMAT,
  TIME_FORMAT_DATA,
} from '../../constants';
import {
  CreateRegistrationMutationInput,
  OrganizationFieldsFragment,
  RegistrationAccountFieldsFragment,
  RegistrationFieldsFragment,
  RegistrationQueryVariables,
  UpdateRegistrationMutationInput,
  UserFieldsFragment,
} from '../../generated/graphql';
import { Language, MultiLanguageObject, PathBuilderProps } from '../../types';
import { featureFlagUtils } from '../../utils/featureFlags';
import { filterUnselectedLanguages } from '../../utils/filterUnselectedLanguages';
import formatDate from '../../utils/formatDate';
import formatDateAndTimeForApi from '../../utils/formatDateAndTimeForApi';
import getDateFromString from '../../utils/getDateFromString';
import { getInfoLanguages } from '../../utils/getInfoLanguages';
import getLocalisedObject from '../../utils/getLocalisedObject';
import getNumberFieldValue from '../../utils/getNumberFieldValue';
import getNumericPayloadValue from '../../utils/getNumericPayloadValue';
import getValue from '../../utils/getValue';
import queryBuilder from '../../utils/queryBuilder';
import skipFalsyType from '../../utils/skipFalsyType';
import stripTrailingSlash from '../../utils/stripTrailingSlash';
import i18n from '../app/i18n/i18nInit';
import { getEventFields } from '../event/utils';
import {
  getSeatsReservationData,
  isSeatsReservationExpired,
} from '../seatsReservation/utils';
import { checkCanUserSignupAfterSignupIsEnded } from '../signupGroup/permissions';
import { DEFAULT_VAT_PERCENTAGE, REGISTRATION_FIELDS } from './constants';
import {
  RegistrationAccountFormFields,
  RegistrationFields,
  RegistrationFormFields,
  RegistrationPriceGroupFormFields,
  RegistrationUserAccessFormFields,
} from './types';

export const clearRegistrationFormData = (): void => {
  sessionStorage.removeItem(FORM_NAMES.REGISTRATION_FORM);
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
    lastModifiedTime: getDateFromString(registration.lastModifiedTime),
    mandatoryFields: getValue(
      registration.mandatoryFields?.filter(skipFalsyType),
      []
    ),
    maximumAttendeeCapacity: getNumericPayloadValue(
      registration.maximumAttendeeCapacity
    ),
    publisher: getValue(registration.publisher, null),
    registrationUrl: `/${language}${ROUTES.EDIT_REGISTRATION.replace(
      ':id',
      id
    )}`,
    waitingListCapacity: getNumericPayloadValue(
      registration.waitingListCapacity
    ),
  };
};

export const getEmptyRegistrationPriceGroup =
  (): RegistrationPriceGroupFormFields => ({
    id: null,
    price: '',
    priceGroup: '',
  });

export const getEmptyRegistrationUserAccess =
  (): RegistrationUserAccessFormFields => ({
    email: '',
    id: null,
    isSubstituteUser: false,
    language: '',
  });

export const getRegistrationAccountInitialValues = (
  registrationAccount?: RegistrationAccountFieldsFragment | null
): RegistrationAccountFormFields => ({
  account: getValue(registrationAccount?.account?.toString(), ''),
  balanceProfitCenter: getValue(registrationAccount?.balanceProfitCenter, ''),
  companyCode: getValue(registrationAccount?.companyCode, ''),
  internalOrder: getValue(registrationAccount?.internalOrder, ''),
  mainLedgerAccount: getValue(registrationAccount?.mainLedgerAccount, ''),
  operationArea: getValue(registrationAccount?.operationArea, ''),
  profitCenter: getValue(registrationAccount?.profitCenter, ''),
  project: getValue(registrationAccount?.project, ''),
});

export const getRegistrationInitialValues = (
  registration: RegistrationFieldsFragment
): RegistrationFormFields => {
  const infoLanguages = getInfoLanguages(
    registration,
    new Set(['event', 'registrationPriceGroups'])
  );
  const { registrationAccount, registrationMerchant } = registration;

  return {
    [REGISTRATION_FIELDS.AUDIENCE_MAX_AGE]: getNumberFieldValue(
      registration.audienceMaxAge
    ),
    [REGISTRATION_FIELDS.AUDIENCE_MIN_AGE]: getNumberFieldValue(
      registration.audienceMinAge
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
    [REGISTRATION_FIELDS.HAS_PRICE]:
      !!registration.registrationPriceGroups?.length,
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
    [REGISTRATION_FIELDS.MAXIMUM_ATTENDEE_CAPACITY]: getNumberFieldValue(
      registration.maximumAttendeeCapacity
    ),
    [REGISTRATION_FIELDS.MAXIMUM_GROUP_SIZE]: getNumberFieldValue(
      registration.maximumGroupSize
    ),
    [REGISTRATION_FIELDS.MINIMUM_ATTENDEE_CAPACITY]: getNumberFieldValue(
      registration.minimumAttendeeCapacity
    ),
    [REGISTRATION_FIELDS.PRICE_GROUP_OPTIONS]: [],
    [REGISTRATION_FIELDS.REGISTRATION_ACCOUNT]:
      getRegistrationAccountInitialValues(registrationAccount),
    [REGISTRATION_FIELDS.REGISTRATION_MERCHANT]: {
      merchant: getValue(registrationMerchant?.merchant?.toString(), ''),
    },
    [REGISTRATION_FIELDS.REGISTRATION_PRICE_GROUPS]: getValue(
      registration.registrationPriceGroups?.map((pg) => ({
        id: getValue(pg?.id, null),
        price: getValue(pg?.price, ''),
        priceGroup: getValue(pg?.priceGroup?.id.toString(), ''),
      })),
      []
    ),
    [REGISTRATION_FIELDS.REGISTRATION_PRICE_GROUPS_VAT_PERCENTAGE]: getValue(
      registration.registrationPriceGroups?.[0]?.vatPercentage,
      DEFAULT_VAT_PERCENTAGE
    ),
    [REGISTRATION_FIELDS.REGISTRATION_USER_ACCESSES]: getValue(
      registration.registrationUserAccesses?.map((ru) => ({
        email: getValue(ru?.email, ''),
        id: getValue(ru?.id, null),
        isSubstituteUser: !!ru?.isSubstituteUser,
        language: getValue(ru?.language, ''),
      })),
      []
    ),
    [REGISTRATION_FIELDS.WAITING_LIST_CAPACITY]: getNumberFieldValue(
      registration.waitingListCapacity
    ),
  };
};

export const copyRegistrationToSessionStorage = async (
  registration: RegistrationFieldsFragment
): Promise<void> => {
  const values = getRegistrationInitialValues(registration);
  const state: FormikState<RegistrationFormFields> = {
    errors: {},
    isSubmitting: false,
    isValidating: false,
    submitCount: 0,
    touched: {},
    values: {
      ...values,
      registrationPriceGroups: values.registrationPriceGroups.map((pg) => ({
        ...pg,
        id: null,
      })),
      registrationUserAccesses: [],
    },
  };

  sessionStorage.setItem(FORM_NAMES.REGISTRATION_FORM, JSON.stringify(state));
};

export const getRegistrationItemId = (id: string): string =>
  `registration-item-${id}`;

export const formatSingleInstructions = ({
  instructions,
  lang,
}: {
  instructions: string;
  lang: string;
}): string => {
  const serviceCenterName = 'Palvelukeskus Helsinki';
  const dataMapping = {
    fi: {
      text1: 'Ilmoittautumisen teknisissä ongelmissa ole yhteydessä:',
      text2: '09 310 25280, palveluaika klo 8-18',
    },
    sv: {
      text1: 'För tekniska problem med registreringen, vänligen kontakta:',
      text2: '09 310 25280, servicetid 08.00 till 18.00',
    },
    en: {
      text1: 'For technical problems with registration, please contact:',
      text2: '09 310 25280, service hours 8 a.m. to 6 p.m',
    },
  };

  const trimmedText = instructions.trim();

  const appendData = dataMapping[lang as keyof typeof dataMapping];
  if (
    dataMapping.hasOwnProperty(lang) &&
    !trimmedText.toLowerCase().includes(serviceCenterName.toLowerCase())
  ) {
    const appendText = `${appendData.text1}\n${serviceCenterName}\n${appendData.text2}`;
    return [trimmedText, appendText].filter(skipFalsyType).join('\n');
  } else {
    return trimmedText;
  }
};

export const formatInstructions = (instructions: MultiLanguageObject) => {
  const formattedInstructions = { ...instructions };

  Object.entries(formattedInstructions).forEach(([lang, instructions]) => {
    const singleFormattedInstructions = formatSingleInstructions({
      instructions,
      lang,
    });
    if (singleFormattedInstructions) {
      formattedInstructions[lang as keyof MultiLanguageObject] =
        singleFormattedInstructions;
    }
  });

  return formattedInstructions;
};

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
    hasPrice,
    infoLanguages,
    instructions,
    mandatoryFields,
    maximumAttendeeCapacity,
    maximumGroupSize,
    minimumAttendeeCapacity,
    registrationAccount,
    registrationMerchant,
    registrationPriceGroups,
    registrationUserAccesses,
    waitingListCapacity,
    registrationPriceGroupsVatPercentage,
  } = formValues;

  const webStoreFields = featureFlagUtils.isFeatureEnabled(
    'WEB_STORE_INTEGRATION'
  )
    ? {
        ...(hasPrice
          ? {
              registrationAccount: {
                ...registrationAccount,
                account: Number(registrationAccount.account),
              },
              registrationMerchant: {
                ...registrationMerchant,
                merchant: Number(registrationMerchant.merchant),
              },
            }
          : {}),
        registrationPriceGroups: hasPrice
          ? registrationPriceGroups.map((pg) => ({
              id: pg.id ?? undefined,
              price: pg.price,
              priceGroup: Number(pg.priceGroup),
              vatPercentage: registrationPriceGroupsVatPercentage,
            }))
          : [],
      }
    : {};

  return {
    audienceMaxAge: getNumericPayloadValue(audienceMaxAge),
    audienceMinAge: getNumericPayloadValue(audienceMinAge),
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
    maximumAttendeeCapacity: getNumericPayloadValue(maximumAttendeeCapacity),
    maximumGroupSize: getNumericPayloadValue(maximumGroupSize),
    minimumAttendeeCapacity: getNumericPayloadValue(minimumAttendeeCapacity),
    ...webStoreFields,
    registrationUserAccesses: registrationUserAccesses.map((ru) => ({
      email: ru.email,
      id: getValue(ru.id, null),
      isSubstituteUser: ru.isSubstituteUser,
      language: getValue(ru.language, null),
    })),
    waitingListCapacity: getNumericPayloadValue(waitingListCapacity),
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
  // Registration is not open if enrolment start time is defined and in the future
  if (isSignupNotOpened(registration)) {
    return false;
  }
  // Registration is not open if enrolment end time is defined and in the past
  if (isSignupEnded(registration)) {
    return false;
  }

  return true;
};

export const isSignupNotOpened = (
  registration: RegistrationFieldsFragment
): boolean => {
  const enrolmentStartTime = registration.enrolmentStartTime;

  // Registration is not open if enrolment start time is defined and in the future
  return Boolean(enrolmentStartTime && isFuture(new Date(enrolmentStartTime)));
};

export const isSignupEnded = (
  registration: RegistrationFieldsFragment
): boolean => {
  const enrolmentEndTime = registration.enrolmentEndTime;

  // Signup is ended if enrolment end time is defined and in the past
  return Boolean(enrolmentEndTime && isPast(new Date(enrolmentEndTime)));
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

export const isRegistrationPossible = ({
  organizationAncestors,
  registration,
  user,
}: {
  organizationAncestors: OrganizationFieldsFragment[];
  registration: RegistrationFieldsFragment;
  user?: UserFieldsFragment;
}): boolean => {
  const signupNotOpened = isSignupNotOpened(registration);
  const signupEnded = isSignupEnded(registration);
  const attendeeCapacityUsed = isAttendeeCapacityUsed(registration);
  const freeAttendeeCapacity = getFreeAttendeeCapacity(registration);
  const waitingListCapacityUsed = isWaitingListCapacityUsed(registration);
  const freeWaitingListCapacity = getFreeWaitingListCapacity(registration);

  // Enrolment is not opened or is already closed and user cannot add signups to closed registration
  if (
    signupNotOpened ||
    (signupEnded &&
      !checkCanUserSignupAfterSignupIsEnded({
        organizationAncestors,
        registration,
        user,
      }))
  ) {
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

export const getRegistrationWarning = ({
  organizationAncestors,
  registration,
  t,
  user,
}: {
  organizationAncestors: OrganizationFieldsFragment[];
  registration: RegistrationFieldsFragment;
  t: TFunction;
  user?: UserFieldsFragment;
}): string => {
  const registrationOpen = isRegistrationOpen(registration);
  const registrationPossible = isRegistrationPossible({
    organizationAncestors,
    registration,
    user,
  });
  const attendeeCapacityUsed = isAttendeeCapacityUsed(registration);
  const waitingListCapacityUsed = isWaitingListCapacityUsed(registration);
  const freeWaitlistCapacity = getFreeWaitingListCapacity(registration);

  if (!registrationOpen) {
    if (registration.enrolmentStartTime) {
      const enrolmentStartTime = new Date(registration.enrolmentStartTime);
      return t('signup.warnings.closedWithEnrolmentTime', {
        openingDate: formatDate(enrolmentStartTime),
        openingTime: formatDate(enrolmentStartTime, TIME_FORMAT),
      });
    }
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
  addNotification,
  locale,
  registration,
  t,
}: {
  addNotification: (props: NotificationProps) => void;
  locale: Language;
  registration: RegistrationFieldsFragment;
  t: TFunction;
}): void => {
  copyToClipboard(getSignupLink(registration, locale));
  addNotification({
    label: t('registration.registrationLinkCopied'),
    type: 'success',
  });
};

export const omitSensitiveDataFromRegistrationPayload = (
  payload: CreateRegistrationMutationInput | UpdateRegistrationMutationInput
): Partial<CreateRegistrationMutationInput | UpdateRegistrationMutationInput> =>
  omit(payload, ['registrationUserAccesses']);

const getExportSignupsExcelUrl = ({
  registration,
  uiLanguage,
}: {
  registration: RegistrationFieldsFragment;
  uiLanguage: Language;
}) => {
  const { REACT_APP_LINKED_EVENTS_URL } = import.meta.env;
  // Remove trailing dash from Linked Events API url if needed
  const linkedEventsUrl = stripTrailingSlash(REACT_APP_LINKED_EVENTS_URL);

  return `${linkedEventsUrl}/registration/${registration.id}/signups/export/xlsx/?ui_language=${uiLanguage}`;
};

const downloadBlob = (blob: Blob, filename: string) => {
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  link.click();

  // Release the object URL and remove the link
  window.URL.revokeObjectURL(blobUrl);
  link.remove();
};

export const exportSignupsAsExcel = ({
  addNotification,
  apiToken,
  registration,
  uiLanguage,
}: {
  addNotification: (props: NotificationProps) => void;
  apiToken: string | null;
  registration: RegistrationFieldsFragment;
  uiLanguage: Language;
}) => {
  const url = getExportSignupsExcelUrl({ registration, uiLanguage });
  const { t } = i18n;

  fetch(url, {
    headers: {
      ...(apiToken ? { authorization: `Bearer ${apiToken}` } : undefined),
      'Accept-language': i18n.language,
    },
  })
    .then((response) => {
      switch (response.status) {
        case 200:
          response.blob().then((blob) => {
            downloadBlob(blob, `registered_persons_${registration.id}`);
          });
          break;
        case 401:
          throw Error(t('errors.authorizationRequired'));
        case 403:
          throw Error(t('errors.forbidden'));
        default:
          throw Error(t('errors.serverError'));
      }
    })
    .catch((error) => {
      addNotification({ type: 'error', label: error.message });
    });
};
