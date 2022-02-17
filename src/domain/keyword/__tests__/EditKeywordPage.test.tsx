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
  keyword,
  mockedDeleteKeywordResponse,
  mockedInvalidUpdateKeywordResponse,
  mockedKeywordResponse,
  mockedUpdateKeywordResponse,
} from '../__mocks__/editKeywordPage';
import EditKeywordPage from '../EditKeywordPage';

configure({ defaultHidden: true });

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const defaultMocks = [mockedKeywordResponse, mockedUserResponse];

const route = ROUTES.EDIT_KEYWORD.replace(':id', keyword.id);

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  renderWithRoute(<EditKeywordPage />, {
    mocks,
    routes: [route],
    path: ROUTES.EDIT_KEYWORD,
    store,
  });

const findElement = (key: 'deleteButton' | 'nameInput') => {
  switch (key) {
    case 'deleteButton':
      return screen.findByRole('button', { name: /poista avainsana/i });
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

  const nameInput = await findElement('nameInput');
  userEvent.clear(nameInput);
  const saveButton = getElement('saveButton');
  userEvent.click(saveButton);

  await waitFor(() => expect(nameInput).toHaveFocus());
});

test('should delete keyword', async () => {
  const { history } = renderComponent([
    ...defaultMocks,
    mockedDeleteKeywordResponse,
  ]);

  const deleteButton = await findElement('deleteButton');
  act(() => userEvent.click(deleteButton));

  const withinModal = within(screen.getByRole('dialog'));
  const deleteKeywordButton = withinModal.getByRole('button', {
    name: 'Poista avainsana',
  });
  userEvent.click(deleteKeywordButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/admin/keywords`)
  );
});

test('should update keyword', async () => {
  const { history } = renderComponent([
    ...defaultMocks,
    mockedUpdateKeywordResponse,
  ]);

  await findElement('nameInput');

  const submitButton = getElement('saveButton');
  userEvent.click(submitButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/admin/keywords`)
  );
});

test('should show server errors', async () => {
  renderComponent([...defaultMocks, mockedInvalidUpdateKeywordResponse]);

  await findElement('nameInput');

  const submitButton = getElement('saveButton');
  userEvent.click(submitButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Nimi on pakollinen./i);
});
