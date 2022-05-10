import { MockedResponse } from '@apollo/client/testing';

import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  act,
  actWait,
  configure,
  getMockReduxStore,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import { mockedOrganizationResponse } from '../../organization/__mocks__/organization';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  keywordSetValues,
  mockedCreateKeywordSetResponse,
  mockedInvalidCreateKeywordSetResponse,
  mockedKeywordsResponse,
} from '../__mocks__/createKeywordSetPage';
import CreateKeywordSetPage from '../CreateKeywordSetPage';

configure({ defaultHidden: true });

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const defaultMocks = [
  mockedKeywordsResponse,
  mockedOrganizationResponse,
  mockedUserResponse,
];

const renderComponent = (mocks: MockedResponse[] = []) =>
  render(<CreateKeywordSetPage />, { mocks, store });

const findElement = (key: 'saveButton') => {
  switch (key) {
    case 'saveButton':
      return screen.findByRole('button', { name: /tallenna/i });
  }
};

const getElement = (
  key:
    | 'keywordsToggleButton'
    | 'nameInput'
    | 'originIdInput'
    | 'saveButton'
    | 'usageToggleButton'
) => {
  switch (key) {
    case 'keywordsToggleButton':
      return screen.getByRole('button', { name: /avainsanat/i });
    case 'nameInput':
      return screen.getByRole('textbox', { name: /nimi \(suomeksi\)/i });
    case 'originIdInput':
      return screen.getByRole('textbox', { name: /lähdetunniste/i });
    case 'saveButton':
      return screen.getByRole('button', { name: /tallenna/i });
    case 'usageToggleButton':
      return screen.getByRole('button', { name: /käyttötarkoitus/i });
  }
};

const fillInputValues = async () => {
  const user = userEvent.setup();
  await act(
    async () =>
      await user.type(getElement('originIdInput'), keywordSetValues.originId)
  );
  await act(
    async () => await user.type(getElement('nameInput'), keywordSetValues.name)
  );

  await act(async () => await user.click(getElement('keywordsToggleButton')));
  const keywordsOption = await screen.findByRole(
    'option',
    { name: keywordSetValues.keyword.name.fi },
    { timeout: 10000 }
  );
  await act(async () => await user.click(keywordsOption));

  await act(async () => await user.click(getElement('usageToggleButton')));
  const usageOption = await screen.findByRole(
    'option',
    { name: 'Yleinen' },
    { timeout: 10000 }
  );
  await act(async () => await user.click(usageOption));
};

test('should focus to first validation error when trying to save new keyword set', async () => {
  const user = userEvent.setup();
  renderComponent(defaultMocks);

  await loadingSpinnerIsNotInDocument();
  await actWait(100);

  const saveButton = await findElement('saveButton');
  await waitFor(() => expect(saveButton).toBeEnabled());

  const originIdInput = getElement('originIdInput');
  await act(async () => await user.click(saveButton));
  await waitFor(() => expect(originIdInput).toHaveFocus());
  await act(
    async () => await user.type(originIdInput, keywordSetValues.originId)
  );

  const nameInput = getElement('nameInput');
  await act(async () => await user.click(saveButton));
  await waitFor(() => expect(nameInput).toHaveFocus());
  await act(async () => await user.type(nameInput, keywordSetValues.name));

  const keywordsToggleButton = getElement('keywordsToggleButton');
  await act(async () => await user.click(saveButton));

  await waitFor(() => expect(keywordsToggleButton).toHaveFocus());
});

test('should move to keywords page after creating new keyword', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedCreateKeywordSetResponse,
  ]);

  await loadingSpinnerIsNotInDocument();
  await actWait(100);

  const saveButton = await findElement('saveButton');
  await waitFor(() => expect(saveButton).toBeEnabled());

  await fillInputValues();

  await act(async () => await user.click(saveButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/admin/keyword-sets`)
  );
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedInvalidCreateKeywordSetResponse]);

  await loadingSpinnerIsNotInDocument();
  await actWait(100);

  const saveButton = await findElement('saveButton');
  await waitFor(() => expect(saveButton).toBeEnabled());

  await fillInputValues();

  await act(async () => await user.click(saveButton));

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Tämän kentän arvo ei voi olla "null"./i);
});
