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
import keys from 'lodash/keys';
import sortBy from 'lodash/sortBy';
import { MouseEvent } from 'react';
import { scroller } from 'react-scroll';
import * as Yup from 'yup';

import { MenuItemOptionProps } from '../../common/components/menuDropdown/types';
import {
  EMPTY_MULTI_LANGUAGE_OBJECT,
  FORM_NAMES,
  LE_DATA_LANGUAGES,
  ORDERED_LE_DATA_LANGUAGES,
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
  KeywordFieldsFragment,
  Language as LELanguage,
  LocalisedObject,
  OrganizationFieldsFragment,
  PublicationStatus,
  SuperEventType,
  UserFieldsFragment,
} from '../../generated/graphql';
import {
  Editability,
  Language,
  MultiLanguageObject,
  PathBuilderProps,
} from '../../types';
import formatDate from '../../utils/formatDate';
import formatDateAndTimeForApi from '../../utils/formatDateAndTimeForApi';
import getLocalisedObject from '../../utils/getLocalisedObject';
import getLocalisedString from '../../utils/getLocalisedString';
import getNextPage from '../../utils/getNextPage';
import getPathBuilder from '../../utils/getPathBuilder';
import getTimeObject from '../../utils/getTimeObject';
import isHtml from '../../utils/isHtml';
import parseIdFromAtId from '../../utils/parseIdFromAtId';
import queryBuilder from '../../utils/queryBuilder';
import sanitizeHtml from '../../utils/sanitizeHtml';
import skipFalsyType from '../../utils/skipFalsyType';
import wait from '../../utils/wait';
import { getImageAltText } from '../image/utils';
import {
  isAdminUserInOrganization,
  isReqularUserInOrganization,
} from '../organization/utils';
import { REGISTRATION_INITIAL_VALUES } from '../registration/constants';
import { RegistrationFormFields } from '../registration/types';
import {
  AUTHENTICATION_NOT_NEEDED,
  DESCRIPTION_SECTION_FIELDS,
  EVENT_ACTIONS,
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

const languageWeight = (lang: string): number => {
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
  languageWeight(a.id as string) - languageWeight(b.id as string);

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

export const getEventFields = (
  event: EventFieldsFragment,
  language: Language
): EventFields => {
  const id = event.id || '';
  const publicationStatus = event.publicationStatus || PublicationStatus.Public;

  const registrationAtId = event.registration?.atId;

  return {
    id,
    atId: event.atId || '',
    audienceMaxAge: event.audienceMaxAge || null,
    audienceMinAge: event.audienceMinAge || null,
    createdBy: event.createdBy || '',
    deleted: event.deleted ?? null,
    description: getLocalisedString(event.description, language),
    endTime: event.endTime ? new Date(event.endTime) : null,
    eventStatus: event.eventStatus || EventStatus.EventScheduled,
    eventUrl: `/${language}${ROUTES.EDIT_EVENT.replace(':id', id)}`,
    freeEvent: !!event.offers[0]?.isFree,
    imageUrl: event.images.find((image) => image?.url)?.url || null,
    inLanguage: event.inLanguage
      .map((item) => getLocalisedString(item?.name, language))
      .filter(skipFalsyType),
    isDraft: publicationStatus === PublicationStatus.Draft,
    isPublic: publicationStatus === PublicationStatus.Public,
    keywords: event.keywords as KeywordFieldsFragment[],
    lastModifiedTime: event.lastModifiedTime
      ? new Date(event.lastModifiedTime)
      : null,
    name: getLocalisedString(event.name, language),
    offers: event.offers.filter(
      (offer) => !!offer && !offer?.isFree
    ) as Offer[],
    publisher: event.publisher || null,
    publicationStatus,
    registrationAtId: registrationAtId ?? null,
    registrationUrl: registrationAtId
      ? `/${language}${ROUTES.EDIT_REGISTRATION.replace(
          ':id',
          parseIdFromAtId(registrationAtId) as string
        )}`
      : null,
    subEventAtIds:
      event.subEvents?.map((subEvent) => subEvent?.atId as string) || [],
    superEventAtId: event.superEvent?.atId || null,
    superEventType: event.superEventType || null,
    startTime: event.startTime ? new Date(event.startTime) : null,
  };
};

export const generateEventTimesFromRecurringEvent = (
  settings: RecurringEventSettings
): EventTime[] => {
  const { startDate, startTime, endDate, endTime, repeatDays, repeatInterval } =
    settings;
  const eventTimes: EventTime[] = [];

  /* istanbul ignore else  */
  if (startDate && endDate && repeatInterval > 0) {
    const dayCodes: Record<string, number> = {
      [WEEK_DAY.MON]: 1,
      [WEEK_DAY.TUE]: 2,
      [WEEK_DAY.WED]: 3,
      [WEEK_DAY.THU]: 4,
      [WEEK_DAY.FRI]: 5,
      [WEEK_DAY.SAT]: 6,
      [WEEK_DAY.SUN]: 0,
    };

    const recurrenceStart = endOfDay(subDays(new Date(startDate), 1));
    const recurrenceEnd = endOfDay(new Date(endDate));
    const formattedStartTime = getTimeObject(startTime);
    const formattedEndTime = getTimeObject(endTime);

    repeatDays.forEach((dayCode) => {
      const startDay = new Date(startDate).getDay();
      const day =
        startDay > dayCodes[dayCode]
          ? 7 - (startDay - dayCodes[dayCode])
          : dayCodes[dayCode] - startDay;
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
  const superEventEndTime = endTimes.length
    ? maxDate(endTimes)
    : startTimes.length
    ? endOfDay(maxDate(startTimes))
    : undefined;

  return {
    id: null,
    startTime: superEventStartTime || null,
    endTime: superEventEndTime || null,
  };
};

export const getEventTimes = (formValues: EventFormFields): EventTime[] => {
  const { events, eventTimes, recurringEvents } = formValues;

  const allEventTimes: EventTime[] = [...events, ...eventTimes];

  recurringEvents.forEach((settings) =>
    allEventTimes.push(...settings.eventTimes)
  );

  return sortBy(allEventTimes, 'startTime');
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

export const filterUnselectedLanguages = (
  obj: LocalisedObject,
  eventInfoLanguages: string[]
): LocalisedObject =>
  Object.entries(obj).reduce(
    (acc, [k, v]) => ({
      ...acc,
      [k]: eventInfoLanguages.includes(k) ? v : null,
    }),
    {}
  );

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
  const {
    audience,
    audienceMaxAge,
    audienceMinAge,
    enrolmentEndTimeDate,
    enrolmentEndTimeTime,
    enrolmentStartTimeDate,
    enrolmentStartTimeTime,
    eventInfoLanguages,
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
    videos,
  } = formValues;

  return {
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
      endTime: endTime ? new Date(endTime) : null,
      startTime: startTime ? new Date(startTime) : null,
    }))
  );
  const subEvents = subEventAtIds.map((atId) => ({
    atId: atId,
  }));

  /* istanbul ignore next */
  return {
    ...basePayload[0],
    endTime: superEventTime.endTime?.toISOString() ?? null,
    startTime: superEventTime.startTime?.toISOString() ?? null,
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
  'languages',
  'inLanguage',
  'subEvents',
  'superEvent',
]);

// Enumerate all the property names of an object recursively.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* propertyNames(obj: Record<string, unknown>): any {
  for (const name of keys(obj)) {
    const val = (obj as Record<string, unknown>)[name];
    if (val instanceof Object && !SKIP_FIELDS.has(name)) {
      yield* propertyNames(val as Record<string, unknown>);
    }
    if (val && val !== '') {
      yield name;
    }
  }
}

export const getEventInfoLanguages = (event: EventFieldsFragment): string[] => {
  const languages = new Set(ORDERED_LE_DATA_LANGUAGES);
  const foundLanguages = new Set<string>();

  for (const name of propertyNames(event)) {
    if (foundLanguages.size === languages.size) {
      break;
    }
    if (languages.has(name)) {
      foundLanguages.add(name);
    }
  }
  return Array.from(foundLanguages);
};
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

export const getEventInitialValues = (
  event: EventFieldsFragment
): EventFormFields => {
  // set the 'hasUmbrella' checkbox as checked, if:
  //  - the event has a super event with the super event type 'umbrella'
  //  - the super event value is not empty
  const hasUmbrella =
    event.superEvent?.superEventType === SuperEventType.Umbrella &&
    !!event.superEvent.atId;
  // set the 'isUmbrella' checkbox as checked, if:
  //  - super event type of the event is 'umbrella'
  const isUmbrella = event.superEventType === SuperEventType.Umbrella;
  const hasPrice = event.offers?.[0]?.isFree === false;
  const events: EventTime[] =
    event.superEventType === SuperEventType.Recurring
      ? event.subEvents
          .map((subEvent) => ({
            endTime: subEvent?.endTime ? new Date(subEvent?.endTime) : null,
            id: subEvent?.id || null,
            startTime: subEvent?.startTime
              ? new Date(subEvent?.startTime)
              : null,
          }))
          .sort(sortEventTimes)
      : [
          {
            endTime: event.endTime ? new Date(event.endTime) : null,
            id: event.id,
            startTime: event.startTime ? new Date(event.startTime) : null,
          },
        ];

  const offers = event.offers
    .filter((offer) => !!offer?.isFree !== hasPrice)
    .map((offer) => ({
      description: getLocalisedObject(offer?.description),
      infoUrl: getLocalisedObject(offer?.infoUrl),
      price: getLocalisedObject(offer?.price),
    }));

  if (!offers.length) {
    offers.push(getEmptyOffer());
  }

  return {
    ...EVENT_INITIAL_VALUES,
    audience: event.audience.map((keyword) => keyword?.atId as string),
    audienceMaxAge: event.audienceMaxAge ?? '',
    audienceMinAge: event.audienceMinAge ?? '',
    description: getSanitizedDescription(event),
    events,
    enrolmentEndTimeDate: event.enrolmentEndTime
      ? new Date(event.enrolmentEndTime)
      : null,
    enrolmentEndTimeTime: event.enrolmentEndTime
      ? formatDate(new Date(event.enrolmentEndTime), TIME_FORMAT_DATA)
      : '',
    enrolmentStartTimeDate: event.enrolmentStartTime
      ? new Date(event.enrolmentStartTime)
      : null,
    enrolmentStartTimeTime: event.enrolmentStartTime
      ? formatDate(new Date(event.enrolmentStartTime), TIME_FORMAT_DATA)
      : '',
    eventInfoLanguages: getEventInfoLanguages(event),
    externalLinks: sortBy(event.externalLinks, ['name']).map(
      (externalLink) => ({
        link: externalLink?.link ?? '',
        name: externalLink?.name ?? '',
      })
    ),
    hasPrice,
    hasUmbrella: hasUmbrella,
    imageDetails: {
      altText: getImageAltText(event.images[0]?.altText),
      license:
        event.images[0]?.license || EVENT_INITIAL_VALUES.imageDetails.license,
      name: event.images[0]?.name || EVENT_INITIAL_VALUES.imageDetails.name,
      photographerName:
        event.images[0]?.photographerName ||
        EVENT_INITIAL_VALUES.imageDetails.photographerName,
    },
    images: event.images.map((image) => image?.atId as string),
    infoUrl: getLocalisedObject(event.infoUrl),
    inLanguage: event.inLanguage
      .filter(skipFalsyType)
      .map((language) => language?.atId),
    isUmbrella: isUmbrella,
    isVerified: true,
    keywords: event.keywords.map((keyword) => keyword?.atId as string),
    location: event.location?.atId || '',
    locationExtraInfo: getLocalisedObject(event.locationExtraInfo),
    maximumAttendeeCapacity: event.maximumAttendeeCapacity ?? '',
    minimumAttendeeCapacity: event.minimumAttendeeCapacity ?? '',
    name: getLocalisedObject(event.name),
    offers,
    publisher: event.publisher ?? '',
    provider: getLocalisedObject(event.provider),
    recurringEventEndTime:
      event.superEventType === SuperEventType.Recurring
        ? event.endTime
          ? new Date(event.endTime)
          : null
        : null,
    recurringEventStartTime:
      event.superEventType === SuperEventType.Recurring
        ? event.startTime
          ? new Date(event.startTime)
          : null
        : null,
    shortDescription: getLocalisedObject(event.shortDescription),
    superEvent: event.superEvent?.atId || '',
    type: event.typeId?.toLowerCase() ?? EVENT_TYPE.General,
    videos: event.videos.length
      ? event.videos.map((video) => ({
          altText: video?.altText ?? '',
          name: video?.name ?? '',
          url: video?.url ?? '',
        }))
      : [getEmptyVideo()],
  };
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
    const path = e.path ?? /* istanbul ignore next */ '';

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

  subEvents.push(...(data.events.data as EventFieldsFragment[]));

  let nextPage = getNextPage(data.events.meta);

  while (nextPage) {
    const { data } = await apolloClient.query<EventsQuery>({
      fetchPolicy: 'no-cache',
      query: EventsDocument,
      variables: { ...variables, page: nextPage },
    });

    subEvents.push(...(data.events.data as EventFieldsFragment[]));
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
  event?: undefined;
  publisher: string;
};

type EditEventActionProps = CommonEventActionProps & {
  event: EventFieldsFragment;
  publisher?: undefined;
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
  const canCreateDraft =
    (!publisher && !!user?.organization) || isRegularUser || isAdminUser;

  switch (action) {
    case EVENT_ACTIONS.COPY:
    case EVENT_ACTIONS.EDIT:
      return true;
    case EVENT_ACTIONS.CREATE_DRAFT:
      return canCreateDraft;
    case EVENT_ACTIONS.CANCEL:
    case EVENT_ACTIONS.DELETE:
    case EVENT_ACTIONS.POSTPONE:
      return isDraft ? isRegularUser || isAdminUser : isAdminUser;
    case EVENT_ACTIONS.ACCEPT_AND_PUBLISH:
    case EVENT_ACTIONS.PUBLISH:
    case EVENT_ACTIONS.UPDATE_PUBLIC:
      return isAdminUser;
    case EVENT_ACTIONS.UPDATE_DRAFT:
      return isRegularUser || isAdminUser;
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
      return userCanDoAction;
    case EVENT_ACTIONS.PUBLISH:
      return !authenticated || userCanDoAction;
    case EVENT_ACTIONS.UPDATE_DRAFT:
      return isDraft;
    case EVENT_ACTIONS.UPDATE_PUBLIC:
      return isPublic;
  }
};

export const getEventActionWarning = ({
  action,
  authenticated,
  event,
  t,
  userCanDoAction,
}: EventActionProps & {
  authenticated: boolean;
  t: TFunction;
  userCanDoAction: boolean;
}): string => {
  // Warning when creating a new event
  if (!event) {
    if (!authenticated) {
      return t('event.form.buttonPanel.warningNotAuthenticated');
    }

    if (action === EVENT_ACTIONS.CREATE_DRAFT && !userCanDoAction) {
      return t('event.form.buttonPanel.warningNoRightsToCreate');
    }

    if (action === EVENT_ACTIONS.PUBLISH && !userCanDoAction) {
      return t('event.form.buttonPanel.warningNoRightsToPublish');
    }

    return '';
  }

  // Warning when updating an existing event

  const { deleted, endTime, eventStatus, isDraft, startTime } = getEventFields(
    event,
    'fi'
  );
  const isCancelled = eventStatus === EventStatus.EventCancelled;

  const isSubEvent = Boolean(event.superEvent);
  const eventIsInThePast =
    (endTime && isPast(endTime)) ||
    (!endTime && startTime && isBefore(startTime, startOfDay(new Date())));

  if (AUTHENTICATION_NOT_NEEDED.includes(action)) {
    return '';
  }

  if (!authenticated) {
    return t('authentication.noRightsUpdateEvent');
  }

  if (isCancelled && NOT_ALLOWED_WHEN_CANCELLED.includes(action)) {
    return t('event.form.editButtonPanel.warningCancelledEvent');
  }

  if (deleted && NOT_ALLOWED_WHEN_DELETED.includes(action)) {
    return t('event.form.editButtonPanel.warningDeletedEvent');
  }

  if (eventIsInThePast && NOT_ALLOWED_WHEN_IN_PAST.includes(action)) {
    return t('event.form.editButtonPanel.warningEventInPast');
  }

  if (isDraft && action === EVENT_ACTIONS.CANCEL) {
    return t('event.form.editButtonPanel.warningCannotCancelDraft');
  }

  if (isDraft && action === EVENT_ACTIONS.POSTPONE) {
    return t('event.form.editButtonPanel.warningCannotPostponeDraft');
  }

  if (isDraft && action === EVENT_ACTIONS.ACCEPT_AND_PUBLISH && isSubEvent) {
    return t('event.form.editButtonPanel.warningCannotPublishSubEvent');
  }

  if (!userCanDoAction) {
    return t('event.form.editButtonPanel.warningNoRightsToEdit');
  }

  return '';
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
    ...(user?.adminOrganizations || []),
    ...(user?.organizationMemberships || []),
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

export const copyEventInfoToRegistrationSessionStorage = async (
  event: EventFieldsFragment
): Promise<void> => {
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

  const state: FormikState<RegistrationFormFields> = {
    errors: {},
    isSubmitting: false,
    isValidating: false,
    submitCount: 0,
    touched: {},
    values: {
      ...REGISTRATION_INITIAL_VALUES,
      audienceMaxAge,
      audienceMinAge,
      enrolmentEndTimeDate,
      enrolmentEndTimeTime,
      enrolmentStartTimeDate,
      enrolmentStartTimeTime,
      event: event.id,
      maximumAttendeeCapacity,
      minimumAttendeeCapacity,
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

const getAllEventTimes = (
  eventTimes: EventTime[],
  recurringEvents: RecurringEventSettings[]
): EventTime[] => [
  ...eventTimes,
  ...recurringEvents.reduce(
    (previous: EventTime[], current) => [...previous, ...current.eventTimes],
    []
  ),
];

export const isRecurringEvent = (
  eventTimes: EventTime[],
  recurringEvents: RecurringEventSettings[]
): boolean => getAllEventTimes(eventTimes, recurringEvents).length > 1;
