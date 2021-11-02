import { MockedResponse } from '@apollo/client/testing';
import { AnyAction, Store } from '@reduxjs/toolkit';
import React from 'react';

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
  registration,
} from '../../../registration/__mocks__/editRegistrationPage';
import { mockedUserResponse } from '../../__mocks__/registrationsPage';
import ActionsDropdown, { ActionsDropdownProps } from '../ActionsDropdown';

configure({ defaultHidden: true });

const defaultProps: ActionsDropdownProps = {
  registration: registration,
};

const defaultMocks = [mockedUserResponse];

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const renderComponent = ({
  mocks = defaultMocks,
  props,
  store,
}: {
  mocks?: MockedResponse[];
  props?: Partial<ActionsDropdownProps>;
  store?: Store<StoreState, AnyAction>;
} = {}) =>
  render(<ActionsDropdown {...defaultProps} {...props} />, {
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
  key: 'copy' | 'delete' | 'edit' | 'menu' | 'showEnrolments' | 'toggle'
) => {
  switch (key) {
    case 'copy':
      return screen.getByRole('button', { name: 'Kopioi pohjaksi' });
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

const openMenu = () => {
  const toggleButton = getElement('toggle');
  userEvent.click(toggleButton);
  getElement('menu');

  return toggleButton;
};

test('should toggle menu by clicking actions button', () => {
  renderComponent({ store });

  const toggleButton = openMenu();
  userEvent.click(toggleButton);
  expect(
    screen.queryByRole('region', { name: /valinnat/i })
  ).not.toBeInTheDocument();
});

test('should render correct buttons', async () => {
  renderComponent({ store });

  openMenu();

  getElement('copy');
  await findElement('delete');
  getElement('edit');
  getElement('showEnrolments');
});

test('should route to edit registration page when clicking edit button', async () => {
  const { history } = renderComponent();

  openMenu();

  const editButton = await findElement('edit');
  act(() => userEvent.click(editButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/edit/${registration.id}`
    )
  );
  expect(history.location.search).toBe('?returnPath=%2Fregistrations');
});

test('should route to enrolments page when clicking show enrolments button', async () => {
  const { history } = renderComponent();

  openMenu();

  const editButton = await findElement('showEnrolments');
  act(() => userEvent.click(editButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registration.id}/enrolments`
    )
  );
  expect(history.location.search).toBe('?returnPath=%2Fregistrations');
});

test('should route to create registration page when clicking copy button', async () => {
  const { history } = renderComponent();

  openMenu();

  const copyButton = getElement('copy');
  act(() => userEvent.click(copyButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/registrations/create`)
  );
});

test('should delete registration', async () => {
  const mocks = [...defaultMocks, mockedDeleteRegistrationResponse];
  const { history } = renderComponent({ mocks });

  openMenu();

  const deleteButton = getElement('delete');
  act(() => userEvent.click(deleteButton));

  const withinModal = within(screen.getByRole('dialog'));
  const deleteRegistrationButton = withinModal.getByRole('button', {
    name: 'Poista ilmoittautuminen',
  });
  userEvent.click(deleteRegistrationButton);

  await waitFor(
    () => expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    { timeout: 10000 }
  );
});
