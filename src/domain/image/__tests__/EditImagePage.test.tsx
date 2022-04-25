import { MockedResponse } from '@apollo/client/testing';

import { ROUTES } from '../../../constants';
import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  act,
  configure,
  getMockReduxStore,
  renderWithRoute,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../utils/testUtils';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  image,
  mockedDeleteImageResponse,
  mockedImageResponse,
  mockedInvalidUpdateImageResponse,
  mockedUpdateImageResponse,
} from '../__mocks__/editImagePage';
import EditImagePage from '../EditImagePage';

configure({ defaultHidden: true });

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const defaultMocks = [mockedImageResponse, mockedUserResponse];

const route = ROUTES.EDIT_IMAGE.replace(':id', image.id);

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  renderWithRoute(<EditImagePage />, {
    mocks,
    routes: [route],
    path: ROUTES.EDIT_IMAGE,
    store,
  });

const findElement = (key: 'deleteButton' | 'nameInput') => {
  switch (key) {
    case 'deleteButton':
      return screen.findByRole('button', { name: /poista kuva/i });
    case 'nameInput':
      return screen.findByRole('textbox', { name: /kuvateksti/i });
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

  const nameInput = await findElement('nameInput');
  userEvent.clear(nameInput);
  const saveButton = getElement('saveButton');
  userEvent.click(saveButton);

  await waitFor(() => expect(nameInput).toHaveFocus());
});

test('should delete keyword', async () => {
  const { history } = renderComponent([
    ...defaultMocks,
    mockedDeleteImageResponse,
  ]);

  const deleteButton = await findElement('deleteButton');
  act(() => userEvent.click(deleteButton));

  const withinModal = within(screen.getByRole('dialog'));
  const deleteKeywordButton = withinModal.getByRole('button', {
    name: 'Poista kuva',
  });
  userEvent.click(deleteKeywordButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/admin/images`)
  );
});

test('should update image', async () => {
  const { history } = renderComponent([
    ...defaultMocks,
    mockedUpdateImageResponse,
  ]);

  await findElement('nameInput');

  const submitButton = getElement('saveButton');
  userEvent.click(submitButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/admin/images`)
  );
});

test('should show server errors', async () => {
  renderComponent([...defaultMocks, mockedInvalidUpdateImageResponse]);

  await findElement('nameInput');

  const submitButton = getElement('saveButton');
  userEvent.click(submitButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Nimi on pakollinen./i);
});
