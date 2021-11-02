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

test('should render all registrations', async () => {
  renderComponent({
    registrations: registrations.data,
  });

  for (const name of eventNames) {
    await screen.findByRole('button', { name });
  }
});

test('should open event page by clicking event', async () => {
  const eventName = eventNames[0];
  const registrationId = registrations.data[0].id;
  const { history } = renderComponent({
    registrations: registrations.data,
  });

  const button = await screen.findByRole('button', { name: eventName });
  act(() => userEvent.click(button));

  expect(history.location.pathname).toBe(
    `/fi/registrations/edit/${registrationId}`
  );
});

test('should open event page by pressing enter on row', async () => {
  const eventName = eventNames[0];
  const registrationId = registrations.data[0].id;
  const { history } = renderComponent({
    registrations: registrations.data,
  });

  const button = await screen.findByRole('button', { name: eventName });
  act(() => userEvent.type(button, '{enter}'));

  expect(history.location.pathname).toBe(
    `/fi/registrations/edit/${registrationId}`
  );
});
