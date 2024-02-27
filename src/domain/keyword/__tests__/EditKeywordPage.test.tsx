import { MockedResponse } from '@apollo/client/testing';

import { ROUTES } from '../../../constants';
import getValue from '../../../utils/getValue';
import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  renderWithRoute,
  screen,
  shouldDeleteInstance,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import { mockedOrganizationResponse } from '../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  keyword,
  mockedDeleteKeywordResponse,
  mockedInvalidUpdateKeywordResponse,
  mockedKeywordResponse,
  mockedKeywordsResponse,
  mockedUpdateKeywordResponse,
} from '../__mocks__/editKeywordPage';
import EditKeywordPage from '../EditKeywordPage';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultMocks = [
  mockedKeywordResponse,
  mockedKeywordsResponse,
  mockedOrganizationResponse,
  mockedOrganizationAncestorsResponse,
  mockedUserResponse,
];

const route = ROUTES.EDIT_KEYWORD.replace(':id', getValue(keyword.id, ''));

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  renderWithRoute(<EditKeywordPage />, {
    mocks,
    routes: [route],
    path: ROUTES.EDIT_KEYWORD,
  });

const findElement = (key: 'deleteButton' | 'nameInput') => {
  switch (key) {
    case 'deleteButton':
      return screen.findByRole('button', { name: /poista avainsana/i });
    case 'nameInput':
      return screen.findByLabelText(/nimi \(suomeksi\)/i);
  }
};

const getSaveButton = () => screen.getByRole('button', { name: /tallenna/i });

test('should scroll to first validation error input field', async () => {
  const user = userEvent.setup();
  renderComponent();

  const nameInput = await findElement('nameInput');
  await user.clear(nameInput);
  const saveButton = getSaveButton();
  await user.click(saveButton);

  await waitFor(() => expect(nameInput).toHaveFocus());
});

test('should delete keyword', async () => {
  const { history } = renderComponent([
    ...defaultMocks,
    mockedDeleteKeywordResponse,
  ]);

  await shouldDeleteInstance({
    confirmDeleteButtonLabel: 'Poista avainsana',
    deleteButtonLabel: 'Poista avainsana',
    expectedNotificationText: 'Avainsana on poistettu',
    expectedUrl: '/fi/administration/keywords',
    history,
  });
});

test('should update keyword', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedUpdateKeywordResponse,
  ]);

  await findElement('nameInput');

  const saveButton = getSaveButton();
  await user.click(saveButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/keywords`)
  );
  await screen.findByRole('alert', { name: 'Avainsana on tallennettu' });
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedInvalidUpdateKeywordResponse]);

  await findElement('nameInput');

  const saveButton = getSaveButton();
  await user.click(saveButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Nimi on pakollinen./i);
});
