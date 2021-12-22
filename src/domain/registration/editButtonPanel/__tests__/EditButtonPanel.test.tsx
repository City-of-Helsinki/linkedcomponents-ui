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
} from '../../../../utils/testUtils';
import {
  mockedUserResponse,
  registration,
  registrationId,
} from '../../__mocks__/editRegistrationPage';
import EditButtonPanel, { EditButtonPanelProps } from '../EditButtonPanel';

configure({ defaultHidden: true });
jest.mock('copy-to-clipboard');

const defaultProps: EditButtonPanelProps = {
  registration,
  onDelete: jest.fn(),
  onUpdate: jest.fn(),
  saving: false,
};

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);
const mocks = [mockedUserResponse];

const renderComponent = ({
  props,
  route = `/fi/${ROUTES.EDIT_REGISTRATION}`,
  store,
}: {
  props?: Partial<EditButtonPanelProps>;
  route?: string;
  store?: Store<StoreState, AnyAction>;
} = {}) =>
  render(<EditButtonPanel {...defaultProps} {...props} />, {
    mocks,
    routes: [route],
    store,
  });

const findElement = (key: 'delete') => {
  switch (key) {
    case 'delete':
      return screen.findByRole('button', { name: 'Poista ilmoittautuminen' });
  }
};

const getElements = (key: 'disabledButtons') => {
  switch (key) {
    case 'disabledButtons':
      return screen.getAllByRole('button', {
        name: 'Sinulla ei ole oikeuksia muokata ilmoittautumisia.',
      });
  }
};

const getElement = (
  key:
    | 'back'
    | 'copy'
    | 'copyLink'
    | 'menu'
    | 'showEnrolments'
    | 'toggle'
    | 'update'
) => {
  switch (key) {
    case 'back':
      return screen.getByRole('button', { name: /takaisin/i });
    case 'copy':
      return screen.getByRole('button', { name: /kopioi pohjaksi/i });
    case 'copyLink':
      return screen.getByRole('button', { name: /kopioi linkk/i });
    case 'menu':
      return screen.getByRole('region', { name: /valinnat/i });
    case 'showEnrolments':
      return screen.getByRole('button', { name: /näytä ilmoittautuneet/i });
    case 'toggle':
      return screen.getByRole('button', { name: /valinnat/i });
    case 'update':
      return screen.getByRole('button', { name: 'Tallenna muutokset' });
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

test('should render all buttons when user is authenticated', async () => {
  const onDelete = jest.fn();
  const onUpdate = jest.fn();

  renderComponent({
    props: { onDelete, onUpdate },
    store,
  });

  openMenu();

  getElement('showEnrolments');
  getElement('copy');
  getElement('copyLink');

  const deleteButton = await findElement('delete');
  act(() => userEvent.click(deleteButton));
  expect(onDelete).toBeCalled();

  const updateButton = getElement('update');
  userEvent.click(updateButton);
  expect(onUpdate).toBeCalled();
});

test('only copy, copy link and show enrolments button should be enabled when user is not logged in', () => {
  renderComponent();

  openMenu();

  getElement('showEnrolments');
  getElement('copy');
  getElement('copyLink');

  const disabledButtons = getElements('disabledButtons');
  expect(disabledButtons).toHaveLength(2);
  disabledButtons.forEach((button) => expect(button).toBeDisabled());
});

test('should route to enrolments page when clicking show enrolmentss button', async () => {
  const { history } = renderComponent();

  openMenu();

  const showEnrolmentsButton = getElement('showEnrolments');
  act(() => userEvent.click(showEnrolmentsButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registration.id}/enrolments`
    )
  );
});

test('should route to create registration page when clicking copy button', async () => {
  const { history } = renderComponent();

  openMenu();

  const copyButton = getElement('copy');
  act(() => userEvent.click(copyButton));

  await waitFor(() =>
    expect(history.location.pathname).toBe('/fi/registrations/create')
  );
});

test('should copy registration link to clipboard', async () => {
  toast.success = jest.fn();
  renderComponent();

  openMenu();

  const copyLinkButton = getElement('copyLink');
  act(() => userEvent.click(copyLinkButton));

  expect(copyToClipboard).toBeCalledWith(
    `https://linkedregistrations-ui.test.kuva.hel.ninja/fi/registration/${registrationId}/enrolment/create`
  );
  expect(toast.success).toBeCalledWith('Ilmoittautumislinkki kopioitu');
});

test('should route to search page when clicking back button', async () => {
  const { history } = renderComponent();

  const backButton = getElement('back');
  userEvent.click(backButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe('/fi/registrations')
  );
});

test('should route to page defined in returnPath when clicking back button', async () => {
  const { history } = renderComponent({
    route: `/fi${ROUTES}?returnPath=${ROUTES.SEARCH}&returnPath=${ROUTES.REGISTRATIONS}`,
  });

  const backButton = getElement('back');
  userEvent.click(backButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe('/fi/registrations')
  );
  expect(history.location.search).toBe(`?returnPath=%2Fsearch`);
});

test('menu toggle button should be visible and accessible for mobile devices', async () => {
  global.innerWidth = 500;
  renderComponent();

  getElement('toggle');
});
