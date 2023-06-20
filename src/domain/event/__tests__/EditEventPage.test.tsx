/* eslint-disable max-len */
import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { mockedKeywordsResponse as mockedKeywordSelectorKeywordsResponse } from '../../../common/components/keywordSelector/__mocks__/keywordSelector';
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
  actWait,
  configure,
  fireEvent,
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
  mockedPlaceResponse,
  mockedPlacesResponse,
} from '../../place/__mocks__/place';
import {
  mockedUserResponse,
  mockedUserWithoutOrganizationsResponse,
} from '../../user/__mocks__/user';
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
  mockedKeywordSelectorKeywordsResponse,
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

  await user.click(toggleButton);
  const menu = screen.getByRole('region', { name: /valinnat/i });

  return { menu, toggleButton };
};

const findElement = (key: 'nameFi' | 'nameSv') => {
  switch (key) {
    case 'nameFi':
      return screen.findByLabelText(/tapahtuman otsikko suomeksi/i);

    case 'nameSv':
      return screen.findByLabelText(/tapahtuman otsikko ruotsiksi/i);
  }
};

const getElement = (
  key: 'infoLanguage' | 'mainCategories' | 'updateDraft' | 'updatePublic'
) => {
  switch (key) {
    case 'infoLanguage':
      return screen.getByRole('group', {
        name: /tapahtumatietojen syöttökielet/i,
      });
    case 'mainCategories':
      return screen.getByRole('group', { name: /valitse kategoria\(t\)/i });
    case 'updateDraft':
      return screen.getByRole('button', { name: 'Tallenna luonnos' });
    case 'updatePublic':
      return screen.getByRole('button', { name: 'Tallenna muutokset' });
  }
};

const getAddEventTimeElements = () => {
  const withinAddEventTime = within(
    screen.getByRole('tabpanel', { name: /tapahtuman ajankohta/i })
  );
  const addButton = withinAddEventTime.getByRole('button', {
    name: /lisää ajankohta/i,
  });
  const endDateInput = withinAddEventTime.getByLabelText(/Tapahtuma päättyy/i);
  const endTimeGroup = withinAddEventTime.getByRole('group', {
    name: /päättymisaika/i,
  });
  const endTimeInput = within(endTimeGroup).getByLabelText('tunnit');
  const startDateInput = withinAddEventTime.getByLabelText(/Tapahtuma alkaa/i);
  const startTimeGroup = withinAddEventTime.getByRole('group', {
    name: /alkamisaika/i,
  });
  const startTimeInput = within(startTimeGroup).getByLabelText('tunnit');

  return {
    addButton,
    endDateInput,
    endTimeInput,
    startDateInput,
    startTimeInput,
  };
};

const waitLoadingAndFindNameInput = async () => {
  await loadingSpinnerIsNotInDocument();
  return await findElement('nameFi');
};

test('should cancel event', async () => {
  const mocks: MockedResponse[] = [
    ...baseMocks,
    mockedCancelEventResponse,
    mockedCancelledEventResponse,
  ];

  const user = userEvent.setup();
  renderComponent(mocks);

  await waitLoadingAndFindNameInput();
  const { menu } = await openMenu();

  const cancelButton = within(menu).getByRole('button', {
    name: 'Peruuta tapahtuma',
  });
  await user.click(cancelButton);

  const modal = screen.getByRole('dialog', {
    name: 'Varmista tapahtuman peruminen',
  });
  // Cancel event button inside modal
  const confirmCancelButton = within(modal).getByRole('button', {
    name: 'Peruuta tapahtuma',
  });
  await user.click(confirmCancelButton);

  await waitFor(() => expect(modal).not.toBeInTheDocument(), {
    timeout: 10000,
  });
  await loadingSpinnerIsNotInDocument(10000);
  await screen.findByText('Peruutettu');
  // Wait organization selector and keyword selector components to be updated to avoid act warnings
  await actWait(100);
});

test('should postpone event', async () => {
  const mocks: MockedResponse[] = [
    ...baseMocks,
    mockedPostponeEventResponse,
    mockedPostponedEventResponse,
  ];

  const user = userEvent.setup();
  renderComponent(mocks);

  await waitLoadingAndFindNameInput();
  const { menu } = await openMenu();

  const postponeButton = within(menu).getByRole('button', {
    name: 'Lykkää tapahtumaa',
  });
  await user.click(postponeButton);

  const modal = screen.getByRole('dialog', {
    name: 'Varmista tapahtuman lykkääminen',
  });

  const confirmPostponeButton = within(modal).getByRole('button', {
    name: 'Lykkää tapahtumaa',
  });
  await user.click(confirmPostponeButton);

  await waitFor(() => expect(modal).not.toBeInTheDocument(), {
    timeout: 10000,
  });
  await loadingSpinnerIsNotInDocument(10000);
  await screen.findByText('Lykätty');
  // Wait organization selector and keyword selector components to be updated to avoid act warnings
  await actWait(100);
});

test('should delete event', async () => {
  const mocks: MockedResponse[] = [
    ...baseMocks,
    // Request to update event
    mockedDeleteEventResponse,
  ];

  const user = userEvent.setup();
  const { history } = renderComponent(mocks);

  await waitLoadingAndFindNameInput();
  const { menu } = await openMenu();

  const deleteButton = within(menu).getByRole('button', {
    name: 'Poista tapahtuma',
  });
  await user.click(deleteButton);

  const modal = screen.getByRole('dialog', {
    name: 'Varmista tapahtuman poistaminen',
  });
  // Delete event button inside modal
  const confirmDeleteButton = within(modal).getByRole('button', {
    name: 'Poista tapahtuma',
  });
  await user.click(confirmDeleteButton);

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

  await waitLoadingAndFindNameInput();

  const withinMainCategories = within(getElement('mainCategories'));
  const topicCheckbox = await withinMainCategories.findByLabelText(topicName);
  await waitFor(() => expect(topicCheckbox).toBeChecked());

  // Main categories are not visible in UI. Give some time to update main categories to formik
  await actWait(100);
  const updateButton = getElement('updatePublic');
  await waitFor(() => expect(updateButton).toBeEnabled());
  await user.click(updateButton);

  await loadingSpinnerIsNotInDocument(30000);
  await screen.findByText(expectedValues.updatedLastModifiedTime, undefined, {
    timeout: 30000,
  });
  // Wait organization selector and keyword selector components to be updated to avoid act warnings
  await actWait(100);
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

  await waitLoadingAndFindNameInput();
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
  await user.click(toggleMenuButton);
  const menu = withinRow.getByRole('region', { name: /valinnat/i });
  const deleteButton = within(menu).getByRole('button', { name: /poista/i });
  await user.click(deleteButton);

  const {
    addButton,
    endDateInput,
    endTimeInput,
    startDateInput,
    startTimeInput,
  } = getAddEventTimeElements();

  for (const newEventTime of newSubEventTimes) {
    const startDateValue = formatDate(newEventTime.startTime, DATE_FORMAT);
    const startTimeValue = formatDate(newEventTime.startTime, TIME_FORMAT_DATA);
    const endDateValue = formatDate(newEventTime.endTime, DATE_FORMAT);
    const endTimeValue = formatDate(newEventTime.endTime, TIME_FORMAT_DATA);

    fireEvent.change(startDateInput, { target: { value: startDateValue } });
    await user.type(startTimeInput, startTimeValue);
    fireEvent.change(endDateInput, { target: { value: endDateValue } });
    await user.type(endTimeInput, endTimeValue);

    await waitFor(() => expect(addButton).toBeEnabled());
    await user.click(addButton);
  }

  const updateButton = getElement('updatePublic');
  await user.click(updateButton);

  const modal = await screen.findByRole('dialog', {
    name: 'Varmista tapahtuman tallentaminen',
  });
  // Update event button inside modal
  const confirmUpdateButton = await within(modal).getByRole('button', {
    name: 'Tallenna',
  });
  await user.click(confirmUpdateButton);

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

  const nameFiInput = await waitLoadingAndFindNameInput();

  const updateButton = getElement('updateDraft');
  await user.click(updateButton);

  await waitFor(() => expect(nameFiInput).toHaveFocus());
});

test('should show server errors', async () => {
  const mocks = [...baseMocks, mockedInvalidUpdateEventResponse];

  const user = userEvent.setup();
  renderComponent(mocks);

  await waitLoadingAndFindNameInput();

  const withinMainCategories = within(getElement('mainCategories'));
  const topicCheckbox = await withinMainCategories.findByLabelText(topicName);
  await waitFor(() => expect(topicCheckbox).toBeChecked());

  const updateButton = getElement('updatePublic');
  await waitFor(() => expect(updateButton).toBeEnabled());
  await user.click(updateButton);

  await loadingSpinnerIsNotInDocument(10000);
  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/lopetusaika ei voi olla menneisyydessä./i);
});

test('should render fields for external user', async () => {
  const mocks = [
    mockedEventResponse,
    mockedEventTimeResponse,
    mockedImageResponse,
    mockedKeywordSelectorKeywordsResponse,
    mockedAudienceKeywordSetResponse,
    mockedTopicsKeywordSetResponse,
    mockedLanguagesResponse,
    mockedPlaceResponse,
    mockedPlacesResponse,
    mockedFilteredPlacesResponse,
    mockedUserWithoutOrganizationsResponse,
    mockedOrganizationResponse,
    mockedOrganizationAncestorsResponse,
  ];

  renderComponent(mocks);

  await loadingSpinnerIsNotInDocument();

  const externalUserFieldLabels = [
    /tapahtumalla on ekokompassi tai muu vastaava sertifikaatti/i,
    /sertifikaatin nimi/i,
    /sisällä/i,
    /nimi/i,
    /sähköpostiosoite/i,
    /puhelinnumero/i,
    /organisaatio/i,
    /olen lukenut tietosuojaselosteen ja annan luvan tietojeni käyttöön/i,
  ];

  externalUserFieldLabels.forEach(async (label) =>
    expect(await screen.findByLabelText(label)).toBeInTheDocument()
  );

  const disabledFieldLabels = [
    /tapahtuma/i,
    /sertifikaatin nimi/i,
    /tapahtuman julkaisija/i,
  ];

  disabledFieldLabels.forEach(async (label) =>
    expect(await screen.findByLabelText(label)).toBeDisabled()
  );

  const requiredFieldLabels = [
    /tapahtuman järjestäjä suomeksi/i,
    /sertifikaatin nimi/i,
    /enimmäisosallistujamäärä/i,
    /nimi/i,
    /sähköpostiosoite/i,
    /puhelinnumero/i,
    /olen lukenut tietosuojaselosteen ja annan luvan tietojeni käyttöön/i,
  ];

  requiredFieldLabels.forEach(async (label) =>
    expect(await screen.findByLabelText(label)).toBeRequired()
  );
});
