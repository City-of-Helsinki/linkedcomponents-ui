import { History } from 'history';
import React from 'react';

import {
  act,
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import {
  eventNames,
  mockedEventResponses,
  registrations,
} from '../../__mocks__/registrationsPage';
import RegistrationsTable, {
  RegistrationsTableProps,
} from '../RegistrationsTable';

let history: History;

configure({ defaultHidden: true });

const mocks = [...mockedEventResponses];

const defaultProps: RegistrationsTableProps = {
  caption: 'Registrations table',
  registrations: [],
};

const renderComponent = (props?: Partial<RegistrationsTableProps>) =>
  render(<RegistrationsTable {...defaultProps} {...props} />, { mocks });

test('should render registrations table', () => {
  renderComponent();

  const columnHeaders = [
    'Nimi',
    'Julkaisija',
    'Osallistujia',
    'Jono',
    'Alkaa',
    'Loppuu',
  ];

  for (const name of columnHeaders) {
    screen.getByRole('columnheader', { name });
  }
  screen.getByText('Ei tuloksia');
});

test('should open registration page by clicking event name', async () => {
  const user = userEvent.setup();

  const eventName = eventNames[0];
  const registrationId = registrations.data[0].id;
  const registration = registrations.data[0];

  await act(async () => {
    const { history: newHistory } = await renderComponent({
      registrations: [registration],
    });
    history = newHistory;
  });

  const button = await screen.findByRole(
    'button',
    { name: eventName },
    { timeout: 20000 }
  );
  await act(async () => await user.click(button));
  expect(history.location.pathname).toBe(
    `/fi/registrations/edit/${registrationId}`
  );
});

test('should open registration page by pressing enter on row', async () => {
  const user = userEvent.setup();

  const eventName = eventNames[0];
  const registrationId = registrations.data[0].id;
  const registration = registrations.data[0];

  await act(async () => {
    const { history: newHistory } = await renderComponent({
      registrations: [registration],
    });
    history = newHistory;
  });
  const button = await screen.findByRole(
    'button',
    { name: eventName },
    { timeout: 20000 }
  );
  await act(async () => await user.click(button));
  await act(async () => await user.type(button, '{enter}'));

  expect(history.location.pathname).toBe(
    `/fi/registrations/edit/${registrationId}`
  );
});
