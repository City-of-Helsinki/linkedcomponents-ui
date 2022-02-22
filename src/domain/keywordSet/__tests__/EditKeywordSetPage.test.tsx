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
import { mockedOrganizationResponse } from '../../organization/__mocks__/organization';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  keywordSet,
  mockedDeleteKeywordSetResponse,
  mockedInvalidUpdateKeywordSetResponse,
  mockedKeywordSetResponse,
  mockedUpdateKeywordSetResponse,
} from '../__mocks__/editKeywordSetPage';
import EditKeywordSetPage from '../EditKeywordSetPage';

configure({ defaultHidden: true });

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const defaultMocks = [
  mockedKeywordSetResponse,
  mockedOrganizationResponse,
  mockedUserResponse,
];

const route = ROUTES.EDIT_KEYWORD_SET.replace(':id', keywordSet.id);

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  renderWithRoute(<EditKeywordSetPage />, {
    mocks,
    routes: [route],
    path: ROUTES.EDIT_KEYWORD_SET,
    store,
  });

const findElement = (key: 'deleteButton' | 'nameInput' | 'saveButton') => {
  switch (key) {
    case 'deleteButton':
      return screen.findByRole('button', { name: /poista avainsanaryhmä/i });
    case 'nameInput':
      return screen.findByRole('textbox', { name: /nimi \(suomeksi\)/i });
    case 'saveButton':
      return screen.findByRole('button', { name: /tallenna/i });
  }
};

test('should scroll to first validation error input field', async () => {
  renderComponent();

  const nameInput = await findElement('nameInput');
  userEvent.clear(nameInput);
  const saveButton = await findElement('saveButton');
  userEvent.click(saveButton);

  await waitFor(() => expect(nameInput).toHaveFocus());
});

test('should delete keyword', async () => {
  const { history } = renderComponent([
    ...defaultMocks,
    mockedDeleteKeywordSetResponse,
  ]);

  const deleteButton = await findElement('deleteButton');
  act(() => userEvent.click(deleteButton));

  const withinModal = within(screen.getByRole('dialog'));
  const deleteKeywordSetButton = withinModal.getByRole('button', {
    name: 'Poista avainsanaryhmä',
  });
  userEvent.click(deleteKeywordSetButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/admin/keyword-sets`)
  );
});

test('should update keyword set', async () => {
  const { history } = renderComponent([
    ...defaultMocks,
    mockedUpdateKeywordSetResponse,
  ]);

  await findElement('nameInput');

  const submitButton = await findElement('saveButton');
  userEvent.click(submitButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/admin/keyword-sets`)
  );
});

test('should show server errors', async () => {
  renderComponent([...defaultMocks, mockedInvalidUpdateKeywordSetResponse]);

  await findElement('nameInput');

  const submitButton = await findElement('saveButton');
  userEvent.click(submitButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Nimi on pakollinen./i);
});
