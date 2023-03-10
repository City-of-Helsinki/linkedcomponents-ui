import React from 'react';

import { ROUTES } from '../../../../constants';
import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
import stripLanguageFromPath from '../../../../utils/stripLanguageFromPath';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import {
  keyword,
  mockedDeleteKeywordResponse,
} from '../../../keyword/__mocks__/editKeywordPage';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import KeywordActionsDropdown, {
  KeywordActionsDropdownProps,
} from '../KeywordActionsDropdown';

configure({ defaultHidden: true });

const authContextValue = fakeAuthenticatedAuthContextValue();

const mocks = [
  mockedDeleteKeywordResponse,
  mockedOrganizationAncestorsResponse,
  mockedUserResponse,
];

const route = `/fi${ROUTES.KEYWORDS}`;
const routes = [route];

const defaultProps: KeywordActionsDropdownProps = {
  keyword,
};

const renderComponent = (props?: Partial<KeywordActionsDropdownProps>) =>
  render(<KeywordActionsDropdown {...defaultProps} {...props} />, {
    authContextValue,
    mocks,
    routes,
  });

const findElement = (key: 'deleteButton') => {
  switch (key) {
    case 'deleteButton':
      return screen.findByRole('button', { name: /poista avainsana/i });
  }
};

const getElement = (key: 'deleteButton' | 'editButton' | 'menu' | 'toggle') => {
  switch (key) {
    case 'deleteButton':
      return screen.getByRole('button', { name: /poista avainsana/i });
    case 'editButton':
      return screen.getByRole('button', { name: /muokkaa/i });
    case 'menu':
      return screen.getByRole('region', { name: /valinnat/i });
    case 'toggle':
      return screen.getByRole('button', { name: /valinnat/i });
  }
};

const openMenu = async () => {
  const user = userEvent.setup();
  const toggleButton = getElement('toggle');
  await user.click(toggleButton);
  getElement('menu');

  return toggleButton;
};

test('should toggle menu by clicking actions button', async () => {
  const user = userEvent.setup();
  renderComponent();

  const toggleButton = await openMenu();
  await user.click(toggleButton);
  expect(
    screen.queryByRole('region', { name: /valinnat/i })
  ).not.toBeInTheDocument();
});

test('should render correct buttons', async () => {
  renderComponent();

  await openMenu();

  getElement('editButton');
  await findElement('deleteButton');
});

test('should route to edit keyword page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await openMenu();

  const editButton = getElement('editButton');
  await user.click(editButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/administration/keywords/edit/${keyword.id}`
    )
  );

  expect(history.location.search).toBe(
    `?returnPath=${encodeURIComponent(stripLanguageFromPath(route))}`
  );
});

test('should delete keyword', async () => {
  const user = userEvent.setup();
  renderComponent();

  await openMenu();

  const deleteButton = await findElement('deleteButton');
  await user.click(deleteButton);

  const withinModal = within(screen.getByRole('dialog'));
  const deleteKeywordButton = withinModal.getByRole('button', {
    name: /Poista avainsana/i,
  });
  await user.click(deleteKeywordButton);

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
});
