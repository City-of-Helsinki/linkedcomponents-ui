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
  keywordValues,
  mockedCreateKeywordResponse,
  mockedInvalidCreateKeywordResponse,
  mockedKeywordsResponse,
  replacingKeyword,
} from '../__mocks__/createKeyword';
import CreateKeywordPage from '../CreateKeywordPage';

configure({ defaultHidden: true });

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const renderComponent = (mocks: MockedResponse[] = []) =>
  render(<CreateKeywordPage />, { mocks, store });

const getElement = (
  key: 'nameInput' | 'replacedByInput' | 'replacedByToggleButton' | 'saveButton'
) => {
  switch (key) {
    case 'nameInput':
      return screen.getByRole('textbox', { name: /nimi \(suomeksi\)/i });
    case 'replacedByInput':
      return screen.getByRole('combobox', { name: /korvaus/i });
    case 'replacedByToggleButton':
      return screen.getByRole('button', { name: /korvaus: valikko/i });
    case 'saveButton':
      return screen.getByRole('button', { name: /tallenna/i });
  }
};

const fillInputValues = async () => {
  const user = userEvent.setup();
  const nameInput = getElement('nameInput');
  await act(async () => await user.type(nameInput, keywordValues.name));

  const replacedByToggleButton = getElement('replacedByToggleButton');
  await act(async () => await user.click(replacedByToggleButton));

  const replacingKeywordOption = await screen.findByRole('option', {
    name: replacingKeyword.name.fi,
    hidden: true,
  });
  await act(async () => await user.click(replacingKeywordOption));
};

test('should focus to first validation error when trying to save new keyword', async () => {
  global.HTMLFormElement.prototype.submit = () => jest.fn();
  const user = userEvent.setup();
  renderComponent([mockedUserResponse]);

  await loadingSpinnerIsNotInDocument();

  const nameInput = getElement('nameInput');
  const saveButton = getElement('saveButton');
  await act(async () => await user.click(saveButton));

  await waitFor(() => expect(nameInput).toHaveFocus());
});

test('should move to keywords page after creating new keyword', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    mockedCreateKeywordResponse,
    mockedKeywordsResponse,
    mockedUserResponse,
  ]);

  await loadingSpinnerIsNotInDocument();

  await fillInputValues();

  const saveButton = getElement('saveButton');
  await act(async () => await user.click(saveButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/admin/keywords`)
  );
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  renderComponent([
    mockedInvalidCreateKeywordResponse,
    mockedKeywordsResponse,
    mockedUserResponse,
  ]);

  await loadingSpinnerIsNotInDocument();

  await fillInputValues();

  const saveButton = getElement('saveButton');
  await act(async () => await user.click(saveButton));

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Tämän kentän arvo ei voi olla "null"./i);
});
