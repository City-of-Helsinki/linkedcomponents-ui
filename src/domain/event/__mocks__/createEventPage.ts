import { MockedResponse } from '@apollo/client/testing';

import {
  CreateEventDocument,
  CreateEventsDocument,
  EventsDocument,
  Keyword,
  KeywordDocument,
  KeywordsDocument,
} from '../../../generated/graphql';
import generateAtId from '../../../utils/generateAtId';
import { fakeEvent, fakeEvents } from '../../../utils/mockDataUtils';
import { imageFields } from '../../image/__mocks__/image';
import { topics } from '../../keywordSet/__mocks__/keywordSets';
import { organizationId } from '../../organization/__mocks__/organization';
import { placeAtId } from '../../place/__mocks__/place';

const id = 'hel:123';
const eventValues = {
  description: '<p>Description</p>',
  id,
  subEventIds: ['event:1', 'event:2'],
  atId: generateAtId(id, 'event'),
  name: 'Event name',
  shortDescription: 'Short description',
  eventTimes: [
    {
      endTime: new Date('2020-12-31T21:00:00.000Z'),
      id: null,
      startTime: new Date('2020-12-31T18:00:00.000Z'),
    },
    {
      endTime: new Date('2021-01-03T21:00:00.000Z'),
      id: null,
      startTime: new Date('2021-01-03T18:00:00.000Z'),
    },
  ],
};

const keyword = topics.data[0] as Keyword;
const keywordName = keyword.name?.fi as string;
const keywordId = keyword.id;
const keywordAtId = keyword.atId;

const baseEventPayload = {
  publicationStatus: 'draft',
  audience: [],
  audienceMaxAge: null,
  audienceMinAge: null,
  externalLinks: [],
  description: { ar: null, en: null, fi: '', ru: null, sv: null, zhHans: null },
  enrolmentEndTime: null,
  enrolmentStartTime: null,
  images: [],
  infoUrl: { ar: null, en: null, fi: '', ru: null, sv: null, zhHans: null },
  inLanguage: [],
  keywords: [],
  location: null,
  locationExtraInfo: {
    ar: null,
    en: null,
    fi: '',
    ru: null,
    sv: null,
    zhHans: null,
  },
  maximumAttendeeCapacity: null,
  minimumAttendeeCapacity: null,
  name: {
    ar: null,
    en: null,
    fi: eventValues.name,
    ru: null,
    sv: null,
    zhHans: null,
  },
  offers: [
    {
      infoUrl: { ar: null, en: null, fi: '', ru: null, sv: null, zhHans: null },
      isFree: true,
    },
  ],
  provider: { ar: null, en: null, fi: '', ru: null, sv: null, zhHans: null },
  publisher: organizationId,
  shortDescription: {
    ar: null,
    en: null,
    fi: '',
    ru: null,
    sv: null,
    zhHans: null,
  },
  superEvent: null,
  superEventType: null,
  typeId: 'General',
  videos: [],
};

const basePublicEventPayload = {
  ...baseEventPayload,
  publicationStatus: 'public',
  description: {
    ar: null,
    en: null,
    fi: '<p>Description</p>',
    ru: null,
    sv: null,
    zhHans: null,
  },
  images: [{ atId: imageFields.atId }],
  location: { atId: placeAtId },
  keywords: [{ atId: keywordAtId }],
  shortDescription: {
    ar: null,
    en: null,
    fi: eventValues.shortDescription,
    ru: null,
    sv: null,
    zhHans: null,
  },
};

// Mock events
const createDraftEventVariables = {
  input: {
    ...baseEventPayload,
    endTime: '2020-12-31T21:00:00.000Z',
    startTime: '2020-12-31T18:00:00.000Z',
  },
};
const createDraftEventResponse = {
  data: {
    createEvent: fakeEvent({
      id: eventValues.id,
      name: { fi: eventValues.name },
    }),
  },
};
const mockedCreateDraftEventResponse: MockedResponse = {
  request: {
    query: CreateEventDocument,
    variables: createDraftEventVariables,
  },
  result: createDraftEventResponse,
};

const mockedInvalidCreateDraftEventResponse: MockedResponse = {
  request: {
    query: CreateEventDocument,
    variables: createDraftEventVariables,
  },
  error: {
    ...new Error(),
    result: {
      end_time: [
        'End time cannot be in the past. Please set a future end time.',
      ],
    },
  } as Error,
};

const createSubEventsVariables = {
  input: [
    {
      ...basePublicEventPayload,
      endTime: '2020-12-31T21:00:00.000Z',
      startTime: '2020-12-31T18:00:00.000Z',
    },
    {
      ...basePublicEventPayload,
      endTime: '2021-01-03T21:00:00.000Z',
      startTime: '2021-01-03T18:00:00.000Z',
    },
  ],
};
const subEvents = fakeEvents(
  eventValues.subEventIds.length,
  eventValues.subEventIds.map((id) => ({ id }))
);
const createSubEventsResponse = { data: { createEvents: subEvents.data } };
const mockedCreateSubEventsResponse: MockedResponse = {
  request: { query: CreateEventsDocument, variables: createSubEventsVariables },
  result: createSubEventsResponse,
};

const createPublicEventVariables = {
  input: {
    ...basePublicEventPayload,
    endTime: '2021-01-03T21:00:00.000Z',
    startTime: '2020-12-31T18:00:00.000Z',
    superEventType: 'recurring',
    subEvents: eventValues.subEventIds.map((id) => ({
      atId: generateAtId(id, 'event'),
    })),
  },
};
const createPublicEventResponse = {
  data: { createEvent: fakeEvent({ id: eventValues.id }) },
};
const mockedCreatePublicEventResponse: MockedResponse = {
  request: {
    query: CreateEventDocument,
    variables: createPublicEventVariables,
  },
  result: createPublicEventResponse,
};

const umbrellaEventsVariables = {
  createPath: undefined,
  superEventType: ['umbrella'],
  text: '',
};
const umbrellaEventsResponse = { data: { events: fakeEvents(1) } };
const mockedUmbrellaEventsResponse: MockedResponse = {
  request: { query: EventsDocument, variables: umbrellaEventsVariables },
  result: umbrellaEventsResponse,
};

// Mock keywords
const keywordVariables = { id: keywordId, createPath: undefined };
const keywordResponse = { data: { keyword } };
const mockedKeywordResponse: MockedResponse = {
  request: { query: KeywordDocument, variables: keywordVariables },
  result: keywordResponse,
};

const keywordsVariables = {
  createPath: undefined,
  dataSource: ['yso', 'helsinki'],
  showAllKeywords: true,
  text: '',
};
const keywordsResponse = { data: { keywords: topics } };
const mockedKeywordsResponse: MockedResponse = {
  request: { query: KeywordsDocument, variables: keywordsVariables },
  result: keywordsResponse,
};

// Mock places

export {
  eventValues,
  keywordAtId,
  keywordName,
  mockedCreateDraftEventResponse,
  mockedCreatePublicEventResponse,
  mockedCreateSubEventsResponse,
  mockedInvalidCreateDraftEventResponse,
  mockedKeywordResponse,
  mockedKeywordsResponse,
  mockedUmbrellaEventsResponse,
};
