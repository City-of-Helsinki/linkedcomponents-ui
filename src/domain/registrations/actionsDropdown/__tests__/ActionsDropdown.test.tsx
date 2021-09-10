import { MockedResponse } from '@apollo/client/testing';
import { AnyAction, Store } from '@reduxjs/toolkit';
import React from 'react';

import { ROUTES } from '../../../../constants';
import { StoreState } from '../../../../types';
import { fakeRegistration } from '../../../../utils/mockDataUtils';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import {
  act,
  configure,
  getMockReduxStore,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { mockedUserResponse } from '../../__mocks__/registrationsPage';
import ActionsDropdown, { ActionsDropdownProps } from '../ActionsDropdown';

configure({ defaultHidden: true });

const registration = fakeRegistration();

const defaultProps: ActionsDropdownProps = {
  registration,
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

const findElement = (key: 'delete' | 'edit' | 'showParticipants') => {
  switch (key) {
    case 'delete':
      return screen.findByRole('button', { name: 'Poista ilmoittautuminen' });
    case 'edit':
      return screen.findByRole('button', { name: 'Muokkaa' });
    case 'showParticipants':
      return screen.findByRole('button', { name: /näytä ilmoittautuneet/i });
  }
};

const getElement = (
  key: 'copy' | 'delete' | 'edit' | 'menu' | 'showParticipants' | 'toggle'
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
    case 'showParticipants':
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
  getElement('showParticipants');
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

test('should route to participants page when clicking show participants button', async () => {
  const { history } = renderComponent();

  openMenu();

  const editButton = await findElement('showParticipants');
  act(() => userEvent.click(editButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registration.id}/participants`
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

test('should open alert dialog when clicking delete button', async () => {
  global.alert = jest.fn();
  renderComponent();

  openMenu();

  const deleteButton = getElement('delete');
  act(() => userEvent.click(deleteButton));

  await waitFor(() =>
    expect(global.alert).toBeCalledWith('TODO: Delete registration')
  );
});
