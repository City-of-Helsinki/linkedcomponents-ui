import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { ROUTES } from '../../../constants';
import getValue from '../../../utils/getValue';
import { fakeAuthenticatedAuthContextValue } from '../../../utils/mockAuthContextValue';
import {
  configure,
  loadingSpinnerIsNotInDocument,
  renderWithRoute,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../utils/testUtils';
import { mockedOrganizationResponse } from '../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  mockedDeletePlaceResponse,
  mockedInvalidUpdatePlaceResponse,
  mockedPlaceResponse,
  mockedUpdatePlaceResponse,
  place,
} from '../__mocks__/editPlacePage';
import EditPlacePage from '../EditPlacePage';

configure({ defaultHidden: true });

const authContextValue = fakeAuthenticatedAuthContextValue();

const defaultMocks = [
  mockedOrganizationResponse,
  mockedOrganizationAncestorsResponse,
  mockedPlaceResponse,
  mockedUserResponse,
];

const route = ROUTES.EDIT_PLACE.replace(':id', getValue(place.id, ''));

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  renderWithRoute(<EditPlacePage />, {
    authContextValue,
    mocks,
    routes: [route],
    path: ROUTES.EDIT_PLACE,
  });

const findElement = (key: 'deleteButton' | 'nameInput') => {
  switch (key) {
    case 'deleteButton':
      return screen.findByRole('button', { name: /poista paikka/i });
    case 'nameInput':
      return screen.findByLabelText(/nimi \(suomeksi\)/i);
  }
};

const getElement = (key: 'saveButton') => {
  switch (key) {
    case 'saveButton':
      return screen.getByRole('button', { name: /tallenna/i });
  }
};

test('should scroll to first validation error input field', async () => {
  const user = userEvent.setup();
  renderComponent();

  await loadingSpinnerIsNotInDocument();
  const nameInput = await findElement('nameInput');
  const saveButton = getElement('saveButton');

  await user.clear(nameInput);
  await user.click(saveButton);

  await waitFor(() => expect(nameInput).toHaveFocus());
});

test('should delete place', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedDeletePlaceResponse,
  ]);

  await loadingSpinnerIsNotInDocument();

  const deleteButton = await findElement('deleteButton');
  await user.click(deleteButton);

  const withinModal = within(screen.getByRole('dialog'));
  const confirmDeleteButton = withinModal.getByRole('button', {
    name: 'Poista paikka',
  });
  await user.click(confirmDeleteButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/places`)
  );
  await screen.findByRole('alert', { name: 'Paikka on poistettu' });
});

test('should update place', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedUpdatePlaceResponse,
  ]);

  await loadingSpinnerIsNotInDocument();

  const submitButton = getElement('saveButton');
  await user.click(submitButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/places`)
  );
  await screen.findByRole('alert', { name: 'Paikka on tallennettu' });
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedInvalidUpdatePlaceResponse]);

  await loadingSpinnerIsNotInDocument();

  const submitButton = getElement('saveButton');
  await user.click(submitButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Nimi on pakollinen./i);
});
