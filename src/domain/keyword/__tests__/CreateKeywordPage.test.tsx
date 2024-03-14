import { MockedResponse } from '@apollo/client/testing';

import getValue from '../../../utils/getValue';
import {
  mockAuthenticatedLoginState,
  mockUnauthenticatedLoginState,
} from '../../../utils/mockLoginHooks';
import {
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  shouldApplyExpectedMetaData,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import { mockedOrganizationResponse } from '../../organization/__mocks__/organization';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  keywordValues,
  mockedCreateKeywordResponse,
  mockedFilteredKeywordsResponse,
  mockedInvalidCreateKeywordResponse,
  mockedKeywordsResponse,
  replacingKeyword,
} from '../__mocks__/createKeyword';
import CreateKeywordPage from '../CreateKeywordPage';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultMocks = [
  mockedKeywordsResponse,
  mockedFilteredKeywordsResponse,
  mockedOrganizationResponse,
  mockedUserResponse,
];

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  render(<CreateKeywordPage />, { mocks });

const getElement = (
  key: 'nameInput' | 'replacedByInput' | 'replacedByToggleButton' | 'saveButton'
) => {
  switch (key) {
    case 'nameInput':
      return screen.getByLabelText(/nimi \(suomeksi\)/i);
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
  await user.type(nameInput, keywordValues.name);

  const replacedByToggleButton = getElement('replacedByToggleButton');
  await user.click(replacedByToggleButton);

  const replacingKeywordOption = await screen.findByRole('option', {
    name: getValue(replacingKeyword?.name?.fi, ''),
    hidden: true,
  });
  await user.click(replacingKeywordOption);
};

test('form should be disabled if user is not authenticated', async () => {
  mockUnauthenticatedLoginState();
  render(<CreateKeywordPage />, { mocks: defaultMocks });

  await loadingSpinnerIsNotInDocument();
  const nameInput = getElement('nameInput');
  expect(nameInput).toHaveAttribute('readOnly');
});

test('applies expected metadata', async () => {
  renderComponent();

  await shouldApplyExpectedMetaData({
    expectedDescription: 'Lisää uusi avainsana Linked Eventsiin.',
    expectedKeywords:
      'lisää, uusi, avainsana, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    expectedTitle: 'Lisää avainsana - Linked Events',
  });
});

test('should focus to first validation error when trying to save new keyword', async () => {
  global.HTMLFormElement.prototype.submit = () => vi.fn();
  const user = userEvent.setup();
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  const nameInput = getElement('nameInput');
  const saveButton = getElement('saveButton');
  await user.click(saveButton);

  await waitFor(() => expect(nameInput).toHaveFocus());
});

test('should move to keywords page after creating new keyword', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedCreateKeywordResponse,
  ]);

  await loadingSpinnerIsNotInDocument();

  await fillInputValues();

  const saveButton = getElement('saveButton');
  await user.click(saveButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/keywords`)
  );
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedInvalidCreateKeywordResponse]);

  await loadingSpinnerIsNotInDocument();

  await fillInputValues();

  const saveButton = getElement('saveButton');
  await user.click(saveButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Tämän kentän arvo ei voi olla "null"./i);
});
