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
import {
  keywordSet,
  mockedDeleteKeywordSetResponse,
} from '../../../keywordSet/__mocks__/editKeywordSetPage';
import { mockedOrganizationResponse } from '../../../organization/__mocks__/organization';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import KeywordSetActionsDropdown, {
  KeywordSetActionsDropdownProps,
} from '../KeywordSetActionsDropdown';

configure({ defaultHidden: true });

const authContextValue = fakeAuthenticatedAuthContextValue();

const defaultProps: KeywordSetActionsDropdownProps = { keywordSet };

const route = `/fi${ROUTES.KEYWORD_SETS}`;

const defaultMocks = [
  mockedDeleteKeywordSetResponse,
  mockedOrganizationResponse,
  mockedUserResponse,
];

const renderComponent = (
  props?: Partial<KeywordSetActionsDropdownProps>,
  { authContextValue, mocks = defaultMocks }: CustomRenderOptions = {}
) =>
  render(<KeywordSetActionsDropdown {...defaultProps} {...props} />, {
    authContextValue,
    mocks,
    routes: [route],
  });

const findElement = (key: 'deleteButton') => {
  switch (key) {
    case 'deleteButton':
      return screen.findByRole('button', { name: /poista avainsanaryhmä/i });
  }
};

const getElement = (key: 'editButton' | 'menu' | 'toggle') => {
  switch (key) {
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

test('should route to edit keyword set page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await openMenu();

  const editButton = getElement('editButton');
  await act(async () => await user.click(editButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/administration/keyword-sets/edit/${keywordSet.id}`
    )
  );

  expect(history.location.search).toBe(
    `?returnPath=${encodeURIComponent(stripLanguageFromPath(route))}`
  );
});

test('should delete keyword set', async () => {
  const user = userEvent.setup();
  renderComponent(undefined, { authContextValue });

  await openMenu();

  const deleteButton = await findElement('deleteButton');
  await act(async () => await user.click(deleteButton));

  const dialog = await screen.findByRole('dialog');
  const withinModal = within(dialog);
  const deleteKeywordButton = withinModal.getByRole('button', {
    name: /Poista avainsanaryhmä/i,
  });
  await act(async () => await user.click(deleteKeywordButton));

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
});
