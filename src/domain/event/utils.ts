import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import addDays from 'date-fns/addDays';
import addWeeks from 'date-fns/addWeeks';
import endOfDay from 'date-fns/endOfDay';
import isBefore from 'date-fns/isBefore';
import isPast from 'date-fns/isPast';
import isWithinInterval from 'date-fns/isWithinInterval';
import maxDate from 'date-fns/max';
import minDate from 'date-fns/min';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import startOfDay from 'date-fns/startOfDay';
import subDays from 'date-fns/subDays';
import { FormikState } from 'formik';
import { TFunction } from 'i18next';
import capitalize from 'lodash/capitalize';
import isNumber from 'lodash/isNumber';
import omit from 'lodash/omit';
import sortBy from 'lodash/sortBy';
import { MouseEvent } from 'react';
import { scroller } from 'react-scroll';
import * as Yup from 'yup';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/types';
import {
  EMPTY_MULTI_LANGUAGE_OBJECT,
  FORM_NAMES,
  LE_DATA_LANGUAGES,
  ROUTES,
  TIME_FORMAT_DATA,
  VALIDATION_ERROR_SCROLLER_OPTIONS,
  WEEK_DAY,
} from '../../constants';
import {
  CreateEventMutationInput,
  EventDocument,
  EventFieldsFragment,
  EventQuery,
  EventQueryVariables,
  EventsDocument,
  EventsQuery,
  EventStatus,
  EventTypeId,
  Language as LELanguage,
  OrganizationFieldsFragment,
  PublicationStatus,
  SuperEventType,
  UpdateEventMutationInput,
  UserFieldsFragment,
} from '../../generated/graphql';
import {
  Editability,
  Language,
  Maybe,
  MultiLanguageObject,
  PathBuilderProps,
} from '../../types';
import { filterUnselectedLanguages } from '../../utils/filterUnselectedLanguages';
import formatDate from '../../utils/formatDate';
import formatDateAndTimeForApi from '../../utils/formatDateAndTimeForApi';
import getDateFromString from '../../utils/getDateFromString';
import { getInfoLanguages } from '../../utils/getInfoLanguages';
import getLocalisedObject from '../../utils/getLocalisedObject';
import getLocalisedString from '../../utils/getLocalisedString';
import getNextPage from '../../utils/getNextPage';
import getPathBuilder from '../../utils/getPathBuilder';
import getTimeObject from '../../utils/getTimeObject';
import getValue from '../../utils/getValue';
import isHtml from '../../utils/isHtml';
import parseIdFromAtId from '../../utils/parseIdFromAtId';
import queryBuilder from '../../utils/queryBuilder';
import sanitizeHtml from '../../utils/sanitizeHtml';
import skipFalsyType from '../../utils/skipFalsyType';
import wait from '../../utils/wait';
import { getImageAltText } from '../image/utils';
import {
  isAdminUserInOrganization,
  isExternalUserWithoutOrganization,
  isReqularUserInOrganization,
} from '../organization/utils';
import { REGISTRATION_INITIAL_VALUES } from '../registration/constants';
import {
  CommonRegistrationAndEventFields,
  RegistrationFormFields,
} from '../registration/types';
import {
  AUTHENTICATION_NOT_NEEDED,
  DAY_CODES,
  DESCRIPTION_SECTION_FIELDS,
  EVENT_ACTIONS,
  EVENT_ENVIRONMENT_VALUE,
  EVENT_EXTERNAL_USER_INITIAL_VALUES,
  EVENT_FIELD_ARRAYS,
  EVENT_FIELDS,
  EVENT_ICONS,
  EVENT_INCLUDES,
  EVENT_INITIAL_VALUES,
  EVENT_LABEL_KEYS,
  EVENT_SELECT_FIELDS,
  EVENT_TYPE,
  NOT_ALLOWED_WHEN_CANCELLED,
  NOT_ALLOWED_WHEN_DELETED,
  NOT_ALLOWED_WHEN_IN_PAST,
  SUB_EVENTS_VARIABLES,
  TEXT_EDITOR_ALLOWED_TAGS,
  TEXT_EDITOR_FIELDS,
  VIDEO_DETAILS_FIELDS,
} from './constants';
import { sortEventTimes } from './formSections/timeSection/utils';
import {
  EventFields,
  EventFormFields,
  EventTime,
  ImageDetails,
  Offer,
  RecurringEventSettings,
  VideoDetails,
} from './types';

export const eventPathBuilder = ({
  args,
}: PathBuilderProps<EventQueryVariables>): string => {
  const { id, include } = args;
  const variableToKeyItems = [{ key: 'include', value: include }];

  const query = queryBuilder(variableToKeyItems);

  return `/event/${id}/${query}`;
};

const weekDayWeight = (day: WEEK_DAY): number => {
  switch (day) {
    case WEEK_DAY.MON:
      return 0;
    case WEEK_DAY.TUE:
      return 1;
    case WEEK_DAY.WED:
      return 2;
    case WEEK_DAY.THU:
      return 3;
    case WEEK_DAY.FRI:
      return 4;
    case WEEK_DAY.SAT:
      return 5;
    case WEEK_DAY.SUN:
      return 6;
  }
};

export const sortWeekDays = (a: string, b: string): number =>
  weekDayWeight(a as WEEK_DAY) - weekDayWeight(b as WEEK_DAY);

const languageWeight = (lang: Maybe<string>): number => {
  switch (lang) {
    case 'fi':
      return 1;
    case 'sv':
      return 2;
    case 'en':
      return 3;
    default:
      return 4;
  }
};

export const sortLanguage = (a: LELanguage, b: LELanguage): number =>
  languageWeight(a.id) - languageWeight(b.id);

export const getEmptyOffer = (): Offer => {
  return {
    [EVENT_FIELDS.OFFER_DESCRIPTION]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
    [EVENT_FIELDS.OFFER_INFO_URL]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
    [EVENT_FIELDS.OFFER_PRICE]: { ...EMPTY_MULTI_LANGUAGE_OBJECT },
  };
};

export const getEmptyVideo = (): VideoDetails => {
  return {
    [VIDEO_DETAILS_FIELDS.ALT_TEXT]: '',
    [VIDEO_DETAILS_FIELDS.NAME]: '',
    [VIDEO_DETAILS_FIELDS.URL]: '',
  };
};

export const clearEventFormData = (): void => {
  sessionStorage.removeItem(FORM_NAMES.EVENT_FORM);
};
const getEventTime = (time: Maybe<string>) => {
  return time ? formatDate(new Date(time), TIME_FORMAT_DATA) : '';
};

export const getEventFields = (
  event: EventFieldsFragment,
  language: Language
): EventFields => {
  const id = getValue(event.id, '');
  const publicationStatus = getValue(
    event.publicationStatus,
    PublicationStatus.Public
  );

  const registrationAtId = event.registration?.atId;

  return {
    id,
    atId: getValue(event.atId, ''),
    audienceMaxAge: getValue(event.audienceMaxAge, null),
    audienceMinAge: getValue(event.audienceMinAge, null),
    createdBy: getValue(event.createdBy, ''),
    deleted: getValue(event.deleted, null),
    description: getLocalisedString(event.description, language),
    endTime: getDateFromString(event.endTime),
    eventStatus: getValue(event.eventStatus, EventStatus.EventScheduled),
    eventUrl: `/${language}${ROUTES.EDIT_EVENT.replace(':id', id)}`,
    freeEvent: !!event.offers[0]?.isFree,
    imageUrl: getValue(event.images.find((image) => image?.url)?.url, null),
    inLanguage: getValue(event.inLanguage, [])
      .filter(skipFalsyType)
      .map((item) => getLocalisedString(item?.name, language)),
    isDraft: publicationStatus === PublicationStatus.Draft,
    isPublic: publicationStatus === PublicationStatus.Public,
    keywords: event.keywords.filter(skipFalsyType),
    lastModifiedTime: getDateFromString(event.lastModifiedTime),
    name: getLocalisedString(event.name, language),
    offers: event.offers.filter(
      (offer) => !!offer && !offer?.isFree
    ) as Offer[],
    publisher: getValue(event.publisher, null),
    publicationStatus,
    registrationAtId: getValue(registrationAtId, null),
    registrationUrl: registrationAtId
      ? `/${language}${ROUTES.EDIT_REGISTRATION.replace(
          ':id',
          getValue(parseIdFromAtId(registrationAtId), '')
        )}`
      : null,
    subEventAtIds: (event.subEvents || [])
      .filter(skipFalsyType)
      .map((subEvent) => subEvent.atId),
    superEventAtId: getValue(event.superEvent?.atId, null),
    superEventType: getValue(event.superEventType, null),
    startTime: getDateFromString(event.startTime),
  };
};

const getDayCode = (startDay: number, dayCode: string) => {
  return startDay > DAY_CODES[dayCode]
    ? 7 - (startDay - DAY_CODES[dayCode])
    : DAY_CODES[dayCode] - startDay;
};

const isRequiredRecurringEventSettingsFilled = (
  settings: RecurringEventSettings
): boolean => {
  const { startDate, endDate, repeatInterval } = settings;

  return Boolean(startDate && endDate && repeatInterval > 0);
};

export const generateEventTimesFromRecurringEvent = (
  settings: RecurringEventSettings
): EventTime[] => {
  const eventTimes: EventTime[] = [];

  /* istanbul ignore else  */
  if (isRequiredRecurringEventSettingsFilled(settings)) {
    const { startTime, endTime, repeatDays, repeatInterval } = settings;
    const endDate = settings.endDate as Date;
    const startDate = settings.startDate as Date;

    const recurrenceStart = endOfDay(subDays(new Date(startDate), 1));
    const recurrenceEnd = endOfDay(new Date(endDate));
    const formattedStartTime = getTimeObject(startTime);
    const formattedEndTime = getTimeObject(endTime);

    repeatDays.forEach((dayCode) => {
      const startDay = new Date(startDate).getDay();
      const day = getDayCode(startDay, dayCode);
      let firstMatchWeekday;

      for (let i = 0; i <= repeatInterval; i = i + 1) {
        const possibleStartDate = setMinutes(
          setHours(
            addDays(new Date(startDate), day + i * 7),
            formattedStartTime.hours
          ),
          formattedStartTime.minutes
        );
        /* istanbul ignore else  */
        if (
          isWithinInterval(possibleStartDate, {
            start: recurrenceStart,
            end: recurrenceEnd,
          })
        ) {
          firstMatchWeekday = possibleStartDate;
          break;
        }
      }

      /* istanbul ignore else  */
      if (firstMatchWeekday) {
        let matchWeekday = firstMatchWeekday;

        while (
          isWithinInterval(matchWeekday, {
            start: recurrenceStart,
            end: recurrenceEnd,
          })
        ) {
          eventTimes.push({
            id: null,
            endTime: setMinutes(
              setHours(matchWeekday, formattedEndTime.hours),
              formattedEndTime.minutes
            ),
            startTime: matchWeekday,
          });

          matchWeekday = addWeeks(matchWeekday, repeatInterval);
        }
      }
    });
  }

  return eventTimes;
};

/**
 * take an array of sub event times, return start and end time for the
 * corresponding super event with:
 * - earliest date of sub events as startTime
 * - latest date of sub events as endTime
 */
export const calculateSuperEventTime = (eventTimes: EventTime[]): EventTime => {
  const startTimes: Date[] = [];
  const endTimes: Date[] = [];

  eventTimes.forEach(({ startTime, endTime }) => {
    if (startTime) {
      startTimes.push(new Date(startTime));
    }
    if (endTime) {
      endTimes.push(new Date(endTime));
    }
  });

  const superEventStartTime = startTimes.length
    ? minDate(startTimes)
    : undefined;

  const getSuperEventEndTime = () => {
    if (endTimes.length) {
      return maxDate(endTimes);
    }

    return startTimes.length ? endOfDay(maxDate(startTimes)) : undefined;
  };

  return {
    id: null,
    startTime: getValue(superEventStartTime, null),
    endTime: getSuperEventEndTime() || null,
  };
};

export const getNewEventTimes = (
  eventTimes: EventTime[],
  recurringEvents: RecurringEventSettings[]
): EventTime[] => [
  ...eventTimes,
  ...recurringEvents.reduce(
    (previous: EventTime[], current) => [...previous, ...current.eventTimes],
    []
  ),
];

export const getEventTimes = (formValues: EventFormFields): EventTime[] => {
  const { events, eventTimes, recurringEvents } = formValues;

  const allEventTimes = getNewEventTimes(
    [...events, ...eventTimes],
    recurringEvents
  );

  return sortBy(allEventTimes, 'startTime');
};

export const formatSingleDescription = ({
  audience = [],
  description,
  lang,
}: {
  audience: string[];
  description: string;
  lang: string;
}): string => {
  // look for the Service Centre Card keyword
  const shouldAppendDescription = audience.find((item) =>
    item.includes('/keyword/helsinki:aflfbat76e/')
  );
  const descriptionDataMapping = {
    fi: {
      text: 'Tapahtuma on tarkoitettu vain eläkeläisille ja työttömille, joilla on palvelukeskuskortti.',
      expectedText: 'palvelukeskuskortti',
    },
    sv: {
      text: 'Evenemanget är avsett endast för pensionärer eller arbetslösa med servicecentralkort.',
      expectedText: 'servicecentralkort',
    },
    en: {
      text: 'The event is intended only for retired or unemployed persons with a Service Centre Card.',
      expectedText: 'Service Centre Card',
    },
  };

  if (description) {
    const trimmedDescription = description.trim();
    let formattedDescription =
      TEXT_EDITOR_ALLOWED_TAGS.find((tag: string) =>
        trimmedDescription.startsWith(`<${tag}>`)
      ) &&
      TEXT_EDITOR_ALLOWED_TAGS.find((tag: string) =>
        trimmedDescription.endsWith(`</${tag}>`)
      )
        ? trimmedDescription
        : `<p>${trimmedDescription}</p>`;

    formattedDescription = sanitizeHtml(formattedDescription);

    // append description if Service Centre Card is selected in audience
    // only append languages that are defined in the data mapping
    const descriptionAppendData =
      descriptionDataMapping[lang as keyof typeof descriptionDataMapping];
    if (
      shouldAppendDescription &&
      descriptionDataMapping.hasOwnProperty(lang) &&
      !formattedDescription
        .toLowerCase()
        .includes(descriptionAppendData.expectedText.toLowerCase())
    ) {
      // eslint-disable-next-line max-len
      const specialDescription = `<p>${descriptionAppendData.text}</p>`;
      return specialDescription + formattedDescription;
    } else {
      return formattedDescription;
    }
  }
  return '';
};

const formatDescription = (formValues: EventFormFields) => {
  const formattedDescriptions = { ...formValues.description };
  const audience = formValues.audience;

  Object.entries(formattedDescriptions).forEach(([lang, description]) => {
    const formattedDescription = formatSingleDescription({
      audience,
      description,
      lang,
    });
    if (formattedDescription) {
      formattedDescriptions[lang as keyof MultiLanguageObject] =
        formattedDescription;
    }
  });

  return formattedDescriptions;
};

export const getEventBasePayload = (
  formValues: EventFormFields,
  publicationStatus: PublicationStatus
): Omit<CreateEventMutationInput, 'endTime' | 'startTime'> => {
  const ENABLE_EXTERNAL_USER_EVENTS =
    import.meta.env.REACT_APP_ENABLE_EXTERNAL_USER_EVENTS === 'true';

  const {
    audience,
    audienceMaxAge,
    audienceMinAge,
    enrolmentEndTimeDate,
    enrolmentEndTimeTime,
    enrolmentStartTimeDate,
    enrolmentStartTimeTime,
    eventInfoLanguages,
    environment,
    environmentalCertificate,
    externalLinks,
    hasPrice,
    hasUmbrella,
    images,
    infoUrl,
    inLanguage,
    isUmbrella,
    keywords,
    location,
    locationExtraInfo,
    maximumAttendeeCapacity,
    minimumAttendeeCapacity,
    name,
    offers,
    provider,
    publisher,
    shortDescription,
    superEvent,
    type,
    userConsent,
    userEmail,
    userOrganization,
    userPhoneNumber,
    userName,
    videos,
  } = formValues;

  const basePayload = {
    publicationStatus,
    audience: audience.map((atId) => ({ atId })),
    audienceMaxAge: isNumber(audienceMaxAge) ? audienceMaxAge : null,
    audienceMinAge: isNumber(audienceMinAge) ? audienceMinAge : null,
    description: filterUnselectedLanguages(
      formatDescription(formValues),
      eventInfoLanguages
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
    externalLinks: externalLinks.map((item) => ({
      ...item,
      language: LE_DATA_LANGUAGES.FI,
    })),
    images: images.map((atId) => ({ atId })),
    infoUrl: filterUnselectedLanguages(infoUrl, eventInfoLanguages),
    inLanguage: inLanguage.map((atId) => ({ atId })),
    keywords: keywords.map((atId) => ({ atId })),
    location: location ? { atId: location } : null,
    locationExtraInfo: filterUnselectedLanguages(
      locationExtraInfo,
      eventInfoLanguages
    ),
    maximumAttendeeCapacity: isNumber(maximumAttendeeCapacity)
      ? maximumAttendeeCapacity
      : null,
    minimumAttendeeCapacity: isNumber(minimumAttendeeCapacity)
      ? minimumAttendeeCapacity
      : null,
    name: filterUnselectedLanguages(name, eventInfoLanguages),
    offers: hasPrice
      ? offers.map((offer) => ({
          description: filterUnselectedLanguages(
            offer.description,
            eventInfoLanguages
          ),
          infoUrl: filterUnselectedLanguages(offer.infoUrl, eventInfoLanguages),
          isFree: false,
          price: filterUnselectedLanguages(offer.price, eventInfoLanguages),
        }))
      : [
          {
            infoUrl: filterUnselectedLanguages(
              offers[0]?.infoUrl,
              eventInfoLanguages
            ),
            isFree: true,
          },
        ],
    provider: filterUnselectedLanguages(provider, eventInfoLanguages),
    publisher,
    shortDescription: filterUnselectedLanguages(
      shortDescription,
      eventInfoLanguages
    ),
    superEvent: hasUmbrella && superEvent ? { atId: superEvent } : null,
    superEventType: isUmbrella ? SuperEventType.Umbrella : null,
    typeId: capitalize(type) as EventTypeId,
    videos: videos.filter((video) => video.altText || video.name || video.url),
  };

  if (ENABLE_EXTERNAL_USER_EVENTS) {
    return {
      ...basePayload,
      environment,
      environmentalCertificate,
      userConsent,
      userEmail,
      userName,
      userOrganization,
      userPhoneNumber,
    };
  }

  return basePayload;
};

export const getEventPayload = (
  formValues: EventFormFields,
  publicationStatus: PublicationStatus
): CreateEventMutationInput | CreateEventMutationInput[] => {
  const eventTimes = getEventTimes(formValues);
  const basePayload = getEventBasePayload(formValues, publicationStatus);

  if (eventTimes.length > 1) {
    return eventTimes.map((time) => ({
      ...basePayload,
      // Make sure that super event and super event type is set to null
      superEvent: null,
      superEventType: null,
      endTime: time.endTime ? new Date(time.endTime).toISOString() : null,
      startTime: time.startTime ? new Date(time.startTime).toISOString() : null,
    }));
  } else {
    return {
      ...basePayload,
      endTime: eventTimes[0]?.endTime
        ? new Date(eventTimes[0]?.endTime).toISOString()
        : null,
      startTime: eventTimes[0]?.startTime
        ? new Date(eventTimes[0]?.startTime).toISOString()
        : null,
    };
  }
};

export const getRecurringEventPayload = (
  basePayload: CreateEventMutationInput[],
  subEventAtIds: string[],
  values: EventFormFields
): CreateEventMutationInput => {
  const { hasUmbrella, superEvent } = values;
  const superEventTime = calculateSuperEventTime(
    basePayload.map(({ startTime, endTime }) => ({
      id: null,
      endTime: getDateFromString(endTime),
      startTime: getDateFromString(startTime),
    }))
  );
  const subEvents = subEventAtIds.map((atId) => ({
    atId: atId,
  }));

  /* istanbul ignore next */
  return {
    ...basePayload[0],
    endTime: getValue(superEventTime.endTime?.toISOString(), null),
    startTime: getValue(superEventTime.startTime?.toISOString(), null),
    superEvent: hasUmbrella && superEvent ? { atId: superEvent } : null,
    superEventType: SuperEventType.Recurring,
    subEvents,
  };
};

const SKIP_FIELDS = new Set([
  'location',
  'keywords',
  'audience',
  'images',
  'infoUrl',
  'languages',
  'inLanguage',
  'subEvents',
  'superEvent',
]);

export const getEventInfoLanguages = (event: EventFieldsFragment): string[] =>
  getInfoLanguages(event, SKIP_FIELDS);

const getSanitizedDescription = (event: EventFieldsFragment) => {
  const description = getLocalisedObject(event.description);

  for (const lang in description) {
    /* istanbul ignore else */
    if (description[lang as keyof MultiLanguageObject]) {
      const sanitizedDescription = sanitizeHtml(
        description[lang as keyof MultiLanguageObject]
      );
      description[lang as keyof MultiLanguageObject] = isHtml(
        sanitizedDescription
      )
        ? sanitizedDescription
        : `<p>${sanitizedDescription}</p>`;
    }
  }
  return description;
};

const hasEventUmbrella = (event: EventFieldsFragment): boolean => {
  // set the 'hasUmbrella' checkbox as checked, if:
  //  - the event has a super event with the super event type 'umbrella'
  //  - the super event value is not empty
  return (
    event.superEvent?.superEventType === SuperEventType.Umbrella &&
    !!event.superEvent.atId
  );
};

const hasEventPrice = (event: EventFieldsFragment): boolean => {
  return event.offers?.[0]?.isFree === false;
};

const getSavedEventTimes = (event: EventFieldsFragment): EventTime[] => {
  if (event.superEventType === SuperEventType.Recurring) {
    return event.subEvents
      .map((subEvent) => ({
        endTime: getDateFromString(subEvent?.endTime),
        id: getValue(subEvent?.id, null),
        startTime: getDateFromString(subEvent?.startTime),
      }))
      .sort(sortEventTimes);
  } else {
    return [
      {
        endTime: getDateFromString(event.endTime),
        id: event.id,
        startTime: getDateFromString(event.startTime),
      },
    ];
  }
};

const getEventImageDetails = (event: EventFieldsFragment): ImageDetails => {
  return {
    altText: getImageAltText(event.images[0]?.altText),
    license: getValue(
      event.images[0]?.license,
      EVENT_INITIAL_VALUES.imageDetails.license
    ),
    name: getValue(
      event.images[0]?.name,
      EVENT_INITIAL_VALUES.imageDetails.name
    ),
    photographerName: getValue(
      event.images[0]?.photographerName,
      EVENT_INITIAL_VALUES.imageDetails.photographerName
    ),
  };
};

const getEventOffers = (event: EventFieldsFragment): Offer[] => {
  const hasPrice = hasEventPrice(event);

  const offers: Offer[] = (
    hasPrice
      ? event.offers.filter((offer) => !offer?.isFree)
      : [event.offers[0]]
  )
    .filter(skipFalsyType)
    .map((offer) => ({
      description: getLocalisedObject(offer?.description),
      infoUrl: getLocalisedObject(offer?.infoUrl),
      price: getLocalisedObject(offer?.price),
    }));

  if (!offers.length) {
    offers.push(getEmptyOffer());
  }

  return offers;
};

const getEventVideos = (event: EventFieldsFragment): VideoDetails[] => {
  const videos: VideoDetails[] = event.videos
    .filter(skipFalsyType)
    .map((video) => ({
      altText: getValue(video.altText, ''),
      name: getValue(video.name, ''),
      url: getValue(video.url, ''),
    }));

  if (!videos.length) {
    videos.push(getEmptyVideo());
  }

  return videos;
};

const getRecurringEventDate = (
  superEventType: Maybe<SuperEventType>,
  time: Maybe<string>
) => {
  if (superEventType === SuperEventType.Recurring) {
    return getDateFromString(time);
  }

  return null;
};

export const getEventInitialValues = (
  event: EventFieldsFragment
): EventFormFields => {
  const hasUmbrella = hasEventUmbrella(event);
  // set the 'isUmbrella' checkbox as checked, if:
  //  - super event type of the event is 'umbrella'
  const isUmbrella = event.superEventType === SuperEventType.Umbrella;
  const hasPrice = hasEventPrice(event);
  const events: EventTime[] = getSavedEventTimes(event);

  const offers = getEventOffers(event);

  const ENABLE_EXTERNAL_USER_EVENTS =
    import.meta.env.REACT_APP_ENABLE_EXTERNAL_USER_EVENTS === 'true';

  const baseInitialValues: EventFormFields = {
    ...(ENABLE_EXTERNAL_USER_EVENTS
      ? EVENT_EXTERNAL_USER_INITIAL_VALUES
      : EVENT_INITIAL_VALUES),
    audience: event.audience
      .map((keyword) => keyword?.atId)
      .filter(skipFalsyType),
    audienceMaxAge: event.audienceMaxAge ?? '',
    audienceMinAge: event.audienceMinAge ?? '',
    description: getSanitizedDescription(event),
    events,
    enrolmentEndTimeDate: getDateFromString(event.enrolmentEndTime),
    enrolmentEndTimeTime: getEventTime(event.enrolmentEndTime),
    enrolmentStartTimeDate: getDateFromString(event.enrolmentStartTime),
    enrolmentStartTimeTime: getEventTime(event.enrolmentStartTime),
    eventInfoLanguages: getEventInfoLanguages(event),
    externalLinks: sortBy(event.externalLinks, ['name']).map(
      (externalLink) => ({
        link: getValue(externalLink?.link, ''),
        name: getValue(externalLink?.name, ''),
      })
    ),
    hasPrice,
    hasUmbrella: hasUmbrella,
    imageDetails: getEventImageDetails(event),
    images: event.images.filter(skipFalsyType).map((image) => image?.atId),
    infoUrl: getLocalisedObject(event.infoUrl),
    inLanguage: event.inLanguage
      .filter(skipFalsyType)
      .map((language) => language.atId),
    isUmbrella: isUmbrella,
    isVerified: true,
    keywords: event.keywords
      .filter(skipFalsyType)
      .map((keyword) => keyword.atId),
    location: getValue(event.location?.atId, ''),
    locationExtraInfo: getLocalisedObject(event.locationExtraInfo),
    maximumAttendeeCapacity: event.maximumAttendeeCapacity ?? '',
    minimumAttendeeCapacity: event.minimumAttendeeCapacity ?? '',
    name: getLocalisedObject(event.name),
    offers,
    publisher: getValue(event.publisher, ''),
    provider: getLocalisedObject(event.provider),
    recurringEventEndTime: getRecurringEventDate(
      event.superEventType,
      event.endTime
    ),
    recurringEventStartTime: getRecurringEventDate(
      event.superEventType,
      event.startTime
    ),
    shortDescription: getLocalisedObject(event.shortDescription),
    superEvent: getValue(event.superEvent?.atId, ''),
    type: getValue(event.typeId?.toLowerCase(), EVENT_TYPE.General),
    videos: getEventVideos(event),
  };

  if (ENABLE_EXTERNAL_USER_EVENTS) {
    return {
      ...baseInitialValues,
      environment: getValue(
        event.environment?.toLowerCase(),
        EVENT_ENVIRONMENT_VALUE.In
      ),
      environmentalCertificate: getValue(event.environmentalCertificate, ''),
      hasEnvironmentalCertificate: Boolean(event.environmentalCertificate),
      userConsent: Boolean(event.userConsent),
      userEmail: getValue(event.userEmail, ''),
      userName: getValue(event.userName, ''),
      userOrganization: getValue(event.userOrganization, ''),
      userPhoneNumber: getValue(event.userPhoneNumber, ''),
    };
  }

  return baseInitialValues;
};

type EventErrorFieldType =
  | 'array'
  | 'default'
  | 'checkboxGroup'
  | 'select'
  | 'textEditor';

interface EventErrorField {
  fieldId: string;
  type: EventErrorFieldType;
}
const getFocusableFieldId = (fieldName: string): EventErrorField => {
  // For the select elements, focus the toggle button
  if (EVENT_SELECT_FIELDS.find((item) => item === fieldName)) {
    return { fieldId: `${fieldName}-input`, type: 'select' };
  } else if (TEXT_EDITOR_FIELDS.find((item) => fieldName.startsWith(item))) {
    return { fieldId: `${fieldName}-text-editor`, type: 'textEditor' };
  } else if (fieldName === EVENT_FIELDS.MAIN_CATEGORIES) {
    return { fieldId: fieldName, type: 'checkboxGroup' };
  } else if (EVENT_FIELD_ARRAYS.includes(fieldName)) {
    return { fieldId: `${fieldName}-error`, type: 'array' };
  }

  return { fieldId: fieldName, type: 'default' };
};

const changeLanguageIfNeeded = async ({
  descriptionLanguage,
  path,
  setDescriptionLanguage,
}: {
  descriptionLanguage: LE_DATA_LANGUAGES;
  path: string;
  setDescriptionLanguage: (value: LE_DATA_LANGUAGES) => void;
}): Promise<void> => {
  const descriptionField = DESCRIPTION_SECTION_FIELDS.find((field) =>
    path.startsWith(field)
  );
  if (descriptionField) {
    const fieldLanguage = path.split('.')[1];

    // Change description section language if selected language
    // is different than field language
    if (fieldLanguage !== descriptionLanguage) {
      setDescriptionLanguage(fieldLanguage as LE_DATA_LANGUAGES);

      await wait(100);
    }
  }
};

const focusToError = async ({
  field,
  fieldType,
}: {
  field: HTMLElement;
  fieldType: EventErrorFieldType;
}) => {
  switch (fieldType) {
    case 'checkboxGroup':
      const focusable = field.querySelectorAll('input');

      /* istanbul ignore else */
      if (focusable?.[0]) {
        focusable[0].focus();
      }
      break;
    case 'textEditor':
      field.click();
      break;
    default:
      field.focus();
  }
};

export const scrollToFirstError = async ({
  descriptionLanguage,
  error,
  setDescriptionLanguage,
}: {
  descriptionLanguage: LE_DATA_LANGUAGES;
  error: Yup.ValidationError;
  setDescriptionLanguage: (value: LE_DATA_LANGUAGES) => void;
}): Promise<void> => {
  for (const e of error.inner) {
    const path = getValue(e.path, '');

    await changeLanguageIfNeeded({
      descriptionLanguage,
      path,
      setDescriptionLanguage,
    });

    const { fieldId, type: fieldType } = getFocusableFieldId(path);

    if (fieldType === 'array') {
      await wait(100);
    }
    const field = document.getElementById(fieldId);

    /* istanbul ignore else */
    if (field) {
      scroller.scrollTo(fieldId, VALIDATION_ERROR_SCROLLER_OPTIONS);

      await focusToError({ field, fieldType });
      break;
    }
  }
};

const getSubEvents = async ({
  apolloClient,
  event,
}: {
  apolloClient: ApolloClient<NormalizedCacheObject>;
  event: EventFieldsFragment;
}) => {
  if (!event.superEventType) return [];

  const subEvents: EventFieldsFragment[] = [];
  const subSubEvents: EventFieldsFragment[] = [];

  const id = event.id;
  const variables = {
    ...SUB_EVENTS_VARIABLES,
    superEvent: id,
  };

  const { data } = await apolloClient.query<EventsQuery>({
    query: EventsDocument,
    variables,
  });

  subEvents.push(...data.events.data.filter(skipFalsyType));

  let nextPage = getNextPage(data.events.meta);

  while (nextPage) {
    const { data } = await apolloClient.query<EventsQuery>({
      fetchPolicy: 'no-cache',
      query: EventsDocument,
      variables: { ...variables, page: nextPage },
    });

    subEvents.push(...data.events.data.filter(skipFalsyType));
    nextPage = getNextPage(data.events.meta);
  }

  // Check is subEvent a super event and recursively add it's sub events if needed
  for (const subEvent of subEvents) {
    if (subEvent.superEventType) {
      const items = await getSubEvents({
        apolloClient,
        event: subEvent,
      });

      subSubEvents.push(...items);
    }
  }

  return [...subEvents, ...subSubEvents];
};

export const getRelatedEvents = async ({
  apolloClient,
  event,
}: {
  apolloClient: ApolloClient<NormalizedCacheObject>;
  event: EventFieldsFragment;
}): Promise<EventFieldsFragment[]> => {
  const allRelatedEvents: EventFieldsFragment[] = [event];

  const subEvents = await getSubEvents({
    apolloClient,
    event,
  });
  allRelatedEvents.push(...subEvents);

  return allRelatedEvents;
};

type CommonEventActionProps = {
  action: EVENT_ACTIONS;
};

type CreateEventActionProps = CommonEventActionProps & {
  event?: null;
  publisher: string;
};

type EditEventActionProps = CommonEventActionProps & {
  event: EventFieldsFragment;
  publisher?: null;
};

type EventActionProps = CreateEventActionProps | EditEventActionProps;

export const checkCanUserDoAction = ({
  action,
  event,
  organizationAncestors,
  publisher: selectedPublisher,
  user,
}: EventActionProps & {
  organizationAncestors: OrganizationFieldsFragment[];
  user?: UserFieldsFragment;
}): boolean => {
  const { isDraft, publisher } = event
    ? getEventFields(event, 'fi')
    : { isDraft: true, publisher: selectedPublisher };

  const isRegularUser = isReqularUserInOrganization({
    id: publisher,
    user,
  });

  const isAdminUser = isAdminUserInOrganization({
    id: publisher,
    organizationAncestors,
    user,
  });

  const ENABLE_EXTERNAL_USER_EVENTS =
    import.meta.env.REACT_APP_ENABLE_EXTERNAL_USER_EVENTS === 'true';
  const isExternalUser =
    ENABLE_EXTERNAL_USER_EVENTS && isExternalUserWithoutOrganization({ user });

  const canCreateDraft =
    (!publisher && !!user?.organization) ||
    isRegularUser ||
    isAdminUser ||
    isExternalUser;

  switch (action) {
    case EVENT_ACTIONS.COPY:
    case EVENT_ACTIONS.EDIT:
      return true;
    case EVENT_ACTIONS.CREATE_DRAFT:
      return canCreateDraft;
    case EVENT_ACTIONS.CANCEL:
    case EVENT_ACTIONS.DELETE:
    case EVENT_ACTIONS.POSTPONE:
      return isDraft
        ? isRegularUser || isAdminUser || isExternalUser
        : isAdminUser;
    case EVENT_ACTIONS.ACCEPT_AND_PUBLISH:
    case EVENT_ACTIONS.PUBLISH:
    case EVENT_ACTIONS.UPDATE_PUBLIC:
    case EVENT_ACTIONS.SEND_EMAIL:
      return isAdminUser;
    case EVENT_ACTIONS.UPDATE_DRAFT:
      return isRegularUser || isAdminUser || isExternalUser;
  }
};

export const getIsButtonVisible = ({
  action,
  authenticated,
  event,
  userCanDoAction,
}: EventActionProps & { authenticated: boolean; userCanDoAction: boolean }) => {
  const { isDraft, isPublic } = event
    ? getEventFields(event, 'fi')
    : { isDraft: true, isPublic: false };

  switch (action) {
    case EVENT_ACTIONS.CANCEL:
    case EVENT_ACTIONS.COPY:
    case EVENT_ACTIONS.DELETE:
    case EVENT_ACTIONS.EDIT:
    case EVENT_ACTIONS.POSTPONE:
      return true;
    case EVENT_ACTIONS.ACCEPT_AND_PUBLISH:
      return isDraft && userCanDoAction;
    case EVENT_ACTIONS.CREATE_DRAFT:
    case EVENT_ACTIONS.SEND_EMAIL:
      return userCanDoAction;
    case EVENT_ACTIONS.PUBLISH:
      return !authenticated || userCanDoAction;
    case EVENT_ACTIONS.UPDATE_DRAFT:
      return isDraft;
    case EVENT_ACTIONS.UPDATE_PUBLIC:
      return isPublic;
  }
};

const validateCreatedBy = (createdBy: string | null | undefined): boolean => {
  return !!createdBy && createdBy !== ' - ';
};

const getCreateEventActionWarning = ({
  action,
  authenticated,
  t,
  userCanDoAction,
}: EventActionProps & {
  authenticated: boolean;
  t: TFunction;
  userCanDoAction: boolean;
}) => {
  if (!authenticated) {
    return t('event.form.buttonPanel.warningNotAuthenticated');
  }

  if (!userCanDoAction) {
    if (action === EVENT_ACTIONS.CREATE_DRAFT) {
      return t('event.form.buttonPanel.warningNoRightsToCreate');
    }

    /* istanbul ignore else */
    if (action === EVENT_ACTIONS.PUBLISH) {
      return t('event.form.buttonPanel.warningNoRightsToPublish');
    }
  }

  return '';
};

const isEventInThePast = (event: EventFieldsFragment): boolean => {
  const { endTime, startTime } = getEventFields(event, 'fi');

  return Boolean(
    (endTime && isPast(endTime)) ||
      (!endTime && startTime && isBefore(startTime, startOfDay(new Date())))
  );
};

const getDraftEventWarning = ({
  action,
  event,
  t,
}: EventActionProps & {
  event: EventFieldsFragment;
  t: TFunction;
}): string => {
  const isSubEvent = Boolean(event.superEvent);

  if (action === EVENT_ACTIONS.CANCEL) {
    return t('event.form.editButtonPanel.warningCannotCancelDraft');
  }
  if (action === EVENT_ACTIONS.POSTPONE) {
    return t('event.form.editButtonPanel.warningCannotPostponeDraft');
  }
  if (action === EVENT_ACTIONS.ACCEPT_AND_PUBLISH && isSubEvent) {
    return t('event.form.editButtonPanel.warningCannotPublishSubEvent');
  }

  return '';
};

const getUpdateEventActionWarning = (
  props: EventActionProps & {
    authenticated: boolean;
    event: EventFieldsFragment;
    t: TFunction;
    userCanDoAction: boolean;
  }
) => {
  const { action, authenticated, event, t, userCanDoAction } = props;
  const { deleted, eventStatus, isDraft, createdBy } = getEventFields(
    event,
    'fi'
  );
  const isCancelled = eventStatus === EventStatus.EventCancelled;

  const noEmailFound = !validateCreatedBy(createdBy);

  const isInThePast = isEventInThePast(event);

  if (AUTHENTICATION_NOT_NEEDED.includes(action)) {
    return '';
  }

  if (!authenticated) {
    return t('authentication.noRightsUpdateEvent');
  }

  if (!userCanDoAction) {
    return t('event.form.editButtonPanel.warningNoRightsToEdit');
  }

  if (isCancelled && NOT_ALLOWED_WHEN_CANCELLED.includes(action)) {
    return t('event.form.editButtonPanel.warningCancelledEvent');
  }

  if (deleted && NOT_ALLOWED_WHEN_DELETED.includes(action)) {
    return t('event.form.editButtonPanel.warningDeletedEvent');
  }

  if (isInThePast && NOT_ALLOWED_WHEN_IN_PAST.includes(action)) {
    return t('event.form.editButtonPanel.warningEventInPast');
  }

  if (noEmailFound && action === EVENT_ACTIONS.SEND_EMAIL) {
    return t('event.form.editButtonPanel.warningNoEmailFound');
  }

  if (isDraft) {
    return getDraftEventWarning(props);
  }

  return '';
};

export const getEventActionWarning = (
  props: EventActionProps & {
    authenticated: boolean;
    t: TFunction;
    userCanDoAction: boolean;
  }
): string => {
  // Warning when creating a new event
  if (!props.event) {
    return getCreateEventActionWarning(props);
  }

  // Warning when updating an existing event
  return getUpdateEventActionWarning(props);
};

export const checkIsActionAllowed = ({
  t,
  ...rest
}: EventActionProps & {
  authenticated: boolean;
  organizationAncestors: OrganizationFieldsFragment[];
  user?: UserFieldsFragment;
  t: TFunction;
}): Editability & { userCanDoAction: boolean } => {
  const userCanDoAction = checkCanUserDoAction(rest);

  const warning = getEventActionWarning({
    ...rest,
    t,
    userCanDoAction,
  });

  return { editable: !warning, userCanDoAction, warning };
};

export const getEventButtonProps = (
  props: EventActionProps & {
    authenticated: boolean;
    eventType?: EVENT_TYPE;
    onClick: (event?: MouseEvent<HTMLElement>) => void;
    organizationAncestors: OrganizationFieldsFragment[];
    user?: UserFieldsFragment;
    t: TFunction;
  }
): MenuItemOptionProps | null => {
  const { warning, userCanDoAction } = checkIsActionAllowed(props);
  const { action, eventType = EVENT_TYPE.General, onClick, t } = props;

  return getIsButtonVisible({ ...props, userCanDoAction })
    ? {
        disabled: !!warning,
        icon: EVENT_ICONS[action],
        label:
          action === EVENT_ACTIONS.PUBLISH
            ? t(`${EVENT_LABEL_KEYS[action]}.${eventType}`)
            : t(EVENT_LABEL_KEYS[action]),
        onClick,
        title: warning,
      }
    : null;
};

export const copyEventToSessionStorage = async (
  event: EventFieldsFragment,
  user?: UserFieldsFragment
): Promise<void> => {
  const {
    publisher: eventPublisher,
    images,
    ...restInitialValues
  } = getEventInitialValues(event);
  const organizations = [
    ...getValue(user?.adminOrganizations, []),
    ...getValue(user?.organizationMemberships, []),
  ];
  const publisher = organizations.includes(eventPublisher)
    ? eventPublisher
    : '';

  const state: FormikState<EventFormFields> = {
    errors: {},
    isSubmitting: false,
    isValidating: false,
    submitCount: 0,
    touched: {},
    values: {
      ...restInitialValues,
      events: [],
      eventTimes: [],
      recurringEvents: [],
      recurringEventEndTime: null,
      recurringEventStartTime: null,
      hasUmbrella: false,
      images: publisher ? images : [],
      isUmbrella: false,
      isVerified: false,
      publisher,
      superEvent: null,
    },
  };

  sessionStorage.setItem(FORM_NAMES.EVENT_FORM, JSON.stringify(state));
};

export const getEventInfoToRegistrationForm = (
  event: EventFieldsFragment
): CommonRegistrationAndEventFields => {
  const {
    audienceMaxAge,
    audienceMinAge,
    enrolmentEndTimeDate,
    enrolmentEndTimeTime,
    enrolmentStartTimeDate,
    enrolmentStartTimeTime,
    maximumAttendeeCapacity,
    minimumAttendeeCapacity,
  } = getEventInitialValues(event);

  return {
    audienceMaxAge,
    audienceMinAge,
    enrolmentEndTimeDate,
    enrolmentEndTimeTime,
    enrolmentStartTimeDate,
    enrolmentStartTimeTime,
    maximumAttendeeCapacity,
    minimumAttendeeCapacity,
  };
};

export const copyEventInfoToRegistrationSessionStorage = async (
  event: EventFieldsFragment
): Promise<void> => {
  const state: FormikState<RegistrationFormFields> = {
    errors: {},
    isSubmitting: false,
    isValidating: false,
    submitCount: 0,
    touched: {},
    values: {
      ...REGISTRATION_INITIAL_VALUES,
      ...getEventInfoToRegistrationForm(event),
      event: event.atId,
    },
  };

  sessionStorage.setItem(FORM_NAMES.REGISTRATION_FORM, JSON.stringify(state));
};

export const getRecurringEvent = async (
  id: string,
  apolloClient: ApolloClient<NormalizedCacheObject>
): Promise<EventFieldsFragment | null> => {
  try {
    const { data: eventData } = await apolloClient.query<EventQuery>({
      query: EventDocument,
      fetchPolicy: 'no-cache',
      variables: {
        id,
        include: EVENT_INCLUDES,
        createPath: getPathBuilder(eventPathBuilder),
      },
    });

    return eventData.event;
  } catch (e) /* istanbul ignore next */ {
    return null;
  }
};

export const isRecurringEvent = (
  eventTimes: EventTime[],
  recurringEvents: RecurringEventSettings[]
): boolean => getNewEventTimes(eventTimes, recurringEvents).length > 1;

export const omitSensitiveDataFromEventPayload = (
  payload: CreateEventMutationInput | UpdateEventMutationInput
): Partial<CreateEventMutationInput | UpdateEventMutationInput> =>
  omit(payload, ['userEmail', 'userName', 'userPhoneNumber']);
