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

const renderComponent = (mocks: MockedResponse[] = []) =>
  render(<CreateKeywordSetPage />, { mocks, store });

const getElement = (
  key: 'keywordsToggleButton' | 'nameInput' | 'saveButton' | 'usageToggleButton'
) => {
  switch (key) {
    case 'keywordsToggleButton':
      return screen.getByRole('button', { name: /avainsanat/i });
    case 'nameInput':
      return screen.getByRole('textbox', { name: /nimi \(suomeksi\)/i });
    case 'saveButton':
      return screen.getByRole('button', { name: /tallenna/i });
    case 'usageToggleButton':
      return screen.getByRole('button', { name: /käyttötarkoitus/i });
  }
};

const fillInputValues = async () => {
  userEvent.type(getElement('nameInput'), keywordSetValues.name);

  userEvent.click(getElement('keywordsToggleButton'));
  const keywordsOption = await screen.findByRole('option', {
    name: keywordSetValues.keyword.name.fi,
  });
  userEvent.click(keywordsOption);

  act(() => userEvent.click(getElement('usageToggleButton')));
  const usageOption = await screen.findByRole('option', { name: 'Yleinen' });
  act(() => userEvent.click(usageOption));
};

test('should focus to first validation error when trying to save new registration', async () => {
  renderComponent([mockedUserResponse]);

  await loadingSpinnerIsNotInDocument();

  const nameInput = getElement('nameInput');
  userEvent.click(getElement('saveButton'));

  await waitFor(() => expect(nameInput).toHaveFocus());

  userEvent.type(getElement('nameInput'), keywordSetValues.name);
  const keywordsToggleButton = getElement('keywordsToggleButton');
  userEvent.click(getElement('saveButton'));

  await waitFor(() => expect(keywordsToggleButton).toHaveFocus());
});

test('should move to keywords page after creating new keyword', async () => {
  const { history } = renderComponent([
    mockedCreateKeywordSetResponse,
    mockedKeywordsResponse,
    mockedUserResponse,
  ]);

  await loadingSpinnerIsNotInDocument();

  await fillInputValues();

  userEvent.click(getElement('saveButton'));

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/admin/keyword-sets`)
  );
});

test('should show server errors', async () => {
  renderComponent([
    mockedInvalidCreateKeywordSetResponse,
    mockedKeywordsResponse,
    mockedUserResponse,
  ]);

  await loadingSpinnerIsNotInDocument();

  await fillInputValues();

  const saveButton = getElement('saveButton');
  userEvent.click(saveButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Tämän kentän arvo ei voi olla "null"./i);
});
