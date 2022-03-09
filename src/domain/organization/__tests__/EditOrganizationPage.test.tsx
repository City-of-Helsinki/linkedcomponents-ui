import { MockedResponse } from '@apollo/client/testing';
import { toast } from 'react-toastify';

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

test('should scroll to first validation error input field', async () => {
  renderComponent();

  const nameInput = await findElement('nameInput');
  userEvent.clear(nameInput);
  const saveButton = await findElement('saveButton');
  userEvent.click(saveButton);

  await waitFor(() => expect(nameInput).toHaveFocus());
});

test('should call toast error when trying to delete organization', async () => {
  toast.error = jest.fn();
  renderComponent();

  const deleteButton = await findElement('deleteButton');
  act(() => userEvent.click(deleteButton));

  expect(toast.error).toBeCalledWith('TODO: Delete organization');
});

test('should call toast error when trying to update organization', async () => {
  toast.error = jest.fn();
  renderComponent();
  const submitButton = await findElement('saveButton');

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

  act(() => userEvent.click(submitButton));

  await waitFor(() =>
    expect(toast.error).toBeCalledWith('TODO: Handle saving organization')
  );
});
