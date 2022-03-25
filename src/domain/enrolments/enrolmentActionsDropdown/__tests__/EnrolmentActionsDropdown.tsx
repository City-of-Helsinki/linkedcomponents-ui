import { MockedResponse } from '@apollo/client/testing';
import { AnyAction, Store } from '@reduxjs/toolkit';
import React from 'react';

import { ROUTES } from '../../../../constants';
import { StoreState } from '../../../../types';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import stripLanguageFromPath from '../../../../utils/stripLanguageFromPath';
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
  enrolment,
  mockedCancelEnrolmentResponse,
} from '../../../enrolment/__mocks__/editEnrolmentPage';
import { mockedEventResponse } from '../../../event/__mocks__/event';
import { registration } from '../../../registration/__mocks__/registration';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import EnrolmentActionsDropdown, {
  EnrolmentActionsDropdownProps,
} from '../EnrolmentActionsDropdown';

configure({ defaultHidden: true });

const defaultProps: EnrolmentActionsDropdownProps = {
  enrolment,
  registration,
};

const defaultMocks = [
  mockedCancelEnrolmentResponse,
  mockedEventResponse,
  mockedUserResponse,
];

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const route = `/fi${ROUTES.REGISTRATION_ENROLMENTS.replace(
  ':registrationId',
  registration.id
)}`;

const renderComponent = ({
  mocks = defaultMocks,
  props,
  store,
}: {
  mocks?: MockedResponse[];
  props?: Partial<EnrolmentActionsDropdownProps>;
  store?: Store<StoreState, AnyAction>;
} = {}) =>
  render(<EnrolmentActionsDropdown {...defaultProps} {...props} />, {
    mocks,
    routes: [route],
    store,
  });

const findElement = (key: 'cancel' | 'edit') => {
  switch (key) {
    case 'cancel':
      return screen.findByRole('button', { name: 'Peruuta osallistuminen' });
    case 'edit':
      return screen.findByRole('button', { name: 'Muokkaa tietoja' });
  }
};

const getElement = (key: 'cancel' | 'edit' | 'menu' | 'toggle') => {
  switch (key) {
    case 'cancel':
      return screen.getByRole('button', { name: 'Peruuta osallistuminen' });
    case 'edit':
      return screen.getByRole('button', { name: 'Muokkaa tietoja' });
    case 'menu':
      return screen.getByRole('region', { name: /valinnat/i });

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

  getElement('edit');
  await findElement('cancel');
});

test('should route to edit enrolment page when clicking edit button', async () => {
  const { history } = renderComponent();

  openMenu();

  const editButton = await findElement('edit');
  act(() => userEvent.click(editButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registration.id}/enrolments/edit/${enrolment.id}`
    )
  );

  expect(history.location.search).toBe(
    `?returnPath=${encodeURIComponent(stripLanguageFromPath(route))}`
  );
});

test('should try to cancel enrolment when clicking cancel button', async () => {
  renderComponent({ store });

  openMenu();

  const cancelButton = await findElement('cancel');
  act(() => userEvent.click(cancelButton));

  const withinModal = within(screen.getByRole('dialog'));
  const cancelEventButton = withinModal.getByRole('button', {
    name: 'Peruuta ilmoittautuminen',
  });
  userEvent.click(cancelEventButton);

  await waitFor(() =>
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  );
});
