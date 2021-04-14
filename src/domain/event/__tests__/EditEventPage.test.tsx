import { MockedResponse } from '@apollo/react-testing';
import React from 'react';

import {
  audienceName,
  eventId,
  expectedValues,
  keywordName,
  mockedAudienceKeywordSetResponse,
  mockedCancelEventResponse,
  mockedCancelledEventResponse,
  mockedDeleteEventResponse,
  mockedEventResponse,
  mockedEventTimeResponse,
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
  mockedSubEventTimeResponse,
  mockedSubSubEventsResponse,
  mockedTopicsKeywordSetResponse,
  mockedUpdatedEventResponse,
  mockedUpdatedRecurringEventResponse,
  mockedUpdateEventResponse,
  mockedUpdateImageResponse,
  mockedUpdateRecurringEventResponse,
  mockedUpdateSubEventsResponse,
  mockedUserResponse,
} from '../__mocks__/editEventPage';
import { ROUTES } from '../../../constants';
import { EventDocument } from '../../../generated/graphql';
import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  configure,
  getMockReduxStore,
  renderWithRoute,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../utils/testUtils';
import EditEventPage from '../EditEventPage';

configure({ defaultHidden: true });

const baseMocks = [
  mockedEventResponse,
  mockedEventTimeResponse,
  mockedImageResponse,
  mockedKeywordResponse,
  mockedKeywordsResponse,
  mockedAudienceKeywordSetResponse,
  mockedTopicsKeywordSetResponse,
  mockedLanguagesResponse,
  mockedPlaceResponse,
  mockedPlacesResponse,
  mockedFilteredPlacesResponse,
  mockedUserResponse,
  mockedOrganizationResponse,
  mockedOrganizationAncestorsResponse,
];

const storeState = fakeAuthenticatedStoreState();
const store = getMockReduxStore(storeState);

const route = ROUTES.EDIT_EVENT.replace(':id', eventId);

const renderComponent = (mocks: MockedResponse[] = baseMocks) =>
  renderWithRoute(<EditEventPage />, {
    mocks,
    routes: [route],
    path: ROUTES.EDIT_EVENT,
    store,
  });

const findInput = (
  key:
    | 'actionsButton'
    | 'audience'
    | 'audienceMaxAge'
    | 'audienceMinAge'
    | 'descriptionFi'
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
    | 'twitterUrl'
    | 'videoAltText'
    | 'videoName'
    | 'videoUrl'
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
        name: /tapahtuman kuvaus suomeksi/i,
      });
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
    case 'twitterUrl':
      return screen.findByRole('textbox', { name: /twitter/i });
    case 'videoAltText':
      return screen.findByRole('textbox', { name: /videon alt-teksti/i });
    case 'videoName':
      return screen.findByRole('textbox', { name: /videon nimi/i });
    case 'videoUrl':
      return screen.findByRole('textbox', { name: /videon url-osoite/i });
  }
};

const openMenu = async () => {
  const toggleButtons = await screen.findAllByRole('button', {
    name: /valinnat/i,
  });
  const toggleButton = toggleButtons.pop();
  userEvent.click(toggleButton);
  await screen.findByRole('region', { name: /valinnat/i });

  return toggleButton;
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
        name: 'Tallenna luonnos',
      });
    case 'updatePublic':
      return screen.findByRole('button', {
        name: 'Tallenna muutokset',
      });
  }
};
/** This test is quite heavy from the performance perspective so skip it 
 /* and enable it manually if needed */
test.skip('should initialize event form fields', async () => {
  renderComponent();

  const providerFiInput = await findInput('providerFi');
  expect(providerFiInput).toHaveValue(expectedValues.provider);

  const nameFiInput = await findInput('nameFi');
  expect(nameFiInput).toHaveValue(expectedValues.name);

  const infoUrlFiInput = await findInput('infoUrlFi');
  expect(infoUrlFiInput).toHaveValue(expectedValues.infoUrl);

  const shortDescriptionFiInput = await findInput('shortDescriptionFi');
  expect(shortDescriptionFiInput).toHaveValue(expectedValues.shortDescription);

  await findInput('descriptionFi');

  const locationInput = await findInput('location');
  expect(locationInput).toHaveValue(expectedValues.location);

  const locationExtraInfoInput = await findInput('locationExtraInfo');
  expect(locationExtraInfoInput).toHaveValue(expectedValues.locationExtraInfo);

  const hasPriceCheckbox = await findInput('hasPrice');
  expect(hasPriceCheckbox).toBeChecked();

  const facebookUrlInput = await findInput('facebookUrl');
  expect(facebookUrlInput).toHaveValue(expectedValues.facebookUrl);

  const instagramUrlInput = await findInput('instagramUrl');
  expect(instagramUrlInput).toHaveValue(expectedValues.instagramUrl);

  const twitterUrlInput = await findInput('twitterUrl');
  expect(twitterUrlInput).toHaveValue(expectedValues.twitterUrl);

  const imageAltTextInput = await findInput('imageAltText');
  expect(imageAltTextInput).toHaveValue(expectedValues.imageAltText);

  const imageNameInput = await findInput('imageName');
  expect(imageNameInput).toHaveValue(expectedValues.imageName);

  const imagePhotographerNameInput = await findInput('imagePhotographerName');
  expect(imagePhotographerNameInput).toHaveValue(
    expectedValues.imagePhotographerName
  );

  const videoAltTextInput = await findInput('videoAltText');
  expect(videoAltTextInput).toHaveValue(expectedValues.videoAltText);

  const videoNameInput = await findInput('videoName');
  expect(videoNameInput).toHaveValue(expectedValues.videoName);

  const videoUrlInput = await findInput('videoUrl');
  expect(videoUrlInput).toHaveValue(expectedValues.videoUrl);

  const keywordCheckbox = await findInput('keyword');
  expect(keywordCheckbox).toBeChecked();

  screen.getByRole('link', { name: `Avainsanahaku ${keywordName}` });

  const audienceCheckbox = await findInput('audience');
  expect(audienceCheckbox).toBeChecked();

  const audienceMinAgeInput = await findInput('audienceMinAge');
  expect(audienceMinAgeInput).toHaveValue(expectedValues.audienceMinAge);

  const audienceMaxAgeInput = await findInput('audienceMaxAge');
  expect(audienceMaxAgeInput).toHaveValue(expectedValues.audienceMaxAge);
});

test('should cancel event', async () => {
  const mocks: MockedResponse[] = [
    ...baseMocks,
    // Request to cancel event
    mockedCancelEventResponse,
    // Request to get mutated event
    mockedCancelledEventResponse,
  ];

  renderComponent(mocks);

  await openMenu();
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
  const mocks: MockedResponse[] = [
    ...baseMocks,
    // Request to postpone event
    mockedPostponeEventResponse,
    // Request to get mutated event
    mockedPostponedEventResponse,
  ];

  renderComponent(mocks);

  await openMenu();
  const postponeButton = await findButton('postpone');
  userEvent.click(postponeButton);

  const withinModal = within(screen.getByRole('dialog'));
  const postponeEventButton = await withinModal.findByRole('button', {
    name: 'Lykkää tapahtumaa',
  });
  userEvent.click(postponeEventButton);

  await screen.findByText('Lykätty', undefined, { timeout: 10000 });
});

test('should delete event', async () => {
  const mocks: MockedResponse[] = [
    ...baseMocks,
    // Request to update event
    mockedDeleteEventResponse,
  ];

  const { history } = renderComponent(mocks);

  await openMenu();
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
  const mocks: MockedResponse[] = [
    ...baseMocks,
    // Request to update event
    mockedUpdateEventResponse,
    // Request to get updated event
    mockedUpdatedEventResponse,
    // Request to update image
    mockedUpdateImageResponse,
  ];

  renderComponent(mocks);

  await screen.findByText(expectedValues.lastModifiedTime);

  const updateButton = await findButton('updatePublic');
  userEvent.click(updateButton);

  await screen.findByText(expectedValues.updatedLastModifiedTime, undefined, {
    timeout: 10000,
  });
});

test('should update recurring event', async () => {
  const mocks: MockedResponse[] = [
    ...baseMocks.filter((item) => item.request.query !== EventDocument),
    mockedEventTimeResponse,
    mockedEventWithSubEventResponse,
    mockedSubEventsResponse,
    mockedSubEventTimeResponse,
    mockedSubSubEventsResponse,
    // Request to update event
    mockedUpdateSubEventsResponse,
    mockedUpdateRecurringEventResponse,
    // Request to get mutated event
    mockedUpdatedRecurringEventResponse,
    mockedSubEventsResponse,
    mockedSubSubEventsResponse,
    // Request to update image
    mockedUpdateImageResponse,
  ];

  renderComponent(mocks);

  await screen.findByText(expectedValues.lastModifiedTime);

  const updateButton = await findButton('updatePublic');
  userEvent.click(updateButton);

  const modal = await screen.findByRole('dialog');
  const withinModal = within(modal);
  // // Delete event button inside modal
  const updateEventButton = await withinModal.findByRole('button', {
    name: 'Tallenna',
  });
  userEvent.click(updateEventButton);

  await screen.findByText(expectedValues.updatedLastModifiedTime, undefined, {
    timeout: 10000,
  });
});

test('should scroll to first error when validation error is thrown', async () => {
  const mocks: MockedResponse[] = [
    ...baseMocks.filter((item) => item.request.query !== EventDocument),
    mockedEventTimeResponse,
    // Request to update event
    mockedInvalidEventResponse,
  ];
  renderComponent(mocks);

  const updateButton = await findButton('updateDraft');
  userEvent.click(updateButton);

  const nameFiInput = await findInput('nameFi');

  await waitFor(() => {
    expect(nameFiInput).toHaveFocus();
  });
});
