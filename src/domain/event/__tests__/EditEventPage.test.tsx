import { MockedResponse } from '@apollo/react-testing';
import merge from 'lodash/merge';
import React from 'react';

import { defaultStoreState, EXTLINK, ROUTES } from '../../../constants';
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
  PlaceDocument,
  PlacesDocument,
  PublicationStatus,
  SuperEventType,
  UpdateEventsDocument,
  UpdateImageDocument,
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
  fakePlace,
  fakePlaces,
} from '../../../utils/mockDataUtils';
import {
  configure,
  getMockReduxStore,
  renderWithRoute,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../utils/testUtils';
import { API_CLIENT_ID } from '../../auth/constants';
import EditEventPage from '../EditEventPage';

configure({ defaultHidden: true });

const id = 'helsinki:1';
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

const images = fakeImages(
  imageAtIds.length,
  imageAtIds.map((atId) => ({ atId, id: imageId, ...imageDetails }))
);

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
const locationText = `${locationName} (${streetAddress}, ${addressLocality})`;
const locationAtId =
  'https://api.hel.fi/linkedevents-test/v1/place/location:1/';
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
const audienceKeywordSet = fakeKeywordSet({ keywords: audience.data });

const keywords = fakeKeywords(
  keywordAtIds.length,
  keywordAtIds.map((atId) => ({
    atId,
    id: keywordId,
    name: { fi: keywordName },
  }))
);

const location = fakePlace({
  atId: locationAtId,
  addressLocality: { fi: addressLocality },
  name: { fi: locationName },
  streetAddress: { fi: streetAddress },
});
const places = fakePlaces(1, [location]);

const topicsKeywordSet = fakeKeywordSet({ keywords: keywords.data });
const languages = fakeLanguages(
  inLanguageAtIds.length,
  inLanguageAtIds.map((atId) => ({ atId }))
);

const event = fakeEvent({
  id,
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
  shortDescription,
  startTime: startTime.toISOString(),
  superEventType,
});

const eventVariables = {
  createPath: undefined,
  id,
  include: ['audience', 'keywords', 'location', 'sub_events', 'super_event'],
};

const audienceKeywordSetResponse = {
  data: { keywordSet: audienceKeywordSet },
};
const eventResponse = { data: { event } };
const imageResponse = { data: { image: images.data[0] } };
const keywordResponse = { data: { keyword: keywords.data[0] } };
const keywordsResponse = { data: { keywords } };
const languagesResponse = { data: { languages } };
const placeResponse = { data: { place: places.data[0] } };
const placesResponse = { data: { places } };
const topicsKeywordSetResponse = {
  data: { keywordSet: topicsKeywordSet },
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
  description,
  images: imageAtIds.map((atId) => ({ atId })),
  infoUrl,
  inLanguage: inLanguageAtIds.map((atId) => ({ atId })),
  location: { atId: locationAtId },
  keywords: keywordAtIds.map((atId) => ({ atId })),
  locationExtraInfo,
  name,
  offers: offers.map((offer) => ({ ...offer, isFree: false })),
  provider,
  shortDescription,
  endTime: endTime.toISOString(),
  startTime: startTime.toISOString(),
  id,
};

const baseMocks = [
  {
    request: {
      query: EventDocument,
      variables: eventVariables,
    },
    result: eventResponse,
  },
  {
    request: {
      query: ImageDocument,
      variables: {
        createPath: undefined,
        id: imageId,
      },
    },
    result: imageResponse,
  },
  {
    request: {
      query: KeywordDocument,
      variables: {
        createPath: undefined,
        id: keywordId,
      },
    },
    result: keywordResponse,
  },
  {
    request: {
      query: KeywordsDocument,
      variables: {
        createPath: undefined,
        freeText: '',
      },
    },
    result: keywordsResponse,
  },
  {
    request: {
      query: KeywordSetDocument,
      variables: {
        createPath: undefined,
        id: 'helsinki:audiences',
        include: ['keywords'],
      },
    },
    result: audienceKeywordSetResponse,
  },
  {
    request: {
      query: KeywordSetDocument,
      variables: {
        createPath: undefined,
        id: 'helsinki:topics',
        include: ['keywords'],
      },
    },
    result: topicsKeywordSetResponse,
  },
  {
    request: {
      query: LanguagesDocument,
    },
    result: languagesResponse,
  },
  {
    request: {
      query: PlaceDocument,
      variables: {
        createPath: undefined,
        id: 'location:1',
      },
    },
    result: placeResponse,
  },
  {
    request: {
      query: PlacesDocument,
      variables: {
        createPath: undefined,
        showAllPlaces: true,
        text: '',
      },
    },
    result: placesResponse,
  },
  {
    request: {
      query: PlacesDocument,
      variables: {
        createPath: undefined,
        showAllPlaces: true,
        text: locationText,
      },
    },
    result: placesResponse,
  },
];

const apiToken = { [API_CLIENT_ID]: 'api-token' };
const userName = 'Test user';
const user = { profile: { name: userName } };
const state = merge({}, defaultStoreState, {
  authentication: {
    oidc: { user },
    token: { apiToken },
  },
});
const store = getMockReduxStore(state);

const route = ROUTES.EDIT_EVENT.replace(':id', id);

const renderComponent = (mocks: MockedResponse[] = baseMocks) =>
  renderWithRoute(<EditEventPage />, {
    mocks,
    routes: [route],
    path: ROUTES.EDIT_EVENT,
    store,
  });

const findInput = (
  key:
    | 'audience'
    | 'audienceMaxAge'
    | 'audienceMinAge'
    | 'descriptionFi'
    | 'endTime'
    | 'facebookUrl'
    | 'hasPrice'
    | 'imageAltText'
    | 'imageName'
    | 'imagePhotographerName'
    | 'infoUrlFi'
    | 'instagramUrl'
    | 'keyword'
    | 'location'
    | 'locationExtraInfo'
    | 'nameFi'
    | 'providerFi'
    | 'shortDescriptionFi'
    | 'startTime'
    | 'twitterUrl'
) => {
  switch (key) {
    case 'audience':
      return screen.findByRole('checkbox', {
        name: audienceName,
      });
    case 'audienceMaxAge':
      return screen.findByRole('spinbutton', { name: /yläikäraja/i });
    case 'audienceMinAge':
      return screen.findByRole('spinbutton', { name: /alaikäraja/i });
    case 'descriptionFi':
      return screen.findByRole('textbox', {
        name: /tapahtuman kuvaus suomeksi \*/i,
      });
    case 'endTime':
      return screen.findByRole('textbox', { name: /tapahtuma päättyy/i });
    case 'facebookUrl':
      return screen.findByRole('textbox', { name: /facebook/i });
    case 'hasPrice':
      return screen.findByRole('checkbox', {
        name: /tapahtuma on maksullinen/i,
      });
    case 'imageAltText':
      return screen.findByRole('textbox', { name: /kuvan alt-teksti/i });
    case 'imageName':
      return screen.findByRole('textbox', { name: /kuvateksti/i });
    case 'imagePhotographerName':
      return screen.findByRole('textbox', { name: /kuvaajan nimi/i });
    case 'infoUrlFi':
      return screen.findByRole('textbox', {
        name: /tapahtuman kotisivun url suomeksi/i,
      });
    case 'instagramUrl':
      return screen.findByRole('textbox', { name: /instagram/i });
    case 'keyword':
      return screen.findByRole('checkbox', {
        name: keywordName,
      });
    case 'location':
      return screen.findByRole('combobox', { name: /paikka/i });
    case 'locationExtraInfo':
      return screen.findByPlaceholderText(
        /syötä lisätietoja tapahtumapaikasta suomeksi/i
      );
    case 'nameFi':
      return screen.findByRole('textbox', {
        name: /tapahtuman otsikko suomeksi/i,
      });
    case 'providerFi':
      return screen.findByRole('textbox', {
        name: /tapahtuman järjestäjä suomeksi \(jos eri kuin julkaisija\)/i,
      });
    case 'shortDescriptionFi':
      return screen.findByRole('textbox', {
        name: /lyhyt kuvaus suomeksi \(korkeintaan 160 merkkiä\)/i,
      });
    case 'startTime':
      return screen.findByRole('textbox', { name: /tapahtuma alkaa/i });
    case 'twitterUrl':
      return screen.findByRole('textbox', { name: /twitter/i });
  }
};

const findButton = (
  key: 'cancel' | 'delete' | 'postpone' | 'updateDraft' | 'updatePublic'
) => {
  switch (key) {
    case 'cancel':
      return screen.findByRole('button', { name: 'Peruuta tapahtuma' });
    case 'delete':
      return screen.findByRole('button', { name: 'Poista tapahtuma' });
    case 'postpone':
      return screen.findByRole('button', { name: 'Lykkää tapahtumaa' });
    case 'updateDraft':
      return screen.findByRole('button', {
        name: 'Tallenna muutokset luonnokseen',
      });
    case 'updatePublic':
      return screen.findByRole('button', {
        name: 'Tallenna muutokset julkaistuun tapahtumaan',
      });
  }
};
/** This test is quite heavy from the performance perspective so skip it 
 /* and enable it manually if needed */
test.skip('should initialize event form fields', async () => {
  renderComponent();

  const providerFiInput = await findInput('providerFi');
  expect(providerFiInput).toHaveValue(provider.fi);

  const nameFiInput = await findInput('nameFi');
  expect(nameFiInput).toHaveValue(name.fi);

  const infoUrlFiInput = await findInput('infoUrlFi');
  expect(infoUrlFiInput).toHaveValue(infoUrl.fi);

  const shortDescriptionFiInput = await findInput('shortDescriptionFi');
  expect(shortDescriptionFiInput).toHaveValue(shortDescription.fi);

  const descriptionFiInput = await findInput('descriptionFi');
  expect(descriptionFiInput).toHaveValue(description.fi);

  const startTimeInput = await findInput('startTime');
  expect(startTimeInput).toHaveValue('11.07.2021 05.51');

  const endTimeInput = await findInput('endTime');
  expect(endTimeInput).toHaveValue('13.07.2021 05.51');

  const locationInput = await findInput('location');
  expect(locationInput).toHaveValue(locationText);

  const locationExtraInfoInput = await findInput('locationExtraInfo');
  expect(locationExtraInfoInput).toHaveValue(locationExtraInfo.fi);

  const hasPriceCheckbox = await findInput('hasPrice');
  expect(hasPriceCheckbox).toBeChecked();

  const facebookUrlInput = await findInput('facebookUrl');
  expect(facebookUrlInput).toHaveValue(facebookUrl);

  const instagramUrlInput = await findInput('instagramUrl');
  expect(instagramUrlInput).toHaveValue(instagramUrl);

  const twitterUrlInput = await findInput('twitterUrl');
  expect(twitterUrlInput).toHaveValue(twitterUrl);

  const imageAltTextInput = await findInput('imageAltText');
  expect(imageAltTextInput).toHaveValue(imageDetails.altText);

  const imageNameInput = await findInput('imageName');
  expect(imageNameInput).toHaveValue(imageDetails.name);

  const imagePhotographerNameInput = await findInput('imagePhotographerName');
  expect(imagePhotographerNameInput).toHaveValue(imageDetails.photographerName);

  const keywordCheckbox = await findInput('keyword');
  expect(keywordCheckbox).toBeChecked();

  screen.getByRole('link', { name: `Avainsanahaku ${keywordName}` });

  const audienceCheckbox = await findInput('audience');
  expect(audienceCheckbox).toBeChecked();

  const audienceMinAgeInput = await findInput('audienceMinAge');
  expect(audienceMinAgeInput).toHaveValue(audienceMinAge);

  const audienceMaxAgeInput = await findInput('audienceMaxAge');
  expect(audienceMaxAgeInput).toHaveValue(audienceMaxAge);
});

test('should cancel event', async () => {
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

  const mocks: MockedResponse[] = [
    ...baseMocks,
    // Request to cancel event
    {
      request: {
        query: UpdateEventsDocument,
        variables: cancelEventVariables,
      },
      result: cancelEventResponse,
    },
    // Request to get mutated event
    {
      request: {
        query: EventDocument,
        variables: eventVariables,
      },
      result: cancelEventResponse,
    },
  ];

  renderComponent(mocks);

  const cancelButton = await findButton('cancel');
  userEvent.click(cancelButton);

  const withinModal = within(screen.getByRole('dialog'));
  // Cancel event button inside modal
  const cancelEventButton = await withinModal.findByRole('button', {
    name: 'Peruuta tapahtuma',
  });
  userEvent.click(cancelEventButton);

  await screen.findByText('Peruutettu', undefined, { timeout: 10000 });
});

test('should postpone event', async () => {
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

  const mocks: MockedResponse[] = [
    ...baseMocks,
    // Request to postpone event
    {
      request: {
        query: UpdateEventsDocument,
        variables: postponeEventVariables,
      },
      result: postponeEventResponse,
    },
    // Request to get mutate event
    {
      request: {
        query: EventDocument,
        variables: eventVariables,
      },
      result: postponeEventResponse,
    },
  ];

  renderComponent(mocks);

  const startTimeInput = await findInput('startTime');
  expect(startTimeInput).toHaveValue('11.07.2021 05.51');

  const endTimeInput = await findInput('endTime');
  expect(endTimeInput).toHaveValue('13.07.2021 05.51');

  const postponeButton = await findButton('postpone');
  userEvent.click(postponeButton);

  const withinModal = within(screen.getByRole('dialog'));
  // Postpone event button inside modal
  const postponeEventButton = await withinModal.findByRole('button', {
    name: 'Lykkää tapahtumaa',
  });
  userEvent.click(postponeEventButton);

  await screen.findByText('Lykätty', undefined, { timeout: 10000 });

  expect(startTimeInput).toHaveValue('');
  expect(endTimeInput).toHaveValue('');
});

test('should delete event', async () => {
  const deleteEventVariables = {
    id,
  };
  const deleteEventResponse = {
    data: null,
  };

  const mocks: MockedResponse[] = [
    ...baseMocks,
    // Request to update event
    {
      request: {
        query: DeleteEventDocument,
        variables: deleteEventVariables,
      },
      result: deleteEventResponse,
    },
  ];

  const { history } = renderComponent(mocks);

  const deleteButton = await findButton('delete');
  userEvent.click(deleteButton);

  const withinModal = within(screen.getByRole('dialog'));
  // Delete event button inside modal
  const deleteEventButton = await withinModal.findByRole('button', {
    name: 'Poista tapahtuma',
  });
  userEvent.click(deleteEventButton);

  await waitFor(
    () => {
      expect(history.location.pathname).toBe('/fi/events');
    },
    { timeout: 10000 }
  );
});

test('should update event', async () => {
  const updateEventVariables = {
    input: [basePayload],
  };
  const newLastModifiedTime = '2021-08-23T12:00:00.000Z';
  const updateEventResponse = {
    data: {
      event: {
        ...event,
        lastModifiedTime: newLastModifiedTime,
      },
    },
  };

  const imageVariables = {
    input: {
      id: imageId,
      ...imageDetails,
    },
  };
  const updateImageResponse = { data: { updateImage: images[0] } };

  const mocks: MockedResponse[] = [
    ...baseMocks,
    // Request to update event
    {
      request: {
        query: UpdateEventsDocument,
        variables: updateEventVariables,
      },
      result: updateEventResponse,
    },
    // Request to get mutated event
    {
      request: {
        query: EventDocument,
        variables: eventVariables,
      },
      result: updateEventResponse,
    },
    // Request to get update image
    {
      request: {
        query: UpdateImageDocument,
        variables: imageVariables,
      },
      result: updateImageResponse,
    },
  ];

  renderComponent(mocks);

  await screen.findByText('01.07.2021 12.00');

  const updateButton = await findButton('updatePublic');
  userEvent.click(updateButton);

  await screen.findByText('23.08.2021 12.00', undefined, { timeout: 10000 });
});

test('should update recurring event', async () => {
  const subEventId = 'event:2';
  const subEvent = { ...event, id: subEventId };
  const recurringEvent = {
    ...event,
    subEvents: [subEvent],
    superEventType: SuperEventType.Recurring,
  };
  const recurringEventResponse = { data: { event: recurringEvent } };

  const updateEventVariables = {
    input: [
      {
        ...basePayload,
        superEventType: SuperEventType.Recurring,
      },
      {
        ...basePayload,
        id: 'event:2',
        superEvent: {
          atId: recurringEvent.atId,
        },
        superEventType: null,
      },
    ],
  };
  const newLastModifiedTime = '2021-08-23T12:00:00.000Z';
  const updateEventResponse = {
    data: {
      event: {
        ...recurringEvent,
        lastModifiedTime: newLastModifiedTime,
      },
    },
  };

  const mockedEventsResponse = {
    request: {
      query: EventsDocument,
      variables: {
        createPath: undefined,
        include: [
          'audience',
          'keywords',
          'location',
          'sub_events',
          'super_event',
        ],
        pageSize: 100,
        showAll: true,
        sort: 'start_time',
        superEvent: subEventId,
      },
    },
    result: { data: { events: fakeEvents(0) } },
  };

  const imageVariables = {
    input: {
      id: imageId,
      ...imageDetails,
    },
  };
  const updateImageResponse = { data: { updateImage: images[0] } };

  const mocks: MockedResponse[] = [
    ...baseMocks.filter((item) => item.request.query !== EventDocument),
    {
      request: {
        query: EventDocument,
        variables: eventVariables,
      },
      result: recurringEventResponse,
    },
    mockedEventsResponse,
    // Request to update event
    {
      request: {
        query: UpdateEventsDocument,
        variables: updateEventVariables,
      },
      result: updateEventResponse,
    },
    // Request to get mutated event
    {
      request: {
        query: EventDocument,
        variables: eventVariables,
      },
      result: updateEventResponse,
    },
    mockedEventsResponse,
    // Request to get update image
    {
      request: {
        query: UpdateImageDocument,
        variables: imageVariables,
      },
      result: updateImageResponse,
    },
  ];

  renderComponent(mocks);

  await screen.findByText('01.07.2021 12.00');

  const updateButton = await findButton('updatePublic');
  userEvent.click(updateButton);

  const modal = await screen.findByRole('dialog');
  const withinModal = within(modal);
  // // Delete event button inside modal
  const updateEventButton = await withinModal.findByRole('button', {
    name: 'Tallenna',
  });
  userEvent.click(updateEventButton);

  await screen.findByText('23.08.2021 12.00', undefined, { timeout: 10000 });
});

test('should scroll to first error when validation error is thrown', async () => {
  const invalidEvent = {
    ...event,
    publicationStatus: PublicationStatus.Draft,
  };
  invalidEvent.name.fi = '';

  const invalidEventResponse = { data: { event: invalidEvent } };

  const mocks: MockedResponse[] = [
    ...baseMocks.filter((item) => item.request.query !== EventDocument),
    // Request to update event
    {
      request: {
        query: EventDocument,
        variables: eventVariables,
      },
      result: invalidEventResponse,
    },
  ];
  renderComponent(mocks);

  const updateButton = await findButton('updateDraft');
  userEvent.click(updateButton);

  const nameFiInput = await findInput('nameFi');

  await waitFor(() => {
    expect(nameFiInput).toHaveFocus();
  });
});
