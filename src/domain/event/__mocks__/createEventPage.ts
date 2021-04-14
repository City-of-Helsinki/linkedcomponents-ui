import { MockedResponse } from '@apollo/react-testing';
import range from 'lodash/range';

import { PAGE_SIZE } from '../../../common/components/imageSelector/constants';
import { INCLUDE, KEYWORD_SETS, MAX_PAGE_SIZE } from '../../../constants';
import {
  CreateEventDocument,
  CreateEventsDocument,
  EventsDocument,
  ImageDocument,
  ImagesDocument,
  Keyword,
  KeywordDocument,
  KeywordsDocument,
  KeywordSetDocument,
  LanguagesDocument,
  OrganizationDocument,
  OrganizationsDocument,
  PlaceDocument,
  PlacesDocument,
  UpdateImageDocument,
  UserDocument,
} from '../../../generated/graphql';
import {
  fakeEvent,
  fakeEvents,
  fakeImage,
  fakeImages,
  fakeKeywords,
  fakeKeywordSet,
  fakeLanguages,
  fakeOrganization,
  fakeOrganizations,
  fakePlace,
  fakePlaces,
  fakeUser,
} from '../../../utils/mockDataUtils';

const eventValues = {
  description: 'Description',
  id: 'hel:123',
  subEventIds: ['event:1', 'event:2'],
  atId: 'https://api.hel.fi/linkedevents-test/v1/event/hel:123/',
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

const organizationId = 'organization:1';
const organizationName = 'Organization name';

const imageDetails = {
  altText: 'Image alt text',
  license: 'cc_by',
  name: 'Image name',
  photographerName: 'Imahe photographer',
};
const imageId = 'image:1';
const imageAtId = `https://api.hel.fi/linkedevents-test/v1/image/${imageId}/`;
const image = fakeImage({
  ...imageDetails,
  id: imageId,
  atId: imageAtId,
  publisher: organizationId,
});

const keywordNames = range(1, 5).map((index) => `Keyword name ${index}`);
const keywords = fakeKeywords(
  keywordNames.length,
  keywordNames.map((name, index) => ({
    id: `${index + 1}`,
    atId: `https://api.hel.fi/linkedevents-test/v1/keyword/${index + 1}/`,
    name: { fi: name },
  }))
);

const placeName = 'Place name';
const streetAddress = 'Street address';
const addressLocality = 'Address locality';
const selectedPlaceText = `${placeName} (${streetAddress}, ${addressLocality})`;
const placeId = 'location:1';
const placeAtId = `https://api.hel.fi/linkedevents-test/v1/location/${placeId}/`;
const place = fakePlace({
  id: placeId,
  atId: placeAtId,
  addressLocality: { fi: addressLocality },
  name: { fi: placeName },
  streetAddress: { fi: streetAddress },
});

const keyword = keywords.data[0] as Keyword;
const keywordName = keyword.name?.fi;
const keywordId = keyword.id;
const keywordAtId = keyword.atId;

const baseEventPayload = {
  publicationStatus: 'draft',
  audience: [],
  externalLinks: [],
  description: { ar: null, en: null, fi: '', ru: null, sv: null, zhHans: null },
  images: [],
  infoUrl: { ar: null, en: null, fi: '', ru: null, sv: null, zhHans: null },
  inLanguage: [],
  keywords: [],
  locationExtraInfo: {
    ar: null,
    en: null,
    fi: '',
    ru: null,
    sv: null,
    zhHans: null,
  },
  name: {
    ar: null,
    en: null,
    fi: eventValues.name,
    ru: null,
    sv: null,
    zhHans: null,
  },
  offers: [{ isFree: true }],
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
  superEvent: undefined,
  superEventType: null,
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
  images: [{ atId: imageAtId }],
  location: {
    atId: placeAtId,
  },
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
      atId: eventValues.id,
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
  eventValues.subEventIds.map((id) => ({
    id,
  }))
);
const createSubEventsResponse = { data: { createEvents: subEvents.data } };
const mockedCreateSubEventsResponse: MockedResponse = {
  request: {
    query: CreateEventsDocument,
    variables: createSubEventsVariables,
  },
  result: createSubEventsResponse,
};

const createPublicEventVariables = {
  input: {
    ...basePublicEventPayload,
    endTime: '2021-01-03T21:00:00.000Z',
    startTime: '2020-12-31T18:00:00.000Z',
    superEventType: 'recurring',
    subEvents: eventValues.subEventIds.map((id) => ({
      atId: `https://api.hel.fi/linkedevents-test/v1/event/${id}/`,
    })),
  },
};
const createPublicEventResponse = {
  data: {
    createEvent: fakeEvent({
      id: eventValues.id,
    }),
  },
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
  request: {
    query: EventsDocument,
    variables: umbrellaEventsVariables,
  },
  result: umbrellaEventsResponse,
};

// Mock images
const imageResponse = {
  data: {
    image,
  },
};
const mockedImageResponse: MockedResponse = {
  request: {
    query: ImageDocument,
    variables: { createPath: undefined, id: image.id },
  },
  result: imageResponse,
};

const updateImageVariables = {
  input: {
    id: imageId,
    ...imageDetails,
  },
};
const updateImageResponse = { data: { updateImage: image } };
const mockedUpdateImageResponse: MockedResponse = {
  request: {
    query: UpdateImageDocument,
    variables: updateImageVariables,
  },
  result: updateImageResponse,
};

const images = fakeImages(PAGE_SIZE, [image]);
const imagesVariables = {
  createPath: undefined,
  pageSize: PAGE_SIZE,
  publisher: organizationId,
};
const imagesResponse = {
  data: {
    images,
  },
};
const mockedImagesResponse: MockedResponse = {
  request: {
    query: ImagesDocument,
    variables: imagesVariables,
  },
  result: imagesResponse,
  newData: () => imagesResponse,
};

// Mock keywords
const keywordVariables = { id: keywordId, createPath: undefined };
const keywordResponse = { data: { keyword } };
const mockedKeywordResponse: MockedResponse = {
  request: {
    query: KeywordDocument,
    variables: keywordVariables,
  },
  result: keywordResponse,
};

const keywordsVariables = {
  createPath: undefined,
  dataSource: 'yso',
  showAllKeywords: true,
  text: '',
};
const keywordsResponse = {
  data: { keywords },
};
const mockedKeywordsResponse: MockedResponse = {
  request: {
    query: KeywordsDocument,
    variables: keywordsVariables,
  },
  result: keywordsResponse,
};

// Mock keyword sets
const audienceKeywordSet = fakeKeywordSet();
const audienceKeywordSetVariables = {
  createPath: undefined,
  id: KEYWORD_SETS.AUDIENCES,
  include: [INCLUDE.KEYWORDS],
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

const topicsKeywordSet = fakeKeywordSet({
  keywords: keywords.data,
});
const topicsKeywordSetVariables = {
  createPath: undefined,
  id: KEYWORD_SETS.TOPICS,
  include: [INCLUDE.KEYWORDS],
};
const topicsKeywordSetResponse = { data: { keywordSet: topicsKeywordSet } };
const mockedTopicsKeywordSetResponse: MockedResponse = {
  request: {
    query: KeywordSetDocument,
    variables: topicsKeywordSetVariables,
  },
  result: topicsKeywordSetResponse,
};

// Mock languages
const languages = fakeLanguages(10);
const languagesResponse = { data: { languages } };
const mockedLanguagesResponse: MockedResponse = {
  request: {
    query: LanguagesDocument,
  },
  result: languagesResponse,
};

// Mock places
const placeVariables = { id: placeId, createPath: undefined };
const placeResponse = { data: { place } };
const mockedPlaceResponse: MockedResponse = {
  request: {
    query: PlaceDocument,
    variables: placeVariables,
  },
  result: placeResponse,
};

const places = fakePlaces(10, [place]);
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

const filteredPlaces = fakePlaces(1, [place]);
const filteredPlacesVariables = {
  createPath: undefined,
  showAllPlaces: true,
  text: selectedPlaceText,
};
const filteredPlacesResponse = { data: { places: filteredPlaces } };
const mockedFilteredPlacesResponse = {
  request: {
    query: PlacesDocument,
    variables: filteredPlacesVariables,
  },
  result: filteredPlacesResponse,
};

const organization = fakeOrganization({
  id: organizationId,
  name: organizationName,
});
const organizationVariables = {
  createPath: undefined,
  id: organizationId,
};
const organizationResponse = { data: { organization } };
const mockedOrganizationResponse = {
  request: {
    query: OrganizationDocument,
    variables: organizationVariables,
  },
  result: organizationResponse,
};

const organizationsVariables = {
  createPath: undefined,
  child: organizationId,
  pageSize: MAX_PAGE_SIZE,
};
const organizationsResponse = { data: { organizations: fakeOrganizations(0) } };
const mockedOrganizationsResponse = {
  request: {
    query: OrganizationsDocument,
    variables: organizationsVariables,
  },
  result: organizationsResponse,
};

const user = fakeUser({
  organization: organizationId,
  adminOrganizations: [organizationId],
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
  eventValues,
  imageAtId,
  imageDetails,
  keywordAtId,
  keywordName,
  mockedAudienceKeywordSetResponse,
  mockedCreateDraftEventResponse,
  mockedCreatePublicEventResponse,
  mockedCreateSubEventsResponse,
  mockedFilteredPlacesResponse,
  mockedImageResponse,
  mockedImagesResponse,
  mockedKeywordResponse,
  mockedKeywordsResponse,
  mockedLanguagesResponse,
  mockedOrganizationResponse,
  mockedOrganizationsResponse,
  mockedPlaceResponse,
  mockedPlacesResponse,
  mockedTopicsKeywordSetResponse,
  mockedUmbrellaEventsResponse,
  mockedUpdateImageResponse,
  mockedUserResponse,
  organizationId,
  placeAtId,
  selectedPlaceText,
};
