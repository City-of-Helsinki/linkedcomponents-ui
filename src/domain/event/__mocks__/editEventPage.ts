import { MockedResponse } from '@apollo/react-testing';

import { EXTLINK, MAX_PAGE_SIZE } from '../../../constants';
import {
  DeleteEventDocument,
  EventDocument,
  EventsDocument,
  EventStatus,
  ImageDocument,
  KeywordDocument,
  KeywordsDocument,
  KeywordSetDocument,
  LanguagesDocument,
  OrganizationDocument,
  OrganizationsDocument,
  PlaceDocument,
  PlacesDocument,
  PublicationStatus,
  SuperEventType,
  UpdateEventsDocument,
  UpdateImageDocument,
  UserDocument,
} from '../../../generated/graphql';
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
} from '../../../utils/mockDataUtils';

const eventId = 'helsinki:1';
const audienceName = 'Audience name';
const audienceAtIds = [
  `https://api.hel.fi/linkedevents-test/v1/keyword/audience:1/`,
];
const audienceMaxAge = 18;
const audienceMinAge = 12;
const description = {
  ar: 'Description ar',
  en: 'Description en',
  fi: 'Description fi',
  ru: 'Description ru',
  sv: 'Description sv',
  zhHans: 'Description zh',
};
const formattedDescription = {
  ar: '<p>Description ar</p>',
  en: '<p>Description en</p>',
  fi: '<p>Description fi</p>',
  ru: '<p>Description ru</p>',
  sv: '<p>Description sv</p>',
  zhHans: '<p>Description zh</p>',
};
const endTime = new Date('2021-07-13T05:51:05.761Z');
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
  ar: 'http://infourl.ar',
  en: 'http://infourl.en',
  fi: 'http://infourl.fi',
  ru: 'http://infourl.ru',
  sv: 'http://infourl.sv',
  zhHans: 'http://infourl.zh',
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
  ar: 'Location extra info ar',
  en: 'Location extra info en',
  fi: 'Location extra info fi',
  ru: 'Location extra info ru',
  sv: 'Location extra info sv',
  zhHans: 'Location extra info zh',
};
const name = {
  ar: 'Name ar',
  en: 'Name en',
  fi: 'Name fi',
  ru: 'Name ru',
  sv: 'Name sv',
  zhHans: 'Name zh',
};
const offers = [
  {
    description: {
      ar: 'Description ar',
      en: 'Description en',
      fi: 'Description fi',
      ru: 'Description ru',
      sv: 'Description sv',
      zhHans: 'Description zh',
    },
    infoUrl: {
      ar: 'http://infourl.com',
      en: 'http://infourl.com',
      fi: 'http://infourl.com',
      ru: 'http://infourl.com',
      sv: 'http://infourl.com',
      zhHans: 'http://infourl.com',
    },
    price: {
      ar: 'Price ar',
      en: 'Price en',
      fi: 'Price fi',
      ru: 'Price ru',
      sv: 'Price sv',
      zhHans: 'Price zh',
    },
  },
];
const provider = {
  ar: 'Provider ar',
  en: 'Provider en',
  fi: 'Provider fi',
  ru: 'Provider ru',
  sv: 'Provider sv',
  zhHans: 'Provider zh',
};
const publisher = 'publisher:1';
const shortDescription = {
  ar: 'Short description ar',
  en: 'Short description en',
  fi: 'Short description fi',
  ru: 'Short description ru',
  sv: 'Short description sv',
  zhHans: 'Short description zh',
};
const startTime = new Date('2021-07-11T05:51:05.761Z');
const superEventType = null;
const twitterUrl = 'http://twitter.com';

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

const audienceKeywordSet = fakeKeywordSet({ keywords: audience.data });
const topicsKeywordSet = fakeKeywordSet({ keywords: keywords.data });

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
};

const basePayload = {
  publicationStatus: PublicationStatus.Public,
  audience: audienceAtIds.map((atId) => ({ atId })),
  audienceMaxAge,
  audienceMinAge,
  externalLinks: [
    { name: EXTLINK.EXTLINK_FACEBOOK, link: facebookUrl, language: 'fi' },
    { name: EXTLINK.EXTLINK_INSTAGRAM, link: instagramUrl, language: 'fi' },
    { name: EXTLINK.EXTLINK_TWITTER, link: twitterUrl, language: 'fi' },
  ],
  description: formattedDescription,
  images: imageAtIds.map((atId) => ({ atId })),
  videos: [],
  infoUrl,
  inLanguage: inLanguageAtIds.map((atId) => ({ atId })),
  location: { atId: locationAtId },
  keywords: keywordAtIds.map((atId) => ({ atId })),
  locationExtraInfo,
  name,
  offers: offers.map((offer) => ({ ...offer, isFree: false })),
  provider,
  publisher,
  shortDescription,
  endTime: endTime.toISOString(),
  startTime: startTime.toISOString(),
  superEvent: undefined,
  superEventType: null,
  id: eventId,
};

const locationText = `${locationName} (${streetAddress}, ${addressLocality})`;

const expectedValues = {
  audienceMaxAge,
  audienceMinAge,
  endTime: '13.07.2021 05.51',
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
  startTime: '11.07.2021 05.51',
  twitterUrl,
  updatedLastModifiedTime: '23.08.2021 12.00',
};

const event = fakeEvent(eventOverrides);

// Event mocks
const eventVariables = {
  createPath: undefined,
  id: eventId,
  include: ['audience', 'keywords', 'location', 'sub_events', 'super_event'],
};
const eventResponse = { data: { event } };
const mockedEventResponse: MockedResponse = {
  request: {
    query: EventDocument,
    variables: eventVariables,
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

const subEventId = 'subevent:1';
const subEvents = fakeEvents(1, [
  { ...eventOverrides, id: subEventId, superEvent: event },
]);
const subEventsResponse = { data: { events: subEvents } };

const baseEventsVariables = {
  createPath: undefined,
  include: ['audience', 'keywords', 'location', 'sub_events', 'super_event'],
  pageSize: 100,
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
      superEvent: subEventId,
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

const updateEventWithSubEventVariables = {
  input: [
    {
      ...basePayload,
      superEventType: SuperEventType.Recurring,
    },
    {
      ...basePayload,
      id: subEventId,
      superEvent: {
        atId: eventWithSubEvent.atId,
      },
      superEventType: null,
    },
  ],
};
const updateEventWithSubEventResponse = {
  data: {
    event: {
      ...eventWithSubEvent,
      lastModifiedTime: updatedLastModifiedTime,
    },
  },
};
const mockedUpdateEventWithSubEventResponse: MockedResponse = {
  request: {
    query: UpdateEventsDocument,
    variables: updateEventWithSubEventVariables,
  },
  result: updateEventWithSubEventResponse,
};
const mockedUpdatedEventWithSubEventResponse: MockedResponse = {
  request: { query: EventDocument, variables: eventVariables },
  result: updateEventWithSubEventResponse,
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

// Keyword mocks
const keywordVariables = {
  createPath: undefined,
  id: keywordId,
};
const keywordResponse = { data: { keyword: keywords.data[0] } };
const mockedKeywordResponse: MockedResponse = {
  request: {
    query: KeywordDocument,
    variables: keywordVariables,
  },
  result: keywordResponse,
};
const keywordsVariables = {
  createPath: undefined,
  freeText: '',
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
const placeVariables = {
  createPath: undefined,
  id: locationId,
};
const placeResponse = { data: { place: places.data[0] } };
const mockedPlaceResponse: MockedResponse = {
  request: {
    query: PlaceDocument,
    variables: placeVariables,
  },
  result: placeResponse,
};

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
  id: 'user:1',
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
  event,
  eventId,
  expectedValues,
  keywordName,
  mockedAudienceKeywordSetResponse,
  mockedCancelEventResponse,
  mockedCancelledEventResponse,
  mockedDeleteEventResponse,
  mockedEventResponse,
  mockedEventWithSubEventResponse,
  mockedFilteredPlacesResponse,
  mockedImageResponse,
  mockedInvalidEventResponse,
  mockedKeywordResponse,
  mockedKeywordsResponse,
  mockedLanguagesResponse,
  mockedOrganizationAncestorsResponse,
  mockedOrganizationResponse,
  mockedPlaceResponse,
  mockedPlacesResponse,
  mockedPostponedEventResponse,
  mockedPostponeEventResponse,
  mockedSubEventsResponse,
  mockedSubSubEventsResponse,
  mockedTopicsKeywordSetResponse,
  mockedUpdatedEventResponse,
  mockedUpdatedEventWithSubEventResponse,
  mockedUpdateEventResponse,
  mockedUpdateEventWithSubEventResponse,
  mockedUpdateImageResponse,
  mockedUserResponse,
};
