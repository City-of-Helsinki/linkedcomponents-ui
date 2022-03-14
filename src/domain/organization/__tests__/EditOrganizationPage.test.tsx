import { MockedResponse } from '@apollo/client/testing';

import { ROUTES } from '../../../constants';
import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  act,
  configure,
  getMockReduxStore,
  renderWithRoute,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../utils/testUtils';
import {
  mockedOrganizationResponse,
  organizationId,
} from '../../organization/__mocks__/organization';
import {
  mockedOrganizationsResponse,
  organizations,
} from '../../organizations/__mocks__/organizationsPage';
import {
  mockedUserResponse,
  mockedUsersResponse,
  userNames,
} from '../../user/__mocks__/user';
import {
  mockedDeleteOrganizationResponse,
  mockedInvalidUpdateOrganizationResponse,
  mockedUpdateOrganizationResponse,
} from '../__mocks__/editOrganizationPage';
import EditOrganizationPage from '../EditOrganizationPage';

configure({ defaultHidden: true });

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const defaultMocks = [
  mockedOrganizationResponse,
  mockedOrganizationsResponse,
  mockedUserResponse,
  mockedUsersResponse,
];

const route = ROUTES.EDIT_ORGANIZATION.replace(':id', organizationId);

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  renderWithRoute(<EditOrganizationPage />, {
    mocks,
    routes: [route],
    path: ROUTES.EDIT_ORGANIZATION,
    store,
  });

const findElement = (key: 'deleteButton' | 'nameInput' | 'saveButton') => {
  switch (key) {
    case 'deleteButton':
      return screen.findByRole('button', { name: /poista organisaatio/i });
    case 'nameInput':
      return screen.findByRole('textbox', { name: /nimi/i });
    case 'saveButton':
      return screen.findByRole('button', { name: /tallenna/i });
  }
};

const getElement = (
  key: 'adminUsersToggleButton' | 'replacedByToggleButton'
) => {
  switch (key) {
    case 'adminUsersToggleButton':
      return screen.getByRole('button', { name: /pääkäyttäjät/i });
    case 'replacedByToggleButton':
      return screen.getByRole('button', { name: /Korvaava organisaatio/i });
  }
};

const fillFormValues = async () => {
  act(() => userEvent.click(getElement('adminUsersToggleButton')));
  const userOption = await screen.findByRole('option', {
    name: new RegExp(userNames[0]),
  });
  act(() => userEvent.click(userOption));

  act(() => userEvent.click(getElement('replacedByToggleButton')));
  const organizationOption = await screen.findByRole('option', {
    name: organizations.data[0].name,
  });
  act(() => userEvent.click(organizationOption));
};

test('should scroll to first validation error input field', async () => {
  renderComponent();

  const nameInput = await findElement('nameInput');
  userEvent.clear(nameInput);
  const saveButton = await findElement('saveButton');
  userEvent.click(saveButton);

  await waitFor(() => expect(nameInput).toHaveFocus());
});

test('should delete organization', async () => {
  const { history } = renderComponent([
    ...defaultMocks,
    mockedDeleteOrganizationResponse,
  ]);

  const deleteButton = await findElement('deleteButton');
  act(() => userEvent.click(deleteButton));

  const withinModal = within(screen.getByRole('dialog'));
  const deleteOrganizationButton = withinModal.getByRole('button', {
    name: 'Poista organisaatio',
  });
  userEvent.click(deleteOrganizationButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/admin/organizations`)
  );
});

test('should update organization', async () => {
  const { history } = renderComponent([
    ...defaultMocks,
    mockedUpdateOrganizationResponse,
  ]);

  const submitButton = await findElement('saveButton');

  await fillFormValues();

  act(() => userEvent.click(submitButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/admin/organizations`)
  );
});

test('should show server errors', async () => {
  renderComponent([...defaultMocks, mockedInvalidUpdateOrganizationResponse]);

  const submitButton = await findElement('saveButton');

  await fillFormValues();

  act(() => userEvent.click(submitButton));

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Nimi on pakollinen./i);
});
