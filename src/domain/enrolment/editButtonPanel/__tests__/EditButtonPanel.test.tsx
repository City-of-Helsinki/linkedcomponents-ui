import { AnyAction, Store } from '@reduxjs/toolkit';
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
import { mockedEventResponse } from '../../../event/__mocks__/event';
import {
  registration,
  registrationId,
} from '../../../registration/__mocks__/registration';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import { enrolment } from '../../__mocks__/enrolment';
import EditButtonPanel, { EditButtonPanelProps } from '../EditButtonPanel';

configure({ defaultHidden: true });

const defaultProps: EditButtonPanelProps = {
  enrolment,
  onCancel: jest.fn(),
  onSave: jest.fn(),
  registration: registration,
  saving: false,
};

const mocks = [mockedEventResponse, mockedUserResponse];

const state = fakeAuthenticatedStoreState();
const defaultStore = getMockReduxStore(state);

const defaultRoute = `/fi/${ROUTES.EDIT_REGISTRATION_ENROLMENT.replace(
  ':registrationId',
  registrationId
).replace(':enrolmentId', enrolment.id)}`;

const renderComponent = ({
  props,
  route = defaultRoute,
  store = defaultStore,
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

const findElement = (key: 'cancelButton' | 'sendMessageButton') => {
  switch (key) {
    case 'cancelButton':
      return screen.findByRole('button', { name: 'Peruuta osallistuminen' });
    case 'sendMessageButton':
      return screen.findByRole('button', { name: 'Lähetä viesti' });
  }
};

const getElement = (
  key:
    | 'backButton'
    | 'cancelButton'
    | 'menu'
    | 'saveButton'
    | 'sendMessageButton'
    | 'toggleButton'
) => {
  switch (key) {
    case 'backButton':
      return screen.getByRole('button', { name: 'Takaisin' });
    case 'cancelButton':
      return screen.getByRole('button', { name: 'Peruuta osallistuminen' });
    case 'menu':
      return screen.getByRole('region', { name: /valinnat/i });
    case 'saveButton':
      return screen.getByRole('button', { name: 'Tallenna osallistuja' });
    case 'sendMessageButton':
      return screen.getByRole('button', { name: 'Lähetä viesti' });
    case 'toggleButton':
      return screen.getByRole('button', { name: /valinnat/i });
  }
};

const openMenu = () => {
  const toggleButton = getElement('toggleButton');
  userEvent.click(toggleButton);
  getElement('menu');

  return toggleButton;
};

test('should toggle menu by clicking actions button', () => {
  renderComponent();

  const toggleButton = openMenu();
  userEvent.click(toggleButton);

  expect(
    screen.queryByRole('region', { name: /valinnat/i })
  ).not.toBeInTheDocument();
});

test('should call onCancel clicking cancel button', async () => {
  const onCancel = jest.fn();
  renderComponent({ props: { onCancel } });

  openMenu();
  const cancelButton = await findElement('cancelButton');
  act(() => userEvent.click(cancelButton));
  expect(onCancel).toBeCalled();
});

test('should show toast message when clicking send message button', async () => {
  toast.error = jest.fn();
  renderComponent();

  openMenu();
  const sendMessageButton = await findElement('sendMessageButton');
  act(() => userEvent.click(sendMessageButton));

  await waitFor(() =>
    expect(toast.error).toBeCalledWith('TODO: Send message to attendee')
  );
});

test('should toggle menu by clicking actions button', () => {
  renderComponent();

  const toggleButton = openMenu();
  userEvent.click(toggleButton);

  expect(
    screen.queryByRole('region', { name: /valinnat/i })
  ).not.toBeInTheDocument();
});

test('should route to enrolments page when clicking back button', async () => {
  const { history } = renderComponent();

  const backButton = getElement('backButton');
  userEvent.click(backButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registration.id}/enrolments`
    )
  );
});

test('should route to page defined in returnPath when clicking back button', async () => {
  const { history } = renderComponent({
    route: `/fi${ROUTES.EDIT_REGISTRATION_ENROLMENT.replace(
      ':registrationId',
      registration.id
    )}?returnPath=${ROUTES.EDIT_REGISTRATION.replace(':id', registration.id)}`,
  });

  const backButton = getElement('backButton');
  userEvent.click(backButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/edit/${registration.id}`
    )
  );
});

test('should call onSave', async () => {
  const onSave = jest.fn();
  renderComponent({ props: { onSave } });

  const saveButton = getElement('saveButton');
  userEvent.click(saveButton);

  expect(onSave).toBeCalled();
});

test('menu toggle button should be visible and accessible for mobile devices', async () => {
  global.innerWidth = 500;
  renderComponent();

  getElement('toggleButton');
});
