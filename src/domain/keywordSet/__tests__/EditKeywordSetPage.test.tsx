import { MockedResponse } from '@apollo/client/testing';

import { ROUTES } from '../../../constants';
import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  getMockReduxStore,
  renderWithRoute,
  screen,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  keywordSet,
  mockedInvalidUpdateKeywordSetResponse,
  mockedKeywordSetResponse,
  mockedUpdateKeywordSetResponse,
} from '../__mocks__/editKeywordSetPage';
import EditKeywordSetPage from '../EditKeywordSetPage';

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const defaultMocks = [mockedKeywordSetResponse, mockedUserResponse];

const route = ROUTES.EDIT_KEYWORD_SET.replace(':id', keywordSet.id);

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  renderWithRoute(<EditKeywordSetPage />, {
    mocks,
    routes: [route],
    path: ROUTES.EDIT_KEYWORD_SET,
    store,
  });

const findElement = (key: 'nameInput') => {
  switch (key) {
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

test('should update keyword set', async () => {
  const { history } = renderComponent([
    ...defaultMocks,
    mockedUpdateKeywordSetResponse,
  ]);

  await findElement('nameInput');

  const submitButton = getElement('saveButton');
  userEvent.click(submitButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/admin/keyword-sets`)
  );
});

test('should show server errors', async () => {
  renderComponent([...defaultMocks, mockedInvalidUpdateKeywordSetResponse]);

  await findElement('nameInput');

  const submitButton = getElement('saveButton');
  userEvent.click(submitButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Nimi on pakollinen./i);
});
