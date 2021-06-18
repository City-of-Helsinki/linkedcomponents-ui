import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { DATETIME_FORMAT, ROUTES } from '../../../constants';
import { EventDocument } from '../../../generated/graphql';
import formatDate from '../../../utils/formatDate';
import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  act,
  configure,
  getMockReduxStore,
  loadingSpinnerIsNotInDocument,
  renderWithRoute,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../utils/testUtils';
import {
  eventId,
  expectedValues,
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
  mockedInvalidUpdateEventResponse,
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
} from '../__mocks__/editEventPage';
import EditEventPage from '../EditEventPage';

configure({ defaultHidden: true });

const baseMocks = [
  mockedEventResponse,
  mockedEventTimeResponse,
  mockedImageResponse,
  mockedKeywordsResponse,
  mockedAudienceKeywordSetResponse,
  mockedTopicsKeywordSetResponse,
  mockedLanguagesResponse,
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

const openMenu = async () => {
  const toggleButton = screen
    .getAllByRole('button', { name: /valinnat/i })
    .pop();

  userEvent.click(toggleButton);
  screen.getByRole('region', { name: /valinnat/i });

  return toggleButton;
};

const getButton = (
  key: 'cancel' | 'delete' | 'postpone' | 'updateDraft' | 'updatePublic'
) => {
  switch (key) {
    case 'cancel':
      return screen.getByRole('button', { name: 'Peruuta tapahtuma' });
    case 'delete':
      return screen.getByRole('button', { name: 'Poista tapahtuma' });
    case 'postpone':
      return screen.getByRole('button', { name: 'Lykkää tapahtumaa' });
    case 'updateDraft':
      return screen.getByRole('button', { name: 'Tallenna luonnos' });
    case 'updatePublic':
      return screen.getByRole('button', { name: 'Tallenna muutokset' });
  }
};

const getInput = (key: 'nameFi') => {
  switch (key) {
    case 'nameFi':
      return screen.getByRole('textbox', {
        name: /tapahtuman otsikko suomeksi/i,
      });
  }
};

const getAddEventTimeFormElement = (
  key: 'addButton' | 'endTime' | 'startTime'
) => {
  switch (key) {
    case 'addButton':
      return screen.getByRole('button', { name: /lisää ajankohta/i });
    case 'endTime':
      return screen.getByRole('textbox', { name: /tapahtuma päättyy/i });
    case 'startTime':
      return screen.getByRole('textbox', { name: /tapahtuma alkaa/i });
  }
};

test('should cancel event', async () => {
  const mocks: MockedResponse[] = [
    ...baseMocks,
    // Request to cancel event
    mockedCancelEventResponse,
    // Request to get mutated event
    mockedCancelledEventResponse,
  ];

  renderComponent(mocks);

  await loadingSpinnerIsNotInDocument();
  await openMenu();

  const cancelButton = getButton('cancel');
  userEvent.click(cancelButton);

  const withinModal = within(screen.getByRole('dialog'));
  // Cancel event button inside modal
  const cancelEventButton = withinModal.getByRole('button', {
    name: 'Peruuta tapahtuma',
  });
  userEvent.click(cancelEventButton);

  await waitFor(
    () => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    { timeout: 10000 }
  );
  await loadingSpinnerIsNotInDocument(10000);
  screen.getByText('Peruutettu');
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

  await loadingSpinnerIsNotInDocument();
  await openMenu();

  const postponeButton = getButton('postpone');
  userEvent.click(postponeButton);

  const withinModal = within(screen.getByRole('dialog'));
  const postponeEventButton = withinModal.getByRole('button', {
    name: 'Lykkää tapahtumaa',
  });
  userEvent.click(postponeEventButton);

  await waitFor(
    () => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    { timeout: 10000 }
  );
  await loadingSpinnerIsNotInDocument(10000);
  screen.getByText('Lykätty');
});

test('should delete event', async () => {
  const mocks: MockedResponse[] = [
    ...baseMocks,
    // Request to update event
    mockedDeleteEventResponse,
  ];

  const { history } = renderComponent(mocks);

  await loadingSpinnerIsNotInDocument();
  await openMenu();

  const deleteButton = getButton('delete');
  userEvent.click(deleteButton);

  const withinModal = within(screen.getByRole('dialog'));
  // Delete event button inside modal
  const deleteEventButton = withinModal.getByRole('button', {
    name: 'Poista tapahtuma',
  });
  userEvent.click(deleteEventButton);

  await waitFor(
    () => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    { timeout: 10000 }
  );
  expect(history.location.pathname).toBe('/fi/search');
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

  await loadingSpinnerIsNotInDocument();

  screen.getByText(expectedValues.lastModifiedTime);

  const updateButton = getButton('updatePublic');
  userEvent.click(updateButton);

  await loadingSpinnerIsNotInDocument(10000);
  await screen.findByText(expectedValues.updatedLastModifiedTime);
});

test('should update recurring event', async () => {
  const mocks: MockedResponse[] = [
    ...baseMocks.filter((item) => item.request.query !== EventDocument),
    mockedEventWithSubEventResponse,
    mockedSubEventsResponse,
    mockedSubSubEventsResponse,
    // Request to update event
    mockedDeleteSubEvent1Response,
    mockedUpdateSubEventsResponse,
    mockedCreateNewSubEventsResponse,
    mockedUpdateRecurringEventResponse,
    // Request to get mutated event
    mockedUpdatedRecurringEventResponse,
    mockedUpdatedRecurringEventResponse,
    mockedSubEventsResponse,
    mockedSubSubEventsResponse,
    // Request to update image
    mockedUpdateImageResponse,
  ];

  renderComponent(mocks);

  await loadingSpinnerIsNotInDocument();

  screen.getByText(expectedValues.lastModifiedTime);

  // Delete first sub-event
  const withinRow = within(
    screen.getByRole('row', {
      name: `1 ${formatDate(
        subEventTimes[0].startTime,
        DATETIME_FORMAT
      )} – ${formatDate(subEventTimes[0].endTime, DATETIME_FORMAT)}`,
    })
  );
  const toggleMenuButton = withinRow.getByRole('button', {
    name: /valinnat/i,
  });
  userEvent.click(toggleMenuButton);
  const deleteButton = withinRow.getByRole('button', { name: /poista/i });
  userEvent.click(deleteButton);

  const endTimeInput = getAddEventTimeFormElement('endTime');
  const startTimeInput = getAddEventTimeFormElement('startTime');
  const addButton = getAddEventTimeFormElement('addButton');

  for (const newEventTime of newSubEventTimes) {
    const startTimeValue = formatDate(newEventTime.startTime, DATETIME_FORMAT);
    act(() => userEvent.click(startTimeInput));
    userEvent.type(startTimeInput, startTimeValue);
    await waitFor(() => expect(startTimeInput).toHaveValue(startTimeValue));

    const endTimeValue = formatDate(newEventTime.endTime, DATETIME_FORMAT);
    act(() => userEvent.click(endTimeInput));
    userEvent.type(endTimeInput, endTimeValue);
    await waitFor(() => expect(endTimeInput).toHaveValue(endTimeValue));

    await waitFor(() => expect(addButton).toBeEnabled());
    act(() => userEvent.click(addButton));
    await waitFor(() => expect(startTimeInput).toHaveValue(''));
    await waitFor(() => expect(endTimeInput).toHaveValue(''));
  }

  const updateButton = getButton('updatePublic');
  userEvent.click(updateButton);

  const modal = await screen.findByRole('dialog');
  const withinModal = within(modal);
  // Update event button inside modal
  const updateEventButton = await withinModal.getByRole('button', {
    name: 'Tallenna',
  });
  userEvent.click(updateEventButton);

  // This test is pretty heavy so give DOM some time to update
  await waitFor(
    () => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    { timeout: 30000 }
  );
  await loadingSpinnerIsNotInDocument(30000);
  await screen.findByText(expectedValues.updatedLastModifiedTime, undefined, {
    timeout: 30000,
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

  await loadingSpinnerIsNotInDocument();

  const updateButton = getButton('updateDraft');
  userEvent.click(updateButton);

  const nameFiInput = getInput('nameFi');

  await waitFor(() => expect(nameFiInput).toHaveFocus());
});

test('should show server errors', async () => {
  const mocks = [...baseMocks, mockedInvalidUpdateEventResponse];

  renderComponent(mocks);

  await loadingSpinnerIsNotInDocument();

  screen.getByText(expectedValues.lastModifiedTime);

  const updateButton = getButton('updatePublic');
  userEvent.click(updateButton);

  await loadingSpinnerIsNotInDocument(10000);
  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/lopetusaika ei voi olla menneisyydessä./i);
});
