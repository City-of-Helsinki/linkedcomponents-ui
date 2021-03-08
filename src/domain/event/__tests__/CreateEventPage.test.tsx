/* eslint-disable no-console */
import { MockedResponse } from '@apollo/react-testing';
import { advanceTo, clear } from 'jest-date-mock';
import React from 'react';

import {
  eventValues,
  imageDetails,
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
  mockedPlaceResponse,
  mockedPlacesResponse,
  mockedTopicsKeywordSetResponse,
  mockedUmbrellaEventsResponse,
  mockedUpdateImageResponse,
  mockedUserResponse,
  selectedPlaceText,
} from '../__mocks__/createEventPage';
import { testId } from '../../../common/components/loadingSpinner/LoadingSpinner';
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
    name: imageDetails.name,
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

  it('should route to event completed page after saving draft event', async () => {
    const { history } = await renderSaveDraftComponent(
      mockedCreateDraftEventResponse
    );

    await waitFor(() => {
      expect(history.location.pathname).toBe(
        `/fi/events/completed/${eventValues.id}`
      );
    });
  });
});

test('should route to event completed page after publishing event', async () => {
  advanceTo('2020-12-20');

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

  await waitFor(
    () => {
      expect(history.location.pathname).toBe(
        `/fi/events/completed/${eventValues.id}`
      );
    },
    { timeout: 10000 }
  );
});
