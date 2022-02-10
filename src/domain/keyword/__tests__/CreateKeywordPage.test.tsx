import { MockedResponse } from '@apollo/client/testing';

import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
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
  const nameInput = getElement('nameInput');
  userEvent.type(nameInput, keywordValues.name);

  const replacedByToggleButton = getElement('replacedByToggleButton');
  userEvent.click(replacedByToggleButton);
  const replacingKeywordOption = await screen.findByRole('option', {
    name: replacingKeyword.name.fi,
    hidden: true,
  });
  userEvent.click(replacingKeywordOption);
};

test('should focus to first validation error when trying to save new registration', async () => {
  global.HTMLFormElement.prototype.submit = () => jest.fn();
  renderComponent([mockedUserResponse]);

  await loadingSpinnerIsNotInDocument();

  const nameInput = getElement('nameInput');
  const saveButton = getElement('saveButton');
  userEvent.click(saveButton);

  await waitFor(() => expect(nameInput).toHaveFocus());
});

test('should move to keywords page after creating new keyword', async () => {
  const { history } = renderComponent([
    mockedCreateKeywordResponse,
    mockedKeywordsResponse,
    mockedUserResponse,
  ]);

  await loadingSpinnerIsNotInDocument();

  await fillInputValues();

  const saveButton = getElement('saveButton');
  userEvent.click(saveButton);

  await waitFor(() => expect(history.location.pathname).toBe(`/fi/keywords`));
});

test('should show server errors', async () => {
  renderComponent([
    mockedInvalidCreateKeywordResponse,
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
