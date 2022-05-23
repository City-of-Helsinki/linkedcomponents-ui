import { MockedResponse } from '@apollo/client/testing';

import { ROUTES } from '../../../constants';
import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  act,
  actWait,
  configure,
  getMockReduxStore,
  loadingSpinnerIsNotInDocument,
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

const getElement = (key: 'nameInput') => {
  switch (key) {
    case 'nameInput':
      return screen.getByRole('textbox', { name: /nimi \(suomeksi\)/i });
  }
};

test('should scroll to first validation error input field', async () => {
  const user = userEvent.setup();
  await renderComponent();

  await loadingSpinnerIsNotInDocument();
  await actWait(100);

  const nameInput = getElement('nameInput');
  const saveButton = await findElement('saveButton');
  await waitFor(() => expect(saveButton).toBeEnabled());

  await act(async () => await user.clear(nameInput));
  await act(async () => await user.click(saveButton));

  await waitFor(() => expect(nameInput).toHaveFocus());
});

test('should delete keyword', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedDeleteKeywordSetResponse,
  ]);

  await loadingSpinnerIsNotInDocument();
  await actWait(100);

  const deleteButton = await findElement('deleteButton');
  await waitFor(() => expect(deleteButton).toBeEnabled());
  await act(async () => await user.click(deleteButton));

  const withinModal = within(screen.getByRole('dialog'));
  const deleteKeywordSetButton = withinModal.getByRole('button', {
    name: 'Poista avainsanaryhmä',
  });
  await act(async () => await user.click(deleteKeywordSetButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/keyword-sets`)
  );
});

test('should update keyword set', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedUpdateKeywordSetResponse,
  ]);

  await loadingSpinnerIsNotInDocument();
  await actWait(100);

  const saveButton = await findElement('saveButton');
  await waitFor(() => expect(saveButton).toBeEnabled());

  await act(async () => await user.click(saveButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/keyword-sets`)
  );
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedInvalidUpdateKeywordSetResponse]);

  await loadingSpinnerIsNotInDocument();
  await actWait(100);

  const saveButton = await findElement('saveButton');
  await waitFor(() => expect(saveButton).toBeEnabled());

  await act(async () => await user.click(saveButton));

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Nimi on pakollinen./i);
});
