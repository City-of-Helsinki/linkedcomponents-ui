import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import {
  DATE_FORMAT,
  DATETIME_FORMAT,
  ROUTES,
  TIME_FORMAT_DATA,
} from '../../../constants';
import { EventDocument } from '../../../generated/graphql';
import formatDate from '../../../utils/formatDate';
import { fakeAuthenticatedAuthContextValue } from '../../../utils/mockAuthContextValue';
import {
  act,
  actWait,
  configure,
  loadingSpinnerIsNotInDocument,
  renderWithRoute,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../utils/testUtils';
import {
  mockedImageResponse,
  mockedUpdateImageResponse,
} from '../../image/__mocks__/image';
import {
  mockedAudienceKeywordSetResponse,
  mockedTopicsKeywordSetResponse,
  topicName,
} from '../../keywordSet/__mocks__/keywordSets';
import { mockedLanguagesResponse } from '../../language/__mocks__/language';
import { mockedOrganizationResponse } from '../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import {
  mockedFilteredPlacesResponse,
  mockedPlacesResponse,
} from '../../place/__mocks__/place';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  eventId,
  expectedValues,
  mockedCancelEventResponse,
  mockedCancelledEventResponse,
  mockedCreateNewSubEventsResponse,
  mockedDeleteEventResponse,
  mockedDeleteSubEvent1Response,
  mockedEventResponse,
  mockedEventTimeResponse,
  mockedEventWithSubEventResponse,
  mockedInvalidEventResponse,
  mockedInvalidUpdateEventResponse,
  mockedKeywordsResponse,
  mockedPostponedEventResponse,
  mockedPostponeEventResponse,
  mockedSubEventsResponse,
  mockedSubSubEventsResponse,
  mockedUpdatedEventResponse,
  mockedUpdatedRecurringEventResponse,
  mockedUpdateEventResponse,
  mockedUpdateRecurringEventResponse,
  mockedUpdateSubEventsResponse,
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

const authContextValue = fakeAuthenticatedAuthContextValue();

const route = ROUTES.EDIT_EVENT.replace(':id', eventId);

const renderComponent = (mocks: MockedResponse[] = baseMocks) =>
  renderWithRoute(<EditEventPage />, {
    authContextValue,
    mocks,
    routes: [route],
    path: ROUTES.EDIT_EVENT,
  });

const openMenu = async () => {
  const user = userEvent.setup();
  const toggleButton = screen
    .getAllByRole('button', { name: /valinnat/i })
    .pop() as HTMLElement;

  await act(async () => await user.click(toggleButton));
  screen.getByRole('region', { name: /valinnat/i });

  return toggleButton;
};

const findElement = (key: 'topicCheckbox') => {
  switch (key) {
    case 'topicCheckbox':
      return screen.findByRole('checkbox', { name: topicName });
  }
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
  key: 'addButton' | 'endDate' | 'endTime' | 'startDate' | 'startTime'
) => {
  switch (key) {
    case 'addButton':
      return screen.getByRole('button', { name: /lisää ajankohta/i });
    case 'endDate':
      return screen.getByRole('textbox', { name: 'Tapahtuma päättyy *' });
    case 'endTime':
      return screen.getByRole('textbox', { name: /tapahtuma päättyy klo/i });
    case 'startDate':
      return screen.getByRole('textbox', { name: 'Tapahtuma alkaa *' });
    case 'startTime':
      return screen.getByRole('textbox', { name: /tapahtuma alkaa klo/i });
  }
};

test('should cancel event', async () => {
  const mocks: MockedResponse[] = [
    ...baseMocks,
    mockedCancelEventResponse,
    mockedCancelledEventResponse,
  ];

  const user = userEvent.setup();
  renderComponent(mocks);

  await loadingSpinnerIsNotInDocument();
  await openMenu();

  const cancelButton = getButton('cancel');
  await act(async () => await user.click(cancelButton));

  const modal = screen.getByRole('dialog', {
    name: 'Varmista tapahtuman peruminen',
  });
  const withinModal = within(modal);
  // Cancel event button inside modal
  const cancelEventButton = withinModal.getByRole('button', {
    name: 'Peruuta tapahtuma',
  });
  await act(async () => await user.click(cancelEventButton));

  await waitFor(() => expect(modal).not.toBeInTheDocument(), {
    timeout: 10000,
  });
  await loadingSpinnerIsNotInDocument(10000);
  screen.getByText('Peruutettu');
});

test('should postpone event', async () => {
  const mocks: MockedResponse[] = [
    ...baseMocks,
    mockedPostponeEventResponse,
    mockedPostponedEventResponse,
  ];

  const user = userEvent.setup();
  renderComponent(mocks);

  await loadingSpinnerIsNotInDocument();
  await openMenu();

  const postponeButton = getButton('postpone');
  await act(async () => await user.click(postponeButton));

  const modal = screen.getByRole('dialog', {
    name: 'Varmista tapahtuman lykkääminen',
  });
  const withinModal = within(modal);
  const postponeEventButton = withinModal.getByRole('button', {
    name: 'Lykkää tapahtumaa',
  });
  await act(async () => await user.click(postponeEventButton));

  await waitFor(() => expect(modal).not.toBeInTheDocument(), {
    timeout: 10000,
  });
  await loadingSpinnerIsNotInDocument(10000);
  screen.getByText('Lykätty');
});

test('should delete event', async () => {
  const mocks: MockedResponse[] = [
    ...baseMocks,
    // Request to update event
    mockedDeleteEventResponse,
  ];

  const user = userEvent.setup();
  const { history } = renderComponent(mocks);

  await loadingSpinnerIsNotInDocument();
  await openMenu();

  const deleteButton = getButton('delete');
  await act(async () => await user.click(deleteButton));

  const modal = screen.getByRole('dialog', {
    name: 'Varmista tapahtuman poistaminen',
  });
  const withinModal = within(modal);
  // Delete event button inside modal
  const deleteEventButton = withinModal.getByRole('button', {
    name: 'Poista tapahtuma',
  });
  await act(async () => await user.click(deleteEventButton));

  await waitFor(() => expect(modal).not.toBeInTheDocument(), {
    timeout: 10000,
  });
  expect(history.location.pathname).toBe('/fi/search');
});

test('should update event', async () => {
  const mocks: MockedResponse[] = [
    ...baseMocks,
    mockedUpdateEventResponse,
    mockedUpdatedEventResponse,
    mockedUpdateImageResponse,
  ];

  const user = userEvent.setup();
  renderComponent(mocks);

  await loadingSpinnerIsNotInDocument();

  const topicCheckbox = await findElement('topicCheckbox');
  await waitFor(() => expect(topicCheckbox).toBeChecked());

  // Main categories are not visible in UI. Give some time to update main categories to formik
  await actWait(100);
  const updateButton = getButton('updatePublic');
  await waitFor(() => expect(updateButton).toBeEnabled());
  await act(async () => await user.click(updateButton));

  await loadingSpinnerIsNotInDocument(30000);
  await screen.findByText(expectedValues.updatedLastModifiedTime, undefined, {
    timeout: 30000,
  });
});

test('should update recurring event', async () => {
  const mocks: MockedResponse[] = [
    ...baseMocks.filter((item) => item.request.query !== EventDocument),
    mockedEventWithSubEventResponse,
    mockedSubEventsResponse,
    mockedSubSubEventsResponse,
    mockedDeleteSubEvent1Response,
    mockedUpdateSubEventsResponse,
    mockedCreateNewSubEventsResponse,
    mockedUpdateRecurringEventResponse,
    mockedUpdatedRecurringEventResponse,
    mockedUpdatedRecurringEventResponse,
    mockedSubEventsResponse,
    mockedSubSubEventsResponse,
    mockedUpdateImageResponse,
  ];

  const user = userEvent.setup();
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
  const toggleMenuButton = withinRow.getByRole('button', { name: /valinnat/i });
  await act(async () => await user.click(toggleMenuButton));
  const deleteButton = withinRow.getByRole('button', { name: /poista/i });
  await act(async () => await user.click(deleteButton));

  const endDateInput = getAddEventTimeFormElement('endDate');
  const endTimeInput = getAddEventTimeFormElement('endTime');
  const startDateInput = getAddEventTimeFormElement('startDate');
  const startTimeInput = getAddEventTimeFormElement('startTime');
  const addButton = getAddEventTimeFormElement('addButton');

  for (const newEventTime of newSubEventTimes) {
    const startDateValue = formatDate(newEventTime.startTime, DATE_FORMAT);
    const startTimeValue = formatDate(newEventTime.startTime, TIME_FORMAT_DATA);
    await act(async () => await user.click(startDateInput));
    await act(async () => await user.type(startDateInput, startDateValue));
    await act(async () => await user.click(startTimeInput));
    await act(async () => await user.type(startTimeInput, startTimeValue));

    const endDateValue = formatDate(newEventTime.endTime, DATE_FORMAT);
    const endTimeValue = formatDate(newEventTime.endTime, TIME_FORMAT_DATA);
    await act(async () => await user.click(endDateInput));
    await act(async () => await user.type(endDateInput, endDateValue));
    await act(async () => await user.click(endTimeInput));
    await act(async () => await user.type(endTimeInput, endTimeValue));

    await waitFor(() => expect(addButton).toBeEnabled());
    await act(async () => await user.click(addButton));
  }

  const updateButton = getButton('updatePublic');
  await act(async () => await user.click(updateButton));

  const modal = await screen.findByRole('dialog', {
    name: 'Varmista tapahtuman tallentaminen',
  });
  const withinModal = within(modal);
  // Update event button inside modal
  const updateEventButton = await withinModal.getByRole('button', {
    name: 'Tallenna',
  });
  await act(async () => await user.click(updateEventButton));

  // This test is pretty heavy so give DOM some time to update
  await waitFor(() => expect(modal).not.toBeInTheDocument(), {
    timeout: 30000,
  });
  await loadingSpinnerIsNotInDocument(30000);
  await screen.findByText(expectedValues.updatedLastModifiedTime, undefined, {
    timeout: 30000,
  });
});

test('should scroll to first error when validation error is thrown', async () => {
  const mocks: MockedResponse[] = [
    ...baseMocks.filter((item) => item.request.query !== EventDocument),
    mockedEventTimeResponse,
    mockedInvalidEventResponse,
  ];

  const user = userEvent.setup();
  renderComponent(mocks);

  await loadingSpinnerIsNotInDocument();

  const updateButton = getButton('updateDraft');
  await act(async () => await user.click(updateButton));

  const nameFiInput = getInput('nameFi');

  await waitFor(() => expect(nameFiInput).toHaveFocus());
});

test('should show server errors', async () => {
  const mocks = [...baseMocks, mockedInvalidUpdateEventResponse];

  const user = userEvent.setup();
  renderComponent(mocks);

  await loadingSpinnerIsNotInDocument();

  const topicCheckbox = await findElement('topicCheckbox');
  await waitFor(() => expect(topicCheckbox).toBeChecked());

  // Main categories are not visible in UI. Give some time to update main categories to formik
  await actWait(100);
  const updateButton = getButton('updatePublic');
  await waitFor(() => expect(updateButton).toBeEnabled());
  await act(async () => await user.click(updateButton));

  await loadingSpinnerIsNotInDocument(10000);
  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/lopetusaika ei voi olla menneisyydessä./i);
});
