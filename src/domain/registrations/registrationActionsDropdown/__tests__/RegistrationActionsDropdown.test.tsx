import { MockedResponse } from '@apollo/client/testing';
import { AnyAction, Store } from '@reduxjs/toolkit';
import copyToClipboard from 'copy-to-clipboard';
import React from 'react';
import { toast } from 'react-toastify';

import { ROUTES } from '../../../../constants';
import { StoreState } from '../../../../types';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import {
  act,
  configure,
  getMockReduxStore,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import {
  mockedDeleteRegistrationResponse,
  mockedEventResponse,
  registration,
} from '../../../registration/__mocks__/editRegistrationPage';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import RegistrationActionsDropdown, {
  RegistrationActionsDropdownProps,
} from '../RegistrationActionsDropdown';

configure({ defaultHidden: true });
jest.mock('copy-to-clipboard');

const defaultProps: RegistrationActionsDropdownProps = {
  registration: registration,
};

const defaultMocks = [mockedEventResponse, mockedUserResponse];

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const renderComponent = ({
  mocks = defaultMocks,
  props,
  store,
}: {
  mocks?: MockedResponse[];
  props?: Partial<RegistrationActionsDropdownProps>;
  store?: Store<StoreState, AnyAction>;
} = {}) =>
  render(<RegistrationActionsDropdown {...defaultProps} {...props} />, {
    mocks,
    routes: [`/fi${ROUTES.REGISTRATIONS}`],
    store,
  });

const findElement = (key: 'delete' | 'edit' | 'showEnrolments') => {
  switch (key) {
    case 'delete':
      return screen.findByRole('button', { name: 'Poista ilmoittautuminen' });
    case 'edit':
      return screen.findByRole('button', { name: 'Muokkaa' });
    case 'showEnrolments':
      return screen.findByRole('button', { name: /näytä ilmoittautuneet/i });
  }
};

const getElement = (
  key:
    | 'copy'
    | 'copyLink'
    | 'delete'
    | 'edit'
    | 'menu'
    | 'showEnrolments'
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
    case 'menu':
      return screen.getByRole('region', { name: /valinnat/i });
    case 'showEnrolments':
      return screen.getByRole('button', { name: /näytä ilmoittautuneet/i });
    case 'toggle':
      return screen.getByRole('button', { name: /valinnat/i });
  }
};

const titleDisabled = 'Sinulla ei ole oikeuksia muokata ilmoittautumisia.';

const openMenu = async () => {
  const user = userEvent.setup();
  const toggleButton = getElement('toggle');
  await act(async () => await user.click(toggleButton));
  getElement('menu');

  return toggleButton;
};

test('should toggle menu by clicking actions button', async () => {
  const user = userEvent.setup();
  renderComponent({ store });

  const toggleButton = await openMenu();
  await act(async () => await user.click(toggleButton));
  expect(
    screen.queryByRole('region', { name: /valinnat/i })
  ).not.toBeInTheDocument();
});

test('should render correct buttons', async () => {
  renderComponent({ store });

  await openMenu();

  getElement('copy');
  getElement('copyLink');
  await findElement('delete');
  getElement('edit');
  getElement('showEnrolments');
});

test('only copy, copy link and edit buttons should be enabled when user is not logged in', async () => {
  renderComponent();

  await openMenu();

  getElement('copy');
  getElement('copyLink');
  getElement('edit');
  const showEnrolmentsButton = getElement('showEnrolments');
  expect(showEnrolmentsButton.title).toBe(titleDisabled);
  const deleteButton = getElement('delete');
  expect(deleteButton.title).toBe(titleDisabled);
});

test('should route to edit registration page when clicking edit button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await openMenu();

  const editButton = await findElement('edit');
  await act(async () => await user.click(editButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/edit/${registration.id}`
    )
  );
  expect(history.location.search).toBe('?returnPath=%2Fregistrations');
});

test('should route to enrolments page when clicking show enrolments button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent({ store });

  await openMenu();

  const editButton = await findElement('showEnrolments');
  await act(async () => await user.click(editButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registration.id}/enrolments`
    )
  );
  expect(history.location.search).toBe('?returnPath=%2Fregistrations');
});

test('should route to create registration page when clicking copy button', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  await openMenu();

  const copyButton = getElement('copy');
  await act(async () => await user.click(copyButton));

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
  await act(async () => await user.click(copyLinkButton));

  expect(copyToClipboard).toBeCalledWith(
    `https://linkedregistrations-ui.test.kuva.hel.ninja/fi/registration/${registration.id}/enrolment/create`
  );
  expect(toast.success).toBeCalledWith('Ilmoittautumislinkki kopioitu');
});

test('should delete registration', async () => {
  const mocks = [...defaultMocks, mockedDeleteRegistrationResponse];
  const user = userEvent.setup();
  renderComponent({ mocks, store });

  await openMenu();

  const deleteButton = await findElement('delete');
  await act(async () => await user.click(deleteButton));

  const withinModal = within(screen.getByRole('dialog'));
  const deleteRegistrationButton = withinModal.getByRole('button', {
    name: 'Poista ilmoittautuminen',
  });
  await act(async () => await user.click(deleteRegistrationButton));

  await waitFor(
    () => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    { timeout: 10000 }
  );
});
