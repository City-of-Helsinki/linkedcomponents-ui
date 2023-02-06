import React from 'react';

import { ROUTES } from '../../../../constants';
import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
import stripLanguageFromPath from '../../../../utils/stripLanguageFromPath';
import {
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import {
  image,
  mockedDeleteImageResponse,
} from '../../../image/__mocks__/editImagePage';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import ImageActionsDropdown, {
  ImageActionsDropdownProps,
} from '../ImageActionsDropdown';

const authContextValue = fakeAuthenticatedAuthContextValue();

const mocks = [mockedDeleteImageResponse, mockedUserResponse];

const route = `/fi${ROUTES.IMAGES}`;
const routes = [route];

const props: ImageActionsDropdownProps = { image };

const renderComponent = () =>
  render(<ImageActionsDropdown {...props} />, {
    authContextValue,
    mocks,
    routes,
  });

const getElement = (key: 'deleteButton' | 'editButton' | 'menu' | 'toggle') => {
  switch (key) {
    case 'deleteButton':
      return screen.getByRole('button', { name: /poista kuva/i });
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

  const enabledButtons = [getElement('deleteButton'), getElement('editButton')];
  enabledButtons.forEach((button) => expect(button).toBeEnabled());
});

test('should route to edit image page', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await openMenu();

  const editButton = getElement('editButton');
  await user.click(editButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/administration/images/edit/${image.id}`
    )
  );

  expect(history.location.search).toBe(
    `?returnPath=${encodeURIComponent(stripLanguageFromPath(route))}`
  );
});

test('should delete image', async () => {
  const user = userEvent.setup();
  renderComponent();

  await openMenu();

  const deleteButton = getElement('deleteButton');
  await user.click(deleteButton);

  const withinModal = within(screen.getByRole('dialog'));
  const deleteImageButton = withinModal.getByRole('button', {
    name: /Poista kuva/i,
  });
  await user.click(deleteImageButton);

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
});
