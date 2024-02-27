import { MockedResponse } from '@apollo/client/testing';

import {
  mockedKeywordResponse,
  mockedKeywordsResponse,
} from '../../../common/components/keywordSelector/__mocks__/keywordSelector';
import { ROUTES } from '../../../constants';
import getValue from '../../../utils/getValue';
import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  loadingSpinnerIsNotInDocument,
  renderWithRoute,
  screen,
  shouldDeleteInstance,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import { mockedKeywordSetsResponse } from '../../keywordSets/__mocks__/keywordSetsPage';
import { mockedOrganizationResponse } from '../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
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

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultMocks = [
  mockedKeywordSetResponse,
  mockedKeywordSetsResponse,
  mockedKeywordResponse,
  mockedKeywordsResponse,
  mockedOrganizationResponse,
  mockedOrganizationAncestorsResponse,
  mockedUserResponse,
];

const route = ROUTES.EDIT_KEYWORD_SET.replace(
  ':id',
  getValue(keywordSet.id, '')
);

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  renderWithRoute(<EditKeywordSetPage />, {
    mocks,
    routes: [route],
    path: ROUTES.EDIT_KEYWORD_SET,
  });

const findElement = (key: 'deleteButton' | 'nameInput' | 'saveButton') => {
  switch (key) {
    case 'deleteButton':
      return screen.findByRole('button', { name: /poista avainsanaryhmä/i });
    case 'nameInput':
      return screen.findByLabelText(/nimi \(suomeksi\)/i);
    case 'saveButton':
      return screen.findByRole('button', { name: /tallenna/i });
  }
};

test('should scroll to first validation error input field', async () => {
  const user = userEvent.setup();
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  const nameInput = await findElement('nameInput');
  const saveButton = await findElement('saveButton');
  await waitFor(() => expect(saveButton).toBeEnabled());

  await user.clear(nameInput);
  await user.click(saveButton);

  await waitFor(() => expect(nameInput).toHaveFocus());
});

test('should delete keyword', async () => {
  const { history } = renderComponent([
    ...defaultMocks,
    mockedDeleteKeywordSetResponse,
  ]);

  await shouldDeleteInstance({
    confirmDeleteButtonLabel: 'Poista avainsanaryhmä',
    deleteButtonLabel: 'Poista avainsanaryhmä',
    expectedNotificationText: 'Avainsanaryhmä on poistettu',
    expectedUrl: '/fi/administration/keyword-sets',
    history,
  });
});

test('should update keyword set', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedUpdateKeywordSetResponse,
  ]);

  await loadingSpinnerIsNotInDocument();

  const saveButton = await findElement('saveButton');
  await waitFor(() => expect(saveButton).toBeEnabled());

  await user.click(saveButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/keyword-sets`)
  );
  await screen.findByRole('alert', { name: 'Avainsanaryhmä on tallennettu' });
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedInvalidUpdateKeywordSetResponse]);

  await loadingSpinnerIsNotInDocument();

  const saveButton = await findElement('saveButton');
  await waitFor(() => expect(saveButton).toBeEnabled());

  await user.click(saveButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Nimi on pakollinen./i);
});
