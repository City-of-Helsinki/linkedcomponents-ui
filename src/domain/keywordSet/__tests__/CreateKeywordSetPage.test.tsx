import { MockedResponse } from '@apollo/client/testing';

import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  act,
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
  userEvent.type(getElement('originIdInput'), keywordSetValues.originId);
  userEvent.type(getElement('nameInput'), keywordSetValues.name);

  userEvent.click(getElement('keywordsToggleButton'));
  const keywordsOption = await screen.findByRole(
    'option',
    { name: keywordSetValues.keyword.name.fi },
    { timeout: 10000 }
  );
  userEvent.click(keywordsOption);

  act(() => userEvent.click(getElement('usageToggleButton')));
  const usageOption = await screen.findByRole(
    'option',
    { name: 'Yleinen' },
    { timeout: 10000 }
  );
  act(() => userEvent.click(usageOption));
};

test('should focus to first validation error when trying to save new keyword set', async () => {
  renderComponent(defaultMocks);

  await loadingSpinnerIsNotInDocument();

  const saveButton = await findElement('saveButton');

  const originIdInput = getElement('originIdInput');
  userEvent.click(saveButton);
  await waitFor(() => expect(originIdInput).toHaveFocus());
  userEvent.type(originIdInput, keywordSetValues.originId);

  const nameInput = getElement('nameInput');
  userEvent.click(saveButton);
  await waitFor(() => expect(nameInput).toHaveFocus());
  userEvent.type(nameInput, keywordSetValues.name);

  const keywordsToggleButton = getElement('keywordsToggleButton');
  userEvent.click(saveButton);

  await waitFor(() => expect(keywordsToggleButton).toHaveFocus());
});

test('should move to keywords page after creating new keyword', async () => {
  const { history } = renderComponent([
    ...defaultMocks,
    mockedCreateKeywordSetResponse,
  ]);

  await loadingSpinnerIsNotInDocument();

  await fillInputValues();

  userEvent.click(getElement('saveButton'));

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/admin/keyword-sets`)
  );
});

test('should show server errors', async () => {
  renderComponent([...defaultMocks, mockedInvalidCreateKeywordSetResponse]);

  await loadingSpinnerIsNotInDocument();

  await fillInputValues();

  const saveButton = getElement('saveButton');
  userEvent.click(saveButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Tämän kentän arvo ei voi olla "null"./i);
});
