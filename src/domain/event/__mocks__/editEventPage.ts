import { MockedResponse } from '@apollo/client/testing';
import addDays from 'date-fns/addDays';
import addHours from 'date-fns/addHours';
import startOfDay from 'date-fns/startOfDay';
import omit from 'lodash/omit';

import {
  DATETIME_FORMAT,
  EMPTY_MULTI_LANGUAGE_OBJECT,
  EXTLINK,
} from '../../../constants';
import {
  CreateEventsDocument,
  DeleteEventDocument,
  EventDocument,
  EventsDocument,
  EventStatus,
  EventTypeId,
  PublicationStatus,
  SuperEventType,
  UpdateEventsDocument,
} from '../../../generated/graphql';
import { MultiLanguageObject } from '../../../types';
import formatDate from '../../../utils/formatDate';
import {
  fakeEvent,
  fakeEvents,
  fakeExternalLink,
  fakeOffers,
  fakeVideo,
} from '../../../utils/mockDataUtils';
import {
  EVENT_INCLUDES,
  EVENT_TYPE,
  SUB_EVENTS_VARIABLES,
  TEST_EVENT_ID,
} from '../../event/constants';
import { image, imageFields } from '../../image/__mocks__/image';
import {
  audience,
  audienceAtIds,
  topicAtIds,
  topics,
} from '../../keywordSet/__mocks__/keywordSets';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import { locationText, place, placeAtId } from '../../place/__mocks__/place';
import { EventFormFields } from '../types';

const now = new Date();

const eventId = TEST_EVENT_ID;
const audienceMaxAge = 18;
const audienceMinAge = 12;
const description = {
  ...EMPTY_MULTI_LANGUAGE_OBJECT,
  ar: null,
  en: null,
  fi: 'Description fi',
  ru: null,
  sv: 'Description sv',
  zhHans: null,
} as unknown as MultiLanguageObject;
const formattedDescription = {
  ar: null,
  en: null,
  fi: '<p>Description fi</p>',
  ru: null,
  sv: '<p>Description sv</p>',
  zhHans: null,
} as unknown as MultiLanguageObject;

const startTime = addDays(addHours(startOfDay(now), 12), 1);
const endTime = addHours(startTime, 3);
const facebookUrl = 'http://facebook.com';

const infoUrl = {
  ar: null,
  en: null,
  fi: 'http://infourl.fi',
  ru: null,
  sv: 'http://infourl.sv',
  zhHans: null,
} as unknown as MultiLanguageObject;
const instagramUrl = 'http://instagram.com';
const lastModifiedTime = '2021-07-01T12:00:00.000Z';

const locationExtraInfo = {
  ar: null,
  en: null,
  fi: 'Location extra info fi',
  ru: null,
  sv: 'Location extra info sv',
  zhHans: null,
} as unknown as MultiLanguageObject;
const name = {
  ar: null,
  en: null,
  fi: 'Name fi',
  ru: null,
  sv: 'Name sv',
  zhHans: null,
} as unknown as MultiLanguageObject;
const offers = [
  {
    description: {
      ar: null,
      en: null,
      fi: 'Description fi',
      ru: null,
      sv: 'Description sv',
      zhHans: null,
    } as unknown as MultiLanguageObject,
    infoUrl: {
      ar: null,
      en: null,
      fi: 'http://infourl.com',
      ru: null,
      sv: 'http://infourl.com',
      zhHans: null,
    } as unknown as MultiLanguageObject,
    price: {
      ar: null,
      en: null,
      fi: 'Price fi',
      ru: null,
      sv: 'Price sv',
      zhHans: null,
    } as unknown as MultiLanguageObject,
  },
];
const provider = {
  ar: null,
  en: null,
  fi: 'Provider fi',
  ru: null,
  sv: 'Provider sv',
  zhHans: null,
} as unknown as MultiLanguageObject;
const publisher = TEST_PUBLISHER_ID;
const shortDescription = {
  ar: null,
  en: null,
  fi: 'Short description fi',
  ru: null,
  sv: 'Short description sv',
  zhHans: null,
} as unknown as MultiLanguageObject;

const superEventType = null;
const twitterUrl = 'http://twitter.com';
const videoDetails = {
  altText: 'Video alt text',
  name: 'Video name',
  url: 'http://videourl.com',
};

const eventOverrides = {
  id: eventId,
  audience: audience.data,
  audienceMaxAge,
  audienceMinAge,
  description,
  endTime: endTime.toISOString(),
  externalLinks: [
    fakeExternalLink({ name: EXTLINK.EXTLINK_FACEBOOK, link: facebookUrl }),
    fakeExternalLink({ name: EXTLINK.EXTLINK_INSTAGRAM, link: instagramUrl }),
    fakeExternalLink({ name: EXTLINK.EXTLINK_TWITTER, link: twitterUrl }),
  ],
  images: [image],
  infoUrl,
  inLanguage: [],
  keywords: topics.data,
  lastModifiedTime,
  location: place,
  locationExtraInfo,
  name,
  offers: fakeOffers(
    offers.length,
    offers.map((offer) => ({ ...offer, isFree: false }))
  ),
  provider,
  publisher,
  shortDescription,
  startTime: startTime.toISOString(),
  superEventType,
  videos: [fakeVideo(videoDetails)],
};

const basePayload = {
  publicationStatus: PublicationStatus.Public,
  audience: audienceAtIds.map((atId) => ({ atId })),
  audienceMaxAge,
  audienceMinAge,
  description: formattedDescription,
  email: '',
  enrolmentEndTime: null,
  enrolmentStartTime: null,
  environment: 'in',
  environmentalCertificate: '',
  externalLinks: [
    { name: EXTLINK.EXTLINK_FACEBOOK, link: facebookUrl, language: 'fi' },
    { name: EXTLINK.EXTLINK_INSTAGRAM, link: instagramUrl, language: 'fi' },
    { name: EXTLINK.EXTLINK_TWITTER, link: twitterUrl, language: 'fi' },
  ],
  images: [{ atId: imageFields.atId }],
  infoUrl,
  inLanguage: [],
  keywords: topicAtIds.map((atId) => ({ atId })),
  location: { atId: placeAtId },
  locationExtraInfo,
  maximumAttendeeCapacity: null,
  minimumAttendeeCapacity: null,
  name,
  offers: offers.map((offer) => ({ ...offer, isFree: false })),
  organization: '',
  phoneNumber: '',
  provider,
  publisher,
  shortDescription,
  endTime: endTime.toISOString(),
  startTime: startTime.toISOString(),
  superEvent: null,
  superEventType: null,
  userConsent: false,
  userName: '',
  typeId: EventTypeId.General,
  videos: [videoDetails],
  id: eventId,
};

const baseFormValues: EventFormFields = {
  audience: [...audienceAtIds],
  audienceMaxAge,
  audienceMinAge,
  description,
  email: '',
  enrolmentEndTimeDate: null,
  enrolmentEndTimeTime: '',
  enrolmentStartTimeDate: null,
  enrolmentStartTimeTime: '',
  eventInfoLanguages: ['fi', 'sv'],
  eventTimes: [],
  events: [],
  environment: 'in',
  environmentalCertificate: '',
  externalLinks: [
    { name: EXTLINK.EXTLINK_FACEBOOK, link: facebookUrl },
    { name: EXTLINK.EXTLINK_INSTAGRAM, link: instagramUrl },
    { name: EXTLINK.EXTLINK_TWITTER, link: twitterUrl },
  ],

  hasPrice: true,
  hasUmbrella: false,
  images: [imageFields.atId],
  imageDetails: imageFields,
  inLanguage: [],
  isVerified: true,
  infoUrl,
  isImageEditable: true,
  isUmbrella: false,
  keywords: [...topicAtIds],
  location: placeAtId,
  locationExtraInfo,
  mainCategories: [...topicAtIds],
  maximumAttendeeCapacity: '',
  minimumAttendeeCapacity: '',
  name,
  offers: offers.map((offer) => ({ ...offer, isFree: false })),
  organization: '',
  phoneNumber: '',
  provider,
  publisher,
  recurringEvents: [],
  recurringEventEndTime: null,
  recurringEventStartTime: null,
  shortDescription,
  superEvent: '',
  userConsent: false,
  userName: '',
  type: EVENT_TYPE.General,
  videos: [videoDetails],
};

const expectedValues = {
  audienceMaxAge,
  audienceMinAge,
  endTime: formatDate(endTime, DATETIME_FORMAT),
  description: description.fi,
  facebookUrl,
  imageAltText: imageFields.altText,
  imageName: imageFields.name,
  imagePhotographerName: imageFields.photographerName,
  infoUrl: infoUrl.fi,
  instagramUrl,
  lastModifiedTime: '1.7.2021 12.00',
  location: locationText,
  locationExtraInfo: locationExtraInfo.fi,
  name: name.fi,
  provider: provider.fi,
  shortDescription: shortDescription.fi,
  startTime: formatDate(startTime, DATETIME_FORMAT),
  twitterUrl,
  updatedLastModifiedTime: '23.8.2021 12.00',
  videoAltText: videoDetails.altText,
  videoName: videoDetails.name,
  videoUrl: videoDetails.url,
};

const event = fakeEvent(eventOverrides);

// Event mocks
const eventVariables = {
  createPath: undefined,
  id: eventId,
  include: EVENT_INCLUDES,
};
const eventResponse = { data: { event } };
const mockedEventResponse: MockedResponse = {
  request: { query: EventDocument, variables: eventVariables },
  result: eventResponse,
};

const eventTimeVariables = { createPath: undefined, id: eventId };
const mockedEventTimeResponse: MockedResponse = {
  request: { query: EventDocument, variables: eventTimeVariables },
  result: eventResponse,
};

const cancelEventVariables = {
  input: [
    { ...basePayload, eventStatus: EventStatus.EventCancelled, superEventType },
  ],
};
const cancelledEvent = { ...event, eventStatus: EventStatus.EventCancelled };
const cancelEventResponse = { data: { updateEvents: [cancelledEvent] } };
const cancelledEventResponse = { data: { event: cancelledEvent } };
const mockedCancelEventResponse: MockedResponse = {
  request: { query: UpdateEventsDocument, variables: cancelEventVariables },
  result: cancelEventResponse,
};
const mockedCancelledEventResponse: MockedResponse = {
  request: { query: EventDocument, variables: eventVariables },
  result: cancelledEventResponse,
};

const postponeEventVariables = {
  input: [{ ...basePayload, startTime: null, endTime: null, superEventType }],
};
const postponedEvent = {
  ...event,
  startTime: '',
  endTime: '',
  eventStatus: EventStatus.EventPostponed,
};
const postponeEventResponse = { data: { updateEvents: [postponedEvent] } };
const postponedEventResponse = { data: { event: postponedEvent } };
const mockedPostponeEventResponse: MockedResponse = {
  request: { query: UpdateEventsDocument, variables: postponeEventVariables },
  result: postponeEventResponse,
};
const mockedPostponedEventResponse: MockedResponse = {
  request: { query: EventDocument, variables: eventVariables },
  result: postponedEventResponse,
};

const deleteEventVariables = { id: eventId };
const deleteEventResponse = { data: { deleteEvent: null } };
const mockedDeleteEventResponse: MockedResponse = {
  request: { query: DeleteEventDocument, variables: deleteEventVariables },
  result: deleteEventResponse,
};

const updatedLastModifiedTime = '2021-08-23T12:00:00.000Z';
const updateEventVariables = { input: [basePayload] };
const updatedEvent = { ...event, lastModifiedTime: updatedLastModifiedTime };
const updateEventResponse = { data: { updateEvents: [updatedEvent] } };
const updatedEventResponse = { data: { event: updatedEvent } };
const mockedUpdateEventResponse: MockedResponse = {
  request: { query: UpdateEventsDocument, variables: updateEventVariables },
  result: updateEventResponse,
};
const mockedInvalidUpdateEventResponse: MockedResponse = {
  request: { query: UpdateEventsDocument, variables: updateEventVariables },
  error: {
    ...new Error(),
    result: {
      end_time: [
        'End time cannot be in the past. Please set a future end time.',
      ],
    },
  } as Error,
};

const mockedUpdatedEventResponse: MockedResponse = {
  request: { query: EventDocument, variables: eventVariables },
  result: updatedEventResponse,
};

const invalidEvent = fakeEvent({
  ...eventOverrides,
  name: { ...eventOverrides.name, fi: '' },
  publicationStatus: PublicationStatus.Draft,
});
const invalidEventResponse = { data: { event: invalidEvent } };

const mockedInvalidEventResponse: MockedResponse = {
  request: { query: EventDocument, variables: eventVariables },
  result: invalidEventResponse,
};

const subEventTimes = [
  { endTime, id: 'subevent:1', startTime },
  {
    endTime: addDays(endTime, 1),
    id: 'subevent:2',
    startTime: addDays(startTime, 1),
  },
];

const newSubEventTimes = [
  {
    endTime: addDays(endTime, 2),
    id: 'newsubevent:1',
    startTime: addDays(startTime, 2),
  },
];
const subEvents = fakeEvents(
  subEventTimes.length,
  subEventTimes.map(({ endTime, id, startTime }) => ({
    ...eventOverrides,
    endTime: endTime.toISOString(),
    id,
    startTime: startTime.toISOString(),
    superEvent: event,
  }))
);
const newSubEvents = fakeEvents(
  newSubEventTimes.length,
  newSubEventTimes.map(({ endTime, id, startTime }) => ({
    ...eventOverrides,
    endTime: endTime.toISOString(),
    id,
    startTime: startTime.toISOString(),
    superEvent: event,
  }))
);

const subEventsResponse = { data: { events: subEvents } };

const subEventsVariables = { ...SUB_EVENTS_VARIABLES, superEvent: eventId };
const mockedSubEventsResponse: MockedResponse = {
  request: { query: EventsDocument, variables: subEventsVariables },
  result: subEventsResponse,
};
const mockedSubSubEventsResponse: MockedResponse = {
  request: {
    query: EventsDocument,
    variables: {
      ...SUB_EVENTS_VARIABLES,
      superEvent: subEventTimes[0].id,
    },
  },
  result: { data: { events: fakeEvents(0) } },
};

const eventWithSubEvent = {
  ...event,
  subEvents: subEvents.data,
  superEventType: SuperEventType.Recurring,
};
const eventWithSubEventResponse = { data: { event: eventWithSubEvent } };
const mockedEventWithSubEventResponse: MockedResponse = {
  request: { query: EventDocument, variables: eventVariables },
  result: eventWithSubEventResponse,
};

const updateRecurringEventVariables = {
  input: [
    {
      ...basePayload,
      endTime: newSubEventTimes[0].endTime.toISOString(),
      startTime: subEventTimes[1].startTime.toISOString(),
      superEventType: SuperEventType.Recurring,
      subEvents: [
        { atId: subEvents.data[1]?.atId },
        ...newSubEvents.data.map((event) => ({ atId: event?.atId })),
      ],
    },
  ],
};
const updatedRecurringEvent = {
  ...eventWithSubEvent,
  lastModifiedTime: updatedLastModifiedTime,
};
const updateRecurringEventResponse = {
  data: { updateEvents: [updatedRecurringEvent] },
};
const updatedRecurringEventResponse = {
  data: { event: updatedRecurringEvent },
};
const mockedUpdateRecurringEventResponse: MockedResponse = {
  request: {
    query: UpdateEventsDocument,
    variables: updateRecurringEventVariables,
  },
  result: updateRecurringEventResponse,
};

const deleteSubEvent1Variables = { id: subEventTimes[0].id };
const deleteSubEvent1Response = { data: { deleteEvent: null } };
const mockedDeleteSubEvent1Response: MockedResponse = {
  request: { query: DeleteEventDocument, variables: deleteSubEvent1Variables },
  result: deleteSubEvent1Response,
};

const updateSubEventsVariables = {
  input: [subEventTimes[1]].map(({ endTime, id, startTime }) => ({
    ...basePayload,
    endTime: endTime.toISOString(),
    id,
    startTime: startTime.toISOString(),
    superEvent: { atId: eventWithSubEvent.atId },
    superEventType: null,
  })),
};
const updateSubEventsResponse = { data: { updateEvents: [subEvents.data[1]] } };
const mockedUpdateSubEventsResponse: MockedResponse = {
  request: { query: UpdateEventsDocument, variables: updateSubEventsVariables },
  result: updateSubEventsResponse,
};

const createNewSubEventsVariables = {
  input: newSubEventTimes.map(({ endTime, id, startTime }) => ({
    ...omit(basePayload, ['id']),
    endTime: endTime.toISOString(),
    startTime: startTime.toISOString(),
    superEvent: { atId: eventWithSubEvent.atId },
    superEventType: null,
  })),
};
const createNewSubEventsResponse = {
  data: { createEvents: newSubEvents.data },
};
const mockedCreateNewSubEventsResponse: MockedResponse = {
  request: {
    query: CreateEventsDocument,
    variables: createNewSubEventsVariables,
  },
  result: createNewSubEventsResponse,
};

const mockedUpdatedRecurringEventResponse: MockedResponse = {
  request: { query: EventDocument, variables: eventVariables },
  result: updatedRecurringEventResponse,
};

export {
  baseFormValues,
  basePayload,
  cancelEventVariables,
  endTime,
  event,
  eventId,
  eventOverrides,
  eventWithSubEvent,
  expectedValues,
  mockedCancelEventResponse,
  mockedCancelledEventResponse,
  mockedCreateNewSubEventsResponse,
  mockedDeleteEventResponse,
  mockedDeleteSubEvent1Response,
  mockedEventResponse,
  mockedEventTimeResponse,
  mockedEventWithSubEventResponse,
  mockedInvalidEventResponse,
  mockedInvalidUpdateEventResponse,
  mockedPostponedEventResponse,
  mockedPostponeEventResponse,
  mockedSubEventsResponse,
  mockedSubSubEventsResponse,
  mockedUpdatedEventResponse,
  mockedUpdatedRecurringEventResponse,
  mockedUpdateEventResponse,
  mockedUpdateRecurringEventResponse,
  mockedUpdateSubEventsResponse,
  newSubEventTimes,
  startTime,
  subEvents,
  subEventTimes,
};
