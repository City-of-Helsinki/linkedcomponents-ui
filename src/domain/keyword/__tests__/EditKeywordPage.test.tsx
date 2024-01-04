import { MockedResponse } from '@apollo/client/testing';

import { ROUTES } from '../../../constants';
import getValue from '../../../utils/getValue';
import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  renderWithRoute,
  screen,
  userEvent,
  waitFor,
  within,
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

const getElement = (key: 'saveButton') => {
  switch (key) {
    case 'saveButton':
      return screen.getByRole('button', { name: /tallenna/i });
  }
};

test('should scroll to first validation error input field', async () => {
  const user = userEvent.setup();
  renderComponent();

  const nameInput = await findElement('nameInput');
  await user.clear(nameInput);
  const saveButton = getElement('saveButton');
  await user.click(saveButton);

  await waitFor(() => expect(nameInput).toHaveFocus());
});

test('should delete keyword', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedDeleteKeywordResponse,
  ]);

  const deleteButton = await findElement('deleteButton');
  await user.click(deleteButton);

  const withinModal = within(screen.getByRole('dialog'));
  const deleteKeywordButton = withinModal.getByRole('button', {
    name: 'Poista avainsana',
  });
  await user.click(deleteKeywordButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/keywords`)
  );
  await screen.findByRole('alert', { name: 'Avainsana on poistettu' });
});

test('should update keyword', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedUpdateKeywordResponse,
  ]);

  await findElement('nameInput');

  const submitButton = getElement('saveButton');
  await user.click(submitButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/keywords`)
  );
  await screen.findByRole('alert', { name: 'Avainsana on tallennettu' });
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedInvalidUpdateKeywordResponse]);

  await findElement('nameInput');

  const submitButton = getElement('saveButton');
  await user.click(submitButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Nimi on pakollinen./i);
});
