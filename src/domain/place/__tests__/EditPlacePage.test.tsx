import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { ROUTES } from '../../../constants';
import { fakeAuthenticatedAuthContextValue } from '../../../utils/mockAuthContextValue';
import {
  act,
  configure,
  loadingSpinnerIsNotInDocument,
  renderWithRoute,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../utils/testUtils';
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

const defaultMocks = [mockedPlaceResponse, mockedUserResponse];

const route = ROUTES.EDIT_PLACE.replace(':id', place.id as string);

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
      return screen.findByRole('textbox', { name: /nimi \(suomeksi\)/i });
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
  await act(async () => await user.clear(nameInput));
  const saveButton = getElement('saveButton');
  await act(async () => await user.click(saveButton));

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
  await act(async () => await user.click(deleteButton));

  const withinModal = within(screen.getByRole('dialog'));
  const deletePlaceButton = withinModal.getByRole('button', {
    name: 'Poista paikka',
  });
  await act(async () => await user.click(deletePlaceButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/places`)
  );
});

test('should update place', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedUpdatePlaceResponse,
  ]);

  await loadingSpinnerIsNotInDocument();

  const submitButton = getElement('saveButton');
  await act(async () => await user.click(submitButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/places`)
  );
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedInvalidUpdatePlaceResponse]);

  await findElement('nameInput');

  const submitButton = getElement('saveButton');
  await act(async () => await user.click(submitButton));

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Nimi on pakollinen./i);
});
