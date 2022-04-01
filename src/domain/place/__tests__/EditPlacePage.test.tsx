import { MockedResponse } from '@apollo/client/testing';

import { ROUTES } from '../../../constants';
import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  act,
  getMockReduxStore,
  renderWithRoute,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../utils/testUtils';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  mockedDeletePlaceResponse,
  mockedPlaceResponse,
  place,
} from '../__mocks__/editPlacePage';
import EditPlacePage from '../EditPlacePage';

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

test('should delete place', async () => {
  const { history } = renderComponent([
    ...defaultMocks,
    mockedDeletePlaceResponse,
  ]);

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
