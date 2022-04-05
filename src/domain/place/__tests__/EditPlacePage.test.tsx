import { MockedResponse } from '@apollo/client/testing';

import { ROUTES } from '../../../constants';
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

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const defaultMocks = [mockedPlaceResponse, mockedUserResponse];

const route = ROUTES.EDIT_PLACE.replace(':id', place.id);

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  renderWithRoute(<EditPlacePage />, {
    mocks,
    routes: [route],
    path: ROUTES.EDIT_PLACE,
    store,
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
  renderComponent();

  await loadingSpinnerIsNotInDocument();
  const nameInput = await findElement('nameInput');
  userEvent.clear(nameInput);
  const saveButton = getElement('saveButton');
  userEvent.click(saveButton);

  await waitFor(() => expect(nameInput).toHaveFocus());
});

test('should delete place', async () => {
  const { history } = renderComponent([
    ...defaultMocks,
    mockedDeletePlaceResponse,
  ]);

  await loadingSpinnerIsNotInDocument();
  const deleteButton = await findElement('deleteButton');
  act(() => userEvent.click(deleteButton));

  const withinModal = within(screen.getByRole('dialog'));
  const deletePlaceButton = withinModal.getByRole('button', {
    name: 'Poista paikka',
  });
  userEvent.click(deletePlaceButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/admin/places`)
  );
});

test('should update place', async () => {
  const { history } = renderComponent([
    ...defaultMocks,
    mockedUpdatePlaceResponse,
  ]);

  await loadingSpinnerIsNotInDocument();

  const submitButton = getElement('saveButton');
  userEvent.click(submitButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/admin/places`)
  );
});

test('should show server errors', async () => {
  renderComponent([...defaultMocks, mockedInvalidUpdatePlaceResponse]);

  await findElement('nameInput');

  const submitButton = getElement('saveButton');
  userEvent.click(submitButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Nimi on pakollinen./i);
});
