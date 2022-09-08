import React from 'react';

import { ROUTES } from '../../../../constants';
import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
import stripLanguageFromPath from '../../../../utils/stripLanguageFromPath';
import {
  act,
  configure,
  CustomRenderOptions,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import { mockedDeleteOrganizationResponse } from '../../../organization/__mocks__/editOrganizationPage';
import {
  mockedOrganizationResponse,
  organization,
} from '../../../organization/__mocks__/organization';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import OrganizationActionsDropdown, {
  OrganizationActionsDropdownProps,
} from '../OrganizationActionsDropdown';

configure({ defaultHidden: true });

const authContextValue = fakeAuthenticatedAuthContextValue();

const defaultProps: OrganizationActionsDropdownProps = {
  organization,
};

const route = `/fi${ROUTES.KEYWORD_SETS}`;

const defaultMocks = [
  mockedDeleteOrganizationResponse,
  mockedOrganizationResponse,
  mockedUserResponse,
];

const renderComponent = (
  props?: Partial<OrganizationActionsDropdownProps>,
  { authContextValue, mocks = defaultMocks }: CustomRenderOptions = {}
) =>
  render(<OrganizationActionsDropdown {...defaultProps} {...props} />, {
    authContextValue,
    mocks,
    routes: [route],
  });

const findElement = (key: 'deleteButton') => {
  switch (key) {
    case 'deleteButton':
      return screen.findByRole('button', { name: /poista organisaatio/i });
  }
};

const getElement = (key: 'editButton' | 'menu' | 'toggle') => {
  switch (key) {
    case 'editButton':
      return screen.getByRole('button', { name: /muokkaa organisaatiota/i });
    case 'menu':
      return screen.getByRole('region', { name: /valinnat/i });
    case 'toggle':
      return screen.getByRole('button', { name: /valinnat/i });
  }
};

const openMenu = async () => {
  const user = userEvent.setup();
  const toggleButton = getElement('toggle');
  await act(async () => await user.click(toggleButton));
  getElement('menu');

  return toggleButton;
};

test('should toggle menu by clicking actions button', async () => {
  const user = userEvent.setup();
  renderComponent(undefined, { authContextValue });

  const toggleButton = await openMenu();
  getElement('editButton');
  await findElement('deleteButton');

  await act(async () => await user.click(toggleButton));
  expect(
    screen.queryByRole('region', { name: /valinnat/i })
  ).not.toBeInTheDocument();
});

test('should route to edit organization page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await openMenu();

  const editButton = getElement('editButton');
  await act(async () => await user.click(editButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/administration/organizations/edit/${organization.id}`
    )
  );

  expect(history.location.search).toBe(
    `?returnPath=${encodeURIComponent(stripLanguageFromPath(route))}`
  );
});

test('should delete organization', async () => {
  const user = userEvent.setup();
  renderComponent(undefined, { authContextValue });

  await openMenu();

  const deleteButton = await findElement('deleteButton');
  await act(async () => await user.click(deleteButton));

  const withinModal = within(screen.getByRole('dialog'));
  const deleteKeywordButton = withinModal.getByRole('button', {
    name: /Poista organisaatio/i,
  });
  await act(async () => await user.click(deleteKeywordButton));

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
});
