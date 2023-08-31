import copyToClipboard from 'copy-to-clipboard';
import React from 'react';
import { toast } from 'react-toastify';

import { ROUTES } from '../../../../constants';
import {
  fakeAuthContextValue,
  fakeAuthenticatedAuthContextValue,
} from '../../../../utils/mockAuthContextValue';
import {
  configure,
  CustomRenderOptions,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import {
  mockedDeleteRegistrationResponse,
  registration,
} from '../../../registration/__mocks__/editRegistrationPage';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import RegistrationActionsDropdown, {
  RegistrationActionsDropdownProps,
} from '../RegistrationActionsDropdown';

configure({ defaultHidden: true });
jest.mock('copy-to-clipboard');

const defaultProps: RegistrationActionsDropdownProps = {
  registration,
};

const authContextValue = fakeAuthenticatedAuthContextValue();

const defaultMocks = [mockedOrganizationAncestorsResponse, mockedUserResponse];

const routes = [`/fi${ROUTES.REGISTRATIONS}`];

const renderComponent = ({
  mocks = defaultMocks,
  ...restRenderOptions
}: CustomRenderOptions = {}) =>
  render(<RegistrationActionsDropdown {...defaultProps} />, {
    authContextValue,
    mocks,
    routes,
    ...restRenderOptions,
  });

const findElement = (key: 'delete' | 'edit' | 'showSignups') => {
  switch (key) {
    case 'delete':
      return screen.findByRole('button', { name: 'Poista ilmoittautuminen' });
    case 'edit':
      return screen.findByRole('button', { name: 'Muokkaa' });
    case 'showSignups':
      return screen.findByRole('button', { name: /näytä ilmoittautuneet/i });
  }
};

const getElement = (
  key:
    | 'copy'
    | 'copyLink'
    | 'delete'
    | 'edit'
    | 'markPresent'
    | 'menu'
    | 'showSignups'
    | 'toggle'
) => {
  switch (key) {
    case 'copy':
      return screen.getByRole('button', { name: 'Kopioi pohjaksi' });
    case 'copyLink':
      return screen.getByRole('button', { name: 'Kopioi linkki' });
    case 'delete':
      return screen.getByRole('button', { name: 'Poista ilmoittautuminen' });
    case 'edit':
      return screen.getByRole('button', { name: 'Muokkaa' });
    case 'markPresent':
      return screen.getByRole('button', { name: 'Merkkaa läsnäolijat' });
    case 'menu':
      return screen.getByRole('region', { name: /valinnat/i });
    case 'showSignups':
      return screen.getByRole('button', { name: /näytä ilmoittautuneet/i });
    case 'toggle':
      return screen.getByRole('button', { name: /valinnat/i });
  }
};

const titleDisabled = 'Sinulla ei ole oikeuksia muokata ilmoittautumisia.';

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

  getElement('copy');
  getElement('copyLink');
  await findElement('delete');
  getElement('edit');
  getElement('showSignups');
});

test('only copy, copy link and edit buttons should be enabled when user is not logged in', async () => {
  const authContextValue = fakeAuthContextValue();
  renderComponent({ authContextValue });

  await openMenu();

  getElement('copy');
  getElement('copyLink');
  getElement('edit');
  const showSignupsButton = getElement('showSignups');
  expect(showSignupsButton.title).toBe(titleDisabled);
  const deleteButton = getElement('delete');
  expect(deleteButton.title).toBe(titleDisabled);
});

test('should route to edit registration page when clicking edit button', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent();

  await openMenu();

  const editButton = await findElement('edit');
  await user.click(editButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/edit/${registration.id}`
    )
  );
  expect(history.location.search).toBe('?returnPath=%2Fregistrations');
});

test('should route to signups page when clicking show signups button', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent();

  await openMenu();

  const editButton = await findElement('showSignups');
  await user.click(editButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registration.id}/signups`
    )
  );
  expect(history.location.search).toBe('?returnPath=%2Fregistrations');
});

test('should route to attendance list page when clicking mark present button', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent();

  await openMenu();

  const markPresentButton = await getElement('markPresent');
  await user.click(markPresentButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registration.id}/attendance-list`
    )
  );
  expect(history.location.search).toBe('?returnPath=%2Fregistrations');
});

test('should route to create registration page when clicking copy button', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent();

  await openMenu();

  const copyButton = getElement('copy');
  await user.click(copyButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/registrations/create`)
  );
});

test('should copy registration link to clipboard', async () => {
  toast.success = jest.fn();
  const user = userEvent.setup();

  renderComponent();

  await openMenu();

  const copyLinkButton = getElement('copyLink');
  await user.click(copyLinkButton);

  expect(copyToClipboard).toBeCalled();
  expect(toast.success).toBeCalledWith('Ilmoittautumislinkki kopioitu');
});

test('should delete registration', async () => {
  const user = userEvent.setup();

  const mocks = [...defaultMocks, mockedDeleteRegistrationResponse];
  renderComponent({ mocks });

  await openMenu();

  const deleteButton = await findElement('delete');
  await user.click(deleteButton);

  const withinModal = within(screen.getByRole('dialog'));
  const deleteRegistrationButton = withinModal.getByRole('button', {
    name: 'Poista ilmoittautuminen',
  });
  await user.click(deleteRegistrationButton);

  await waitFor(
    () => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    { timeout: 10000 }
  );
});
