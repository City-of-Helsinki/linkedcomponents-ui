import { MockedResponse } from '@apollo/client/testing';
import addDays from 'date-fns/addDays';
import addHours from 'date-fns/addHours';
import startOfDay from 'date-fns/startOfDay';
import omit from 'lodash/omit';

import {
  DATETIME_FORMAT,
  EXTLINK,
  KEYWORD_SETS,
  MAX_PAGE_SIZE,
  TEST_USER_ID,
} from '../../../constants';
import {
  CreateEventsDocument,
  DeleteEventDocument,
  EventDocument,
  EventsDocument,
  EventStatus,
  EventTypeId,
  ImageDocument,
  KeywordsDocument,
  KeywordSetDocument,
  LanguagesDocument,
  OrganizationDocument,
  OrganizationsDocument,
  PlacesDocument,
  PublicationStatus,
  SuperEventType,
  UpdateEventsDocument,
  UpdateImageDocument,
  UserDocument,
} from '../../../generated/graphql';
import formatDate from '../../../utils/formatDate';
import {
  fakeEvent,
  fakeEvents,
  fakeExternalLink,
  fakeImages,
  fakeKeywords,
  fakeKeywordSet,
  fakeLanguages,
  fakeOffers,
  fakeOrganization,
  fakeOrganizations,
  fakePlace,
  fakePlaces,
  fakeUser,
  fakeVideo,
} from '../../../utils/mockDataUtils';
import { EVENT_INCLUDES } from '../../event/constants';

const now = new Date();

const eventId = 'helsinki:1';
const audienceName = 'Audience name';
const audienceAtIds = [
  `https://api.hel.fi/linkedevents-test/v1/keyword/audience:1/`,
];
const audienceMaxAge = 18;
const audienceMinAge = 12;
const description = {
  ar: null,
  en: null,
  fi: 'Description fi',
  ru: null,
  sv: 'Description sv',
  zhHans: null,
};
const formattedDescription = {
  ar: null,
  en: null,
  fi: '<p>Description fi</p>',
  ru: null,
  sv: '<p>Description sv</p>',
  zhHans: null,
};
const startTime = addDays(addHours(startOfDay(now), 12), 1);
const endTime = addHours(startTime, 3);
const facebookUrl = 'http://facebook.com';
const imageDetails = {
  altText: 'Image alt text',
  license: 'cc_by',
  name: 'Image name',
  photographerName: 'Photographer name',
};
const imageId = 'image:1';
const imageAtIds = [
  `https://api.hel.fi/linkedevents-test/v1/image/${imageId}/`,
];

const infoUrl = {
  ar: null,
  en: null,
  fi: 'http://infourl.fi',
  ru: null,
  sv: 'http://infourl.sv',
  zhHans: null,
};
const inLanguageAtIds = [
  `https://api.hel.fi/linkedevents-test/v1/language/language:1/`,
  `https://api.hel.fi/linkedevents-test/v1/language/language:2/`,
];
const instagramUrl = 'http://instagram.com';
const keywordName = 'Keyword name';
const keywordId = 'keyword:1';
const keywordAtIds = [
  `https://api.hel.fi/linkedevents-test/v1/keyword/${keywordId}/`,
];
const lastModifiedTime = '2021-07-01T12:00:00.000Z';
const locationName = 'Location name';
const streetAddress = 'Venue address';
const addressLocality = 'Helsinki';
const locationId = 'location:1';
const locationAtId = `https://api.hel.fi/linkedevents-test/v1/place/${locationId}/`;
const locationExtraInfo = {
  ar: null,
  en: null,
  fi: 'Location extra info fi',
  ru: null,
  sv: 'Location extra info sv',
  zhHans: null,
};
const name = {
  ar: null,
  en: null,
  fi: 'Name fi',
  ru: null,
  sv: 'Name sv',
  zhHans: null,
};
const offers = [
  {
    description: {
      ar: null,
      en: null,
      fi: 'Description fi',
      ru: null,
      sv: 'Description sv',
      zhHans: null,
    },
    infoUrl: {
      ar: null,
      en: null,
      fi: 'http://infourl.com',
      ru: null,
      sv: 'http://infourl.com',
      zhHans: null,
    },
    price: {
      ar: null,
      en: null,
      fi: 'Price fi',
      ru: null,
      sv: 'Price sv',
      zhHans: null,
    },
  },
];
const provider = {
  ar: null,
  en: null,
  fi: 'Provider fi',
  ru: null,
  sv: 'Provider sv',
  zhHans: null,
};
const publisher = 'publisher:1';
const shortDescription = {
  ar: null,
  en: null,
  fi: 'Short description fi',
  ru: null,
  sv: 'Short description sv',
  zhHans: null,
};

const superEventType = null;
const twitterUrl = 'http://twitter.com';
const videoDetails = {
  altText: 'Video alt text',
  name: 'Video name',
  url: 'http://videourl.com',
};

const audience = fakeKeywords(
  audienceAtIds.length,
  audienceAtIds.map((atId) => ({ atId, name: { fi: audienceName } }))
);

const images = fakeImages(
  imageAtIds.length,
  imageAtIds.map((atId) => ({ atId, id: imageId, ...imageDetails, publisher }))
);

const keywords = fakeKeywords(
  keywordAtIds.length,
  keywordAtIds.map((atId) => ({
    atId,
    id: keywordId,
    name: { fi: keywordName },
  }))
);

const audienceKeywordSet = fakeKeywordSet({
  id: KEYWORD_SETS.AUDIENCES,
  keywords: audience.data,
});
const topicsKeywordSet = fakeKeywordSet({
  id: KEYWORD_SETS.TOPICS,
  keywords: keywords.data,
});

const languages = fakeLanguages(
  inLanguageAtIds.length,
  inLanguageAtIds.map((atId) => ({ atId }))
);

const location = fakePlace({
  atId: locationAtId,
  addressLocality: { fi: addressLocality },
  name: { fi: locationName },
  streetAddress: { fi: streetAddress },
});

const places = fakePlaces(1, [location]);

const eventOverrides = {
  id: eventId,
  audience: audience.data,
  audienceMaxAge,
  audienceMinAge,
  description,
  endTime: endTime.toISOString(),
  externalLinks: [
    fakeExternalLink({
      name: EXTLINK.EXTLINK_FACEBOOK,
      link: facebookUrl,
    }),
    fakeExternalLink({
      name: EXTLINK.EXTLINK_INSTAGRAM,
      link: instagramUrl,
    }),
    fakeExternalLink({
      name: EXTLINK.EXTLINK_TWITTER,
      link: twitterUrl,
    }),
  ],
  images: images.data,
  infoUrl,
  inLanguage: languages.data,
  keywords: keywords.data,
  lastModifiedTime,
  location,
  locationExtraInfo,
  name,
  offers: fakeOffers(
    offers.length,
    offers.map((offer) => ({
      ...offer,
      isFree: false,
    }))
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
  enrolmentEndTime: null,
  enrolmentStartTime: null,
  externalLinks: [
    { name: EXTLINK.EXTLINK_FACEBOOK, link: facebookUrl, language: 'fi' },
    { name: EXTLINK.EXTLINK_INSTAGRAM, link: instagramUrl, language: 'fi' },
    { name: EXTLINK.EXTLINK_TWITTER, link: twitterUrl, language: 'fi' },
  ],
  description: formattedDescription,
  images: imageAtIds.map((atId) => ({ atId })),
  videos: [videoDetails],
  infoUrl,
  inLanguage: inLanguageAtIds.map((atId) => ({ atId })),
  location: { atId: locationAtId },
  keywords: keywordAtIds.map((atId) => ({ atId })),
  locationExtraInfo,
  maximumAttendeeCapacity: null,
  minimumAttendeeCapacity: null,
  name,
  offers: offers.map((offer) => ({ ...offer, isFree: false })),
  provider,
  publisher,
  shortDescription,
  endTime: endTime.toISOString(),
  startTime: startTime.toISOString(),
  superEvent: undefined,
  superEventType: null,
  typeId: EventTypeId.General,
  id: eventId,
};

const locationText = `${locationName} (${streetAddress}, ${addressLocality})`;

const expectedValues = {
  audienceMaxAge,
  audienceMinAge,
  endTime: formatDate(endTime, DATETIME_FORMAT),
  description: description.fi,
  facebookUrl,
  imageAltText: imageDetails.altText,
  imageName: imageDetails.name,
  imagePhotographerName: imageDetails.photographerName,
  infoUrl: infoUrl.fi,
  instagramUrl,
  lastModifiedTime: '01.07.2021 12.00',
  location: locationText,
  locationExtraInfo: locationExtraInfo.fi,
  name: name.fi,
  provider: provider.fi,
  shortDescription: shortDescription.fi,
  startTime: formatDate(startTime, DATETIME_FORMAT),
  twitterUrl,
  updatedLastModifiedTime: '23.08.2021 12.00',
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
  request: {
    query: EventDocument,
    variables: eventVariables,
  },
  result: eventResponse,
};

const eventTimeVariables = {
  createPath: undefined,
  id: eventId,
};
const mockedEventTimeResponse: MockedResponse = {
  request: {
    query: EventDocument,
    variables: eventTimeVariables,
  },
  result: eventResponse,
};

const cancelEventVariables = {
  input: [
    {
      ...basePayload,
      eventStatus: EventStatus.EventCancelled,
      superEventType,
    },
  ],
};

const cancelEventResponse = {
  data: { event: { ...event, eventStatus: EventStatus.EventCancelled } },
};
const mockedCancelEventResponse: MockedResponse = {
  request: {
    query: UpdateEventsDocument,
    variables: cancelEventVariables,
  },
  result: cancelEventResponse,
};
const mockedCancelledEventResponse: MockedResponse = {
  request: {
    query: EventDocument,
    variables: eventVariables,
  },
  result: cancelEventResponse,
};

const postponeEventVariables = {
  input: [{ ...basePayload, startTime: null, endTime: null, superEventType }],
};
const postponeEventResponse = {
  data: {
    event: {
      ...event,
      startTime: '',
      endTime: '',
      eventStatus: EventStatus.EventPostponed,
    },
  },
};
const mockedPostponeEventResponse: MockedResponse = {
  request: {
    query: UpdateEventsDocument,
    variables: postponeEventVariables,
  },
  result: postponeEventResponse,
};
const mockedPostponedEventResponse: MockedResponse = {
  request: {
    query: EventDocument,
    variables: eventVariables,
  },
  result: postponeEventResponse,
};

const deleteEventVariables = {
  id: eventId,
};
const deleteEventResponse = {
  data: null,
};
const mockedDeleteEventResponse: MockedResponse = {
  request: {
    query: DeleteEventDocument,
    variables: deleteEventVariables,
  },
  result: deleteEventResponse,
};

const updatedLastModifiedTime = '2021-08-23T12:00:00.000Z';
const updateEventVariables = {
  input: [basePayload],
};
const updateEventResponse = {
  data: {
    event: {
      ...event,
      lastModifiedTime: updatedLastModifiedTime,
    },
  },
};
const mockedUpdateEventResponse: MockedResponse = {
  request: {
    query: UpdateEventsDocument,
    variables: updateEventVariables,
  },
  result: updateEventResponse,
};

const mockedUpdatedEventResponse: MockedResponse = {
  request: {
    query: EventDocument,
    variables: eventVariables,
  },
  result: updateEventResponse,
};

const invalidEvent = fakeEvent({
  ...eventOverrides,
  name: { ...eventOverrides.name, fi: '' },
  publicationStatus: PublicationStatus.Draft,
});
const invalidEventResponse = { data: { event: invalidEvent } };

const mockedInvalidEventResponse: MockedResponse = {
  request: {
    query: EventDocument,
    variables: eventVariables,
  },
  result: invalidEventResponse,
};

formatDate(endTime, DATETIME_FORMAT);

const subEventTimes = [
  {
    endTime,
    id: 'subevent:1',
    startTime,
  },
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

const baseEventsVariables = {
  createPath: undefined,
  include: EVENT_INCLUDES,
  pageSize: MAX_PAGE_SIZE,
  showAll: true,
  sort: 'start_time',
};
const subEventsVariables = { ...baseEventsVariables, superEvent: eventId };
const mockedSubEventsResponse: MockedResponse = {
  request: {
    query: EventsDocument,
    variables: subEventsVariables,
  },
  result: subEventsResponse,
};
const mockedSubSubEventsResponse: MockedResponse = {
  request: {
    query: EventsDocument,
    variables: {
      ...baseEventsVariables,
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
  request: {
    query: EventDocument,
    variables: eventVariables,
  },
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
        { atId: subEvents.data[1].atId },
        ...newSubEvents.data.map(({ atId }) => ({ atId })),
      ],
    },
  ],
};
const updateRecurringEventResponse = {
  data: {
    event: {
      ...eventWithSubEvent,
      lastModifiedTime: updatedLastModifiedTime,
    },
  },
};
const mockedUpdateRecurringEventResponse: MockedResponse = {
  request: {
    query: UpdateEventsDocument,
    variables: updateRecurringEventVariables,
  },
  result: updateRecurringEventResponse,
};

const deleteSubEvent1Variables = {
  id: subEventTimes[0].id,
};
const deleteSubEvent1Response = {
  data: null,
};
const mockedDeleteSubEvent1Response: MockedResponse = {
  request: {
    query: DeleteEventDocument,
    variables: deleteSubEvent1Variables,
  },
  result: deleteSubEvent1Response,
};

const updateSubEventsVariables = {
  input: [subEventTimes[1]].map(({ endTime, id, startTime }) => ({
    ...basePayload,
    endTime: endTime.toISOString(),
    id,
    startTime: startTime.toISOString(),
    superEvent: {
      atId: eventWithSubEvent.atId,
    },
    superEventType: null,
  })),
};
const updateSubEventsResponse = {
  data: {
    updateEvents: [subEvents.data[1]],
  },
};
const mockedUpdateSubEventsResponse: MockedResponse = {
  request: {
    query: UpdateEventsDocument,
    variables: updateSubEventsVariables,
  },
  result: updateSubEventsResponse,
};

const createNewSubEventsVariables = {
  input: newSubEventTimes.map(({ endTime, id, startTime }) => ({
    ...omit(basePayload, ['id']),
    endTime: endTime.toISOString(),
    startTime: startTime.toISOString(),
    superEvent: {
      atId: eventWithSubEvent.atId,
    },
    superEventType: null,
  })),
};
const createNewSubEventsResponse = {
  data: {
    createEvents: newSubEvents.data,
  },
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
  result: updateRecurringEventResponse,
};

// Image mocks
const imageVariables = {
  createPath: undefined,
  id: imageId,
};
const imageResponse = { data: { image: images.data[0] } };
const mockedImageResponse: MockedResponse = {
  request: {
    query: ImageDocument,
    variables: imageVariables,
  },
  result: imageResponse,
};

const updateImageVariables = {
  input: {
    id: imageId,
    ...imageDetails,
  },
};
const updateImageResponse = { data: { updateImage: images.data[0] } };
const mockedUpdateImageResponse: MockedResponse = {
  request: {
    query: UpdateImageDocument,
    variables: updateImageVariables,
  },
  result: updateImageResponse,
};

const keywordsVariables = {
  createPath: undefined,
  dataSource: 'yso',
  showAllKeywords: true,
  text: '',
};
const keywordsResponse = { data: { keywords } };
const mockedKeywordsResponse: MockedResponse = {
  request: {
    query: KeywordsDocument,
    variables: keywordsVariables,
  },
  result: keywordsResponse,
};

// Keyword set mocks
const audienceKeywordSetVariables = {
  createPath: undefined,
  id: 'helsinki:audiences',
  include: ['keywords'],
};
const audienceKeywordSetResponse = {
  data: { keywordSet: audienceKeywordSet },
};
const mockedAudienceKeywordSetResponse: MockedResponse = {
  request: {
    query: KeywordSetDocument,
    variables: audienceKeywordSetVariables,
  },
  result: audienceKeywordSetResponse,
};

const topicsKeywordSetVariables = {
  createPath: undefined,
  id: 'helsinki:topics',
  include: ['keywords'],
};
const topicsKeywordSetResponse = {
  data: { keywordSet: topicsKeywordSet },
};
const mockedTopicsKeywordSetResponse: MockedResponse = {
  request: {
    query: KeywordSetDocument,
    variables: topicsKeywordSetVariables,
  },
  result: topicsKeywordSetResponse,
};

// Language mocks
const languagesResponse = { data: { languages } };
const mockedLanguagesResponse: MockedResponse = {
  request: {
    query: LanguagesDocument,
  },
  result: languagesResponse,
};

// Organization mocked
const organization = fakeOrganization({
  id: publisher,
});
const organizationVariables = {
  createPath: undefined,
  id: publisher,
};
const organizationResponse = { data: { organization } };
const mockedOrganizationResponse = {
  request: {
    query: OrganizationDocument,
    variables: organizationVariables,
  },
  result: organizationResponse,
};

const organizationAncestorsVariables = {
  createPath: undefined,
  child: publisher,
  pageSize: MAX_PAGE_SIZE,
};
const organizationAncestorsResponse = {
  data: { organizations: fakeOrganizations(0) },
};
const mockedOrganizationAncestorsResponse: MockedResponse = {
  request: {
    query: OrganizationsDocument,
    variables: organizationAncestorsVariables,
  },
  result: organizationAncestorsResponse,
};

// Place mocks
const placesVariables = {
  createPath: undefined,
  showAllPlaces: true,
  text: '',
};
const placesResponse = { data: { places } };
const mockedPlacesResponse: MockedResponse = {
  request: {
    query: PlacesDocument,
    variables: placesVariables,
  },
  result: placesResponse,
};

const filteredPlacesVariables = {
  createPath: undefined,
  showAllPlaces: true,
  text: locationText,
};
const mockedFilteredPlacesResponse: MockedResponse = {
  request: {
    query: PlacesDocument,
    variables: filteredPlacesVariables,
  },
  result: placesResponse,
};

// User mocks
const user = fakeUser({
  organization: publisher,
  adminOrganizations: [publisher],
});
const userVariables = {
  createPath: undefined,
  id: TEST_USER_ID,
};
const userResponse = { data: { user } };
const mockedUserResponse = {
  request: {
    query: UserDocument,
    variables: userVariables,
  },
  result: userResponse,
};

export {
  audienceName,
  cancelEventVariables,
  event,
  eventId,
  expectedValues,
  keywordName,
  mockedAudienceKeywordSetResponse,
  mockedCancelEventResponse,
  mockedCancelledEventResponse,
  mockedCreateNewSubEventsResponse,
  mockedDeleteEventResponse,
  mockedDeleteSubEvent1Response,
  mockedEventResponse,
  mockedEventTimeResponse,
  mockedEventWithSubEventResponse,
  mockedFilteredPlacesResponse,
  mockedImageResponse,
  mockedInvalidEventResponse,
  mockedKeywordsResponse,
  mockedLanguagesResponse,
  mockedOrganizationAncestorsResponse,
  mockedOrganizationResponse,
  mockedPlacesResponse,
  mockedPostponedEventResponse,
  mockedPostponeEventResponse,
  mockedSubEventsResponse,
  mockedSubSubEventsResponse,
  mockedTopicsKeywordSetResponse,
  mockedUpdatedEventResponse,
  mockedUpdatedRecurringEventResponse,
  mockedUpdateEventResponse,
  mockedUpdateImageResponse,
  mockedUpdateRecurringEventResponse,
  mockedUpdateSubEventsResponse,
  mockedUserResponse,
  newSubEventTimes,
  subEventTimes,
};
