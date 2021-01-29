/* eslint-disable no-console */
import { MockedResponse } from '@apollo/react-testing';
import { advanceTo, clear } from 'jest-date-mock';
import range from 'lodash/range';
import React from 'react';

import { testId } from '../../../common/components/loadingSpinner/LoadingSpinner';
import { INCLUDE, KEYWORD_SETS } from '../../../constants';
import {
  CreateEventDocument,
  CreateEventsDocument,
  EventsDocument,
  ImageDocument,
  ImagesDocument,
  KeywordDocument,
  KeywordsDocument,
  KeywordSetDocument,
  LanguagesDocument,
  PlaceDocument,
  PlacesDocument,
  UpdateImageDocument,
} from '../../../generated/graphql';
import {
  fakeEvent,
  fakeEvents,
  fakeImages,
  fakeKeywords,
  fakeKeywordSet,
  fakeLanguages,
  fakePlaces,
} from '../../../utils/mockDataUtils';
import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  act,
  configure,
  getMockReduxStore,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import translations from '../../app/i18n/fi.json';
import CreateEventPage from '../CreateEventPage';

configure({ defaultHidden: true });

const events = fakeEvents(1);
const eventsResponse = { data: { events } };

const imagePayload = {
  input: {
    id: 'image:1',
    altText: 'Image alt text',
    license: 'cc_by',
    name: 'Image name',
    photographerName: 'Imahe photographer',
  },
};

const images = fakeImages(5, [imagePayload.input]);
const imagesResponse = {
  data: {
    images,
  },
};

const image = images.data[0];
const imageAtId = image.atId;
const imageResponse = {
  data: {
    image,
  },
};

const keywordNames = range(1, 5).map((index) => `Keyword ${index}`);
const keywords = fakeKeywords(
  keywordNames.length,
  keywordNames.map((name, index) => ({
    id: `${index + 1}`,
    atId: `https://api.hel.fi/linkedevents-test/v1/keyword/${index + 1}/`,
    name: { fi: name },
  }))
);
const keywordsResponse = {
  data: { keywords },
};

const keyword = keywords.data[0];
const keywordName = keyword.name.fi;
const keywordId = keyword.id;
const keywordAtId = keyword.atId;

const keywordResponse = { data: { keyword } };

const audiencesKeywordSet = fakeKeywordSet();
const audiencesKeywordSetResponse = {
  data: { keywordSet: audiencesKeywordSet },
};

const topicsKeywordSet = fakeKeywordSet({
  keywords: keywords.data,
});
const topicsKeywordSetResponse = { data: { keywordSet: topicsKeywordSet } };

const languages = fakeLanguages(10);
const languagesResponse = { data: { languages } };

const places = fakePlaces(10);
const placesResponse = { data: { places } };

const place = places.data[0];
const streetAddress = place.streetAddress.fi;
const addressLocality = place.addressLocality.fi;
const placeId = place.id;
const placeAtId = place.atId;
const placeName = place.name.fi;
const selectedPlaceText = `${placeName} (${streetAddress}, ${addressLocality})`;

const placeResponse = { data: { place } };

const placesVariables = {
  createPath: undefined,
  showAllPlaces: true,
  text: '',
};

const filteredPlacesVariables = {
  createPath: undefined,
  showAllPlaces: true,
  text: selectedPlaceText,
};

const filteredPlaces = fakePlaces(1, [place]);
const filteredPlacesResponse = { data: { places: filteredPlaces } };

const filteredPlacesMockedResponse = {
  request: {
    query: PlacesDocument,
    variables: filteredPlacesVariables,
  },
  result: filteredPlacesResponse,
};

const draftPayload = {
  input: {
    publicationStatus: 'draft',
    audience: [],
    externalLinks: [],
    description: {},
    images: [],
    infoUrl: {},
    inLanguage: [],
    keywords: [],
    locationExtraInfo: {},
    name: { fi: 'Event name' },
    offers: [{ isFree: true }],
    provider: {},
    shortDescription: {},
  },
};

const basePublicEvent = {
  publicationStatus: 'public',
  audience: [],
  externalLinks: [],
  description: { fi: 'Description' },
  images: [{ atId: imageAtId }],
  infoUrl: {},
  inLanguage: [],
  location: {
    atId: placeAtId,
  },
  keywords: [{ atId: keywordAtId }],
  locationExtraInfo: {},
  name: { fi: 'Event name' },
  offers: [{ isFree: true }],
  provider: {},
  shortDescription: { fi: 'Short description' },
};

const subEventsPayload = {
  input: [
    {
      ...basePublicEvent,
      endTime: '2020-12-31T21:00:00.000Z',
      startTime: '2020-12-31T18:00:00.000Z',
    },
    {
      ...basePublicEvent,
      endTime: '2021-01-03T21:00:00.000Z',
      startTime: '2021-01-03T18:00:00.000Z',
    },
  ],
};

const publishPayload = {
  input: {
    ...basePublicEvent,
    endTime: '2021-01-03T21:00:00.000Z',
    startTime: '2020-12-31T18:00:00.000Z',
    superEventType: 'recurring',
    subEvents: [
      { atId: 'https://api.hel.fi/linkedevents-test/v1/event/event:1/' },
      { atId: 'https://api.hel.fi/linkedevents-test/v1/event/event:2/' },
    ],
  },
};

const defaultMocks = [
  {
    request: {
      query: ImagesDocument,
      variables: { createPath: undefined, pageSize: 5 },
    },
    result: imagesResponse,
    newData: () => imagesResponse,
  },
  {
    request: {
      query: ImageDocument,
      variables: { createPath: undefined, id: image.id },
    },
    result: imageResponse,
  },
  {
    request: {
      query: KeywordDocument,
      variables: { id: keywordId, createPath: undefined },
    },
    result: keywordResponse,
  },
  {
    request: {
      query: EventsDocument,
      variables: {
        createPath: undefined,
        superEventType: ['umbrella'],
        text: '',
      },
    },
    result: eventsResponse,
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
        id: KEYWORD_SETS.AUDIENCES,
        include: [INCLUDE.KEYWORDS],
      },
    },
    result: audiencesKeywordSetResponse,
  },
  {
    request: {
      query: KeywordSetDocument,
      variables: {
        createPath: undefined,
        id: KEYWORD_SETS.TOPICS,
        include: [INCLUDE.KEYWORDS],
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
      variables: { id: placeId, createPath: undefined },
    },
    result: placeResponse,
  },
  {
    request: {
      query: PlacesDocument,
      variables: placesVariables,
    },
    result: placesResponse,
  },
  // PlaceSelector component requires second mock. https://github.com/apollographql/react-apollo/issues/617
  filteredPlacesMockedResponse,
  filteredPlacesMockedResponse,
];

const eventValues = {
  description: 'Description',
  endTime: '31.12.2020 21.00',
  id: 'hel:123',
  subEvents: ['event:1', 'event:2'],
  atId: 'https://api.hel.fi/linkedevents-test/v1/event/hel:123/',
  name: 'Event name',
  shortDescription: 'Short description',
  startTime: '31.12.2020 18.00',
  eventTimes: [
    {
      endTime: '03.01.2021 21.00',
      startTime: '03.01.2021 18.00',
    },
  ],
};

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  render(<CreateEventPage />, { mocks, store });

beforeEach(() => {
  // values stored with FormikPersist will also be available in other tests unless you run
  sessionStorage.clear();
});

afterAll(() => {
  // Clear system time
  clear();
});

const findComponent = async (
  key:
    | 'addEventTime'
    | 'addImageButton'
    | 'description'
    | 'endTime'
    | 'hasUmbrella'
    | 'imageModalHeading'
    | 'isVerified'
    | 'keyword'
    | 'name'
    | 'publish'
    | 'saveDraft'
    | 'secondEndTime'
    | 'secondStartTime'
    | 'shortDescription'
    | 'startTime'
    | 'superEvent'
) => {
  switch (key) {
    case 'addEventTime':
      return screen.findByRole('button', {
        name: translations.event.form.buttonAddEventTime,
      });
    case 'addImageButton':
      // Both add image button and preview image component have same label
      const addImageButtons = await screen.findAllByRole('button', {
        name: translations.event.form.buttonAddImage.event,
      });
      return addImageButtons[0];
    case 'description':
      return screen.findByRole('textbox', {
        name: /tapahtuman kuvaus suomeksi/i,
      });
    case 'endTime':
      return screen.findByRole('textbox', { name: /tapahtuma päättyy/i });
    case 'hasUmbrella':
      return screen.findByRole('checkbox', {
        name: /tällä tapahtumalla on kattotapahtuma\./i,
      });
    case 'imageModalHeading':
      return screen.findByRole('heading', {
        name: translations.event.form.modalTitleImage,
      });
    case 'isVerified':
      return screen.findByRole('checkbox', {
        name: /vakuutan, että antamani tiedot ovat oikein/i,
      });
    case 'keyword':
      return screen.findByRole('checkbox', { name: keywordName });
    case 'name':
      return screen.findByRole('textbox', {
        name: /tapahtuman otsikko suomeksi/i,
      });
    case 'publish':
      return screen.findByRole('button', {
        name: translations.event.form.buttonPublish.event,
      });
    case 'saveDraft':
      return screen.findByRole('button', {
        name: translations.event.form.buttonSaveDraft,
      });
    case 'secondEndTime':
      const endTimeTextboxes = await screen.findAllByRole('textbox', {
        name: /tapahtuma päättyy/i,
      });
      return endTimeTextboxes[1];
    case 'secondStartTime':
      const startTimeTextboxes = await screen.findAllByRole('textbox', {
        name: /tapahtuma alkaa/i,
      });
      return startTimeTextboxes[1];
    case 'shortDescription':
      return screen.findByRole('textbox', {
        name: /lyhyt kuvaus suomeksi \(korkeintaan 160 merkkiä\)/i,
      });
    case 'startTime':
      return screen.findByRole('textbox', { name: /tapahtuma alkaa/i });
    case 'superEvent':
      return screen.findByRole('combobox', {
        name: new RegExp(translations.event.form.labelUmbrellaEvent),
      });
  }
};

const selectImage = async () => {
  const addImageButton = await findComponent('addImageButton');

  userEvent.click(addImageButton);

  const imageModalHeading = await findComponent('imageModalHeading');

  const imageCheckbox = await screen.findByRole('checkbox', {
    name: image.name,
  });

  userEvent.click(imageCheckbox);

  const submitImageButton = screen.queryByRole('button', {
    name: translations.common.add,
  });

  await waitFor(() => {
    expect(submitImageButton).toBeEnabled();
  });

  userEvent.click(submitImageButton);

  await waitFor(() => {
    expect(imageModalHeading).not.toBeInTheDocument();
  });
};

test('should focus to first validation error when trying to save draft event', async () => {
  renderComponent();

  await waitFor(() => {
    expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
  });

  const nameTextbox = await findComponent('name');
  const saveDraftButton = await findComponent('saveDraft');

  userEvent.click(saveDraftButton);

  await waitFor(() => {
    expect(nameTextbox).toHaveFocus();
  });
});

test('should focus to select component in case of validation error', async () => {
  renderComponent();

  await waitFor(() => {
    expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
  });

  const hasUmbrellaCheckbox = await findComponent('hasUmbrella');

  userEvent.click(hasUmbrellaCheckbox);

  const superEventSelect = await findComponent('superEvent');

  const publishButton = await findComponent('publish');

  userEvent.click(publishButton);

  await waitFor(() => {
    expect(superEventSelect).toHaveFocus();
  });
});

test('should focus to first validation error when trying to publish event', async () => {
  renderComponent();

  await waitFor(() => {
    expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
  });

  const nameTextbox = await findComponent('name');
  const publishButton = await findComponent('publish');

  userEvent.click(publishButton);

  await waitFor(() => {
    expect(nameTextbox).toHaveFocus();
  });
});

describe('save draft event', () => {
  type NetworkError = { statusCode?: number } & Error;

  const createNetwordError = (statusCode: number): NetworkError => {
    const error: NetworkError = new Error();
    error.statusCode = statusCode;

    return error;
  };

  const renderSaveDraftComponent = async (
    createEventResponse: MockedResponse
  ) => {
    const mocks = [...defaultMocks, createEventResponse];
    const component = renderComponent(mocks);

    await waitFor(() => {
      expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
    });

    const nameTextbox = await findComponent('name');

    userEvent.type(nameTextbox, eventValues.name);

    await waitFor(() => {
      expect(nameTextbox).toHaveValue(eventValues.name);
    });

    const isVerifiedCheckbox = await findComponent('isVerified');

    userEvent.click(isVerifiedCheckbox);

    await waitFor(() => {
      expect(isVerifiedCheckbox).toBeChecked();
    });

    const saveDraftButton = await findComponent('saveDraft');

    userEvent.click(saveDraftButton);

    return component;
  };

  it('should show toast message when 400 error is returned when trying to save event', async () => {
    console.error = jest.fn();
    await renderSaveDraftComponent({
      request: {
        query: CreateEventDocument,
        variables: draftPayload,
      },
      error: createNetwordError(400),
    });

    await waitFor(() => {
      // Apollo client will also show toast error but test here only that console error is shown
      expect(console.error).toBeCalled();
    });
  });

  it('should route to event completed page after saving draft event', async () => {
    const event = fakeEvent({
      id: eventValues.id,
      atId: eventValues.id,
      name: { fi: eventValues.name },
    });
    const eventResponse = { data: { createEvent: event } };
    const { history } = await renderSaveDraftComponent({
      request: {
        query: CreateEventDocument,
        variables: draftPayload,
      },
      result: eventResponse,
    });

    await waitFor(() => {
      expect(history.location.pathname).toBe(
        `/fi/events/completed/${eventValues.id}`
      );
    });
  });
});

test('should route to event completed page after publishing event', async () => {
  advanceTo('2020-12-20');

  const subEvents = fakeEvents(
    eventValues.subEvents.length,
    eventValues.subEvents.map((id) => ({
      id,
    }))
  );
  const createEventsResponse = { data: { createEvents: subEvents.data } };

  const event = fakeEvent({
    id: eventValues.id,
  });
  const createEventResponse = { data: { createEvent: event } };
  const updateImageResponse = { data: { updateImage: image } };

  const mocks: MockedResponse[] = [
    ...defaultMocks,
    {
      request: {
        query: CreateEventsDocument,
        variables: subEventsPayload,
      },
      result: createEventsResponse,
    },
    {
      request: {
        query: CreateEventDocument,
        variables: publishPayload,
      },
      result: createEventResponse,
    },
    {
      request: {
        query: UpdateImageDocument,
        variables: imagePayload,
      },
      result: updateImageResponse,
    },
  ];
  const { history } = renderComponent(mocks);

  await waitFor(() => {
    expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
  });

  const startTimeTextbox = await findComponent('startTime');
  const endTimeTextbox = await findComponent('endTime');
  const nameTextbox = await findComponent('name');
  const shortDescriptionTextbox = await findComponent('shortDescription');
  const descriptionTextbox = await findComponent('description');

  const addEventTimeButton = await findComponent('addEventTime');
  userEvent.click(addEventTimeButton);

  const secondStartTimeTextbox = await findComponent('secondStartTime');
  const secondEndTimeTextbox = await findComponent('secondEndTime');

  const textboxes = [
    {
      textbox: nameTextbox,
      value: eventValues.name,
    },
    {
      textbox: shortDescriptionTextbox,
      value: eventValues.shortDescription,
    },
    {
      textbox: descriptionTextbox,
      value: eventValues.description,
    },
    {
      textbox: startTimeTextbox,
      value: eventValues.startTime,
    },
    {
      textbox: endTimeTextbox,
      value: eventValues.endTime,
    },
    {
      textbox: secondStartTimeTextbox,
      value: eventValues.eventTimes[0].startTime,
    },
    {
      textbox: secondEndTimeTextbox,
      value: eventValues.eventTimes[0].endTime,
    },
  ];

  textboxes.forEach(({ textbox, value }) => {
    userEvent.click(textbox);
    userEvent.type(textbox, value);

    act(() => {
      expect(nameTextbox).toHaveValue(eventValues.name);
    });
  });

  userEvent.click(screen.getByRole('button', { name: /paikka: valikko/i }));
  userEvent.click(
    screen.getByRole('option', {
      name: selectedPlaceText,
    })
  );

  await selectImage();

  const keywordCheckbox = await findComponent('keyword');
  const isVerifiedCheckbox = await findComponent('isVerified');
  const checkboxes = [keywordCheckbox, isVerifiedCheckbox];

  checkboxes.forEach((checkbox) => {
    userEvent.click(checkbox);
    act(() => {
      expect(checkbox).toBeChecked();
    });
  });

  const publishButton = await findComponent('publish');

  userEvent.click(publishButton);

  await waitFor(() => {
    expect(history.location.pathname).toBe(
      `/fi/events/completed/${eventValues.id}`
    );
  });
});
