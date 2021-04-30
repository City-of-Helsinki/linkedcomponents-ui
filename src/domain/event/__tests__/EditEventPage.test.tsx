import { MockedResponse } from '@apollo/react-testing';
import React from 'react';

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
  mockedSubEventTime1Response,
  mockedSubEventTime2Response,
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
import { DATETIME_FORMAT, ROUTES } from '../../../constants';
import { EventDocument } from '../../../generated/graphql';
import formatDate from '../../../utils/formatDate';
import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  actWait,
  configure,
  getMockReduxStore,
  loadingSpinnerIsNotInDocument,
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

const openMenu = async () => {
  const toggleButton = screen
    .getAllByRole('button', {
      name: /valinnat/i,
    })
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
      return screen.getByRole('button', {
        name: 'Tallenna luonnos',
      });
    case 'updatePublic':
      return screen.getByRole('button', {
        name: 'Tallenna muutokset',
      });
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

const getRecurringFormElement = (
  key:
    | 'addButton'
    | 'endDate'
    | 'endTime'
    | 'monCheckbox'
    | 'startDate'
    | 'startTime'
) => {
  switch (key) {
    case 'addButton':
      return screen.getByRole('button', { name: /lisää toistuva tapahtuma/i });
    case 'endDate':
      return screen.getByRole('textbox', { name: /toisto päättyy/i });
    case 'endTime':
      return screen.getByRole('textbox', { name: /tapahtuma päättyy klo/i });
    case 'monCheckbox':
      return screen.getByRole('checkbox', { name: /ma/i });
    case 'startDate':
      return screen.getByRole('textbox', { name: /toisto alkaa/i });
    case 'startTime':
      return screen.getByRole('textbox', { name: /tapahtuma alkaa klo/i });
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

  await loadingSpinnerIsNotInDocument();
  await openMenu();

  const postponeButton = getButton('postpone');
  userEvent.click(postponeButton);

  const withinModal = within(screen.getByRole('dialog'));
  const postponeEventButton = withinModal.getByRole('button', {
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

  await loadingSpinnerIsNotInDocument(10000);
  expect(history.location.pathname).toBe('/fi/events');
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

  await screen.findByText(expectedValues.updatedLastModifiedTime, undefined, {
    timeout: 10000,
  });
});

test('should update recurring event', async () => {
  const mocks: MockedResponse[] = [
    ...baseMocks.filter((item) => item.request.query !== EventDocument),
    mockedEventWithSubEventResponse,
    mockedSubEventsResponse,
    mockedSubEventTime1Response,
    mockedSubEventTime2Response,
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
  const tableRows = screen.getAllByRole('row');
  for (const row of tableRows) {
    const withinRow = within(row);
    if (
      withinRow.queryByRole('cell', {
        name: `${formatDate(
          subEventTimes[0].startTime,
          DATETIME_FORMAT
        )} – ${formatDate(subEventTimes[0].endTime, DATETIME_FORMAT)}`,
      })
    ) {
      const toggleMenuButton = withinRow.getByRole('button', {
        name: /valinnat/i,
      });
      userEvent.click(toggleMenuButton);
      const deleteButton = withinRow.getByRole('button', { name: /poista/i });
      userEvent.click(deleteButton);
    }
  }

  const recurringEventTab = screen.getByRole('tab', {
    name: /toistuva tapahtuma/i,
  });
  userEvent.click(recurringEventTab);

  const weekDays = ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'];

  const startDayCheckbox = screen.getByRole('checkbox', {
    name: weekDays[newSubEventTimes[0].startTime.getDay()],
  });
  const endDayCheckbox = screen.getByRole('checkbox', {
    name: weekDays[newSubEventTimes[1].startTime.getDay()],
  });
  const endDateInput = getRecurringFormElement('endDate');
  const endTimeInput = getRecurringFormElement('endTime');
  const startDateInput = getRecurringFormElement('startDate');
  const startTimeInput = getRecurringFormElement('startTime');

  userEvent.click(startDayCheckbox);
  userEvent.click(endDayCheckbox);
  userEvent.click(startDateInput);
  userEvent.type(startDateInput, formatDate(newSubEventTimes[0].startTime));
  userEvent.click(endDateInput);
  userEvent.type(endDateInput, formatDate(newSubEventTimes[1].endTime));
  userEvent.click(startTimeInput);
  userEvent.type(
    startTimeInput,
    formatDate(newSubEventTimes[0].startTime, 'HH.mm')
  );
  userEvent.click(endTimeInput);
  userEvent.type(
    endTimeInput,
    formatDate(newSubEventTimes[1].endTime, 'HH.mm')
  );
  const addButton = getRecurringFormElement('addButton');
  await waitFor(() => {
    expect(addButton).toBeEnabled();
  });
  userEvent.click(addButton);

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
  await loadingSpinnerIsNotInDocument(10000);
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

  await loadingSpinnerIsNotInDocument();

  const updateButton = getButton('updateDraft');
  userEvent.click(updateButton);

  const nameFiInput = getInput('nameFi');

  await waitFor(() => {
    expect(nameFiInput).toHaveFocus();
  });
});
