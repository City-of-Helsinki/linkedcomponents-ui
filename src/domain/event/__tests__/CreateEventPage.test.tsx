/* eslint-disable no-console */
import { MockedResponse } from '@apollo/react-testing';
import { FormikState } from 'formik';
import { advanceTo, clear } from 'jest-date-mock';
import React from 'react';

import {
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
} from '../__mocks__/createEventPage';
import { testId } from '../../../common/components/loadingSpinner/LoadingSpinner';
import { FORM_NAMES } from '../../../constants';
import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  configure,
  getMockReduxStore,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import translations from '../../app/i18n/fi.json';
import {
  EMPTY_MULTI_LANGUAGE_OBJECT,
  EVENT_INITIAL_VALUES,
} from '../constants';
import CreateEventPage from '../CreateEventPage';
import { EventFormFields } from '../types';

configure({ defaultHidden: true });

const defaultMocks = [
  mockedImagesResponse,
  mockedImageResponse,
  mockedKeywordResponse,
  mockedKeywordsResponse,
  mockedUmbrellaEventsResponse,
  mockedAudienceKeywordSetResponse,
  mockedTopicsKeywordSetResponse,
  mockedLanguagesResponse,
  mockedPlaceResponse,
  mockedPlacesResponse,
  // PlaceSelector component requires second mock. https://github.com/apollographql/react-apollo/issues/617
  mockedFilteredPlacesResponse,
  mockedFilteredPlacesResponse,
  mockedOrganizationResponse,
  mockedOrganizationsResponse,
  mockedUserResponse,
];

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

const setFormValues = (values: EventFormFields) => {
  const state: FormikState<EventFormFields> = {
    errors: {},
    isSubmitting: false,
    isValidating: false,
    submitCount: 0,
    touched: {},
    values,
  };

  sessionStorage.setItem(FORM_NAMES.EVENT_FORM, JSON.stringify(state));
};

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
  setFormValues({
    ...EVENT_INITIAL_VALUES,
    hasUmbrella: true,
  });
  renderComponent();

  await waitFor(() => {
    expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
  });

  const superEventSelect = await findComponent('superEvent');

  const publishButton = await findComponent('publish');

  userEvent.click(publishButton);

  await waitFor(() => {
    expect(superEventSelect).toHaveFocus();
  });
});

test('should focus to text editor component in case of validation error', async () => {
  setFormValues({
    ...EVENT_INITIAL_VALUES,
    name: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: eventValues.name,
    },
    shortDescription: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: eventValues.shortDescription,
    },
  });
  renderComponent();

  await waitFor(() => {
    expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
  });

  const descriptionTextbox = await findComponent('description');

  const publishButton = await findComponent('publish');

  userEvent.click(publishButton);

  await waitFor(() => {
    expect(descriptionTextbox).toHaveFocus();
  });
});

test('should focus to first main category checkbox if none main category is selected', async () => {
  advanceTo('2020-12-20');

  setFormValues({
    ...EVENT_INITIAL_VALUES,
    publisher: organizationId,
    description: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: eventValues.description,
    },
    endTime: new Date('2020-12-31T21:00:00.000Z'),
    eventTimes: [],
    images: [imageAtId],
    imageDetails,
    isVerified: true,
    keywords: [],
    location: placeAtId,
    name: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: eventValues.name,
    },
    shortDescription: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: eventValues.shortDescription,
    },
    startTime: new Date('2020-12-31T18:00:00.000Z'),
  });

  const mocks: MockedResponse[] = [
    ...defaultMocks,
    mockedCreateSubEventsResponse,
    mockedCreatePublicEventResponse,
    mockedUpdateImageResponse,
  ];
  renderComponent(mocks);

  await waitFor(() => {
    expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
  });

  const publishButton = await findComponent('publish');
  userEvent.click(publishButton);

  const keywordCheckbox = await findComponent('keyword');

  await waitFor(() => {
    expect(keywordCheckbox).toHaveFocus();
  });
});

it('should route to event completed page after saving draft event', async () => {
  setFormValues({
    ...EVENT_INITIAL_VALUES,
    isVerified: true,
    name: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: eventValues.name,
    },
  });

  const mocks = [...defaultMocks, mockedCreateDraftEventResponse];
  const { history } = renderComponent(mocks);

  await waitFor(() => {
    expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
  });

  const saveDraftButton = await findComponent('saveDraft');

  userEvent.click(saveDraftButton);

  await waitFor(() => {
    expect(history.location.pathname).toBe(
      `/fi/events/completed/${eventValues.id}`
    );
  });
});

test('should route to event completed page after publishing event', async () => {
  advanceTo('2020-12-20');

  setFormValues({
    ...EVENT_INITIAL_VALUES,
    publisher: organizationId,
    description: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: eventValues.description,
    },
    endTime: new Date('2020-12-31T21:00:00.000Z'),
    eventTimes: [
      {
        endTime: new Date('2021-01-03T21:00:00.000Z'),
        startTime: new Date('2021-01-03T18:00:00.000Z'),
      },
    ],
    images: [imageAtId],
    imageDetails,
    isVerified: true,
    keywords: [keywordAtId],
    location: placeAtId,
    name: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: eventValues.name,
    },
    shortDescription: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: eventValues.shortDescription,
    },
    startTime: new Date('2020-12-31T18:00:00.000Z'),
  });

  const mocks: MockedResponse[] = [
    ...defaultMocks,
    mockedCreateSubEventsResponse,
    mockedCreatePublicEventResponse,
    mockedUpdateImageResponse,
  ];
  const { history } = renderComponent(mocks);

  await waitFor(() => {
    expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
  });

  const publishButton = await findComponent('publish');
  userEvent.click(publishButton);

  await waitFor(
    () => {
      expect(history.location.pathname).toBe(
        `/fi/events/completed/${eventValues.id}`
      );
    },
    { timeout: 10000 }
  );
});
