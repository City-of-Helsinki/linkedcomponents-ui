import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

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
  const user = userEvent.setup();
  await act(async () => await user.click(getElement('adminUsersToggleButton')));
  const userOption = await screen.findByRole('option', {
    name: new RegExp(userNames[0]),
  });
  await act(async () => await user.click(userOption));

  await act(async () => await user.click(getElement('replacedByToggleButton')));
  const organizationOption = await screen.findByRole('option', {
    name: organizations.data[0]?.name as string,
  });
  await act(async () => await user.click(organizationOption));
};

test('should scroll to first validation error input field', async () => {
  const user = userEvent.setup();
  renderComponent();

  const nameInput = await findElement('nameInput');
  await act(async () => await user.clear(nameInput));
  const saveButton = await findElement('saveButton');
  await act(async () => await user.click(saveButton));

  await waitFor(() => expect(nameInput).toHaveFocus());
});

test('should delete organization', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedDeleteOrganizationResponse,
  ]);

  const deleteButton = await findElement('deleteButton');
  await act(async () => await user.click(deleteButton));

  const withinModal = within(
    screen.getByRole('dialog', { name: 'Varmista organisaation poistaminen' })
  );
  const deleteOrganizationButton = withinModal.getByRole('button', {
    name: 'Poista organisaatio',
  });
  await act(async () => await user.click(deleteOrganizationButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/organizations`)
  );
});

test('should update organization', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedUpdateOrganizationResponse,
  ]);

  const submitButton = await findElement('saveButton');

  await fillFormValues();

  await act(async () => await user.click(submitButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/organizations`)
  );
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedInvalidUpdateOrganizationResponse]);

  const submitButton = await findElement('saveButton');

  await fillFormValues();

  await act(async () => await user.click(submitButton));

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Nimi on pakollinen./i);
});
