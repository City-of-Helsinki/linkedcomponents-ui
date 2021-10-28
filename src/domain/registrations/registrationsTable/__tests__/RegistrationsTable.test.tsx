import React from 'react';

import {
  act,
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import {
  registrationNames,
  registrations,
} from '../../__mocks__/registrationsPage';
import RegistrationsTable, {
  RegistrationsTableProps,
} from '../RegistrationsTable';

configure({ defaultHidden: true });

const defaultProps: RegistrationsTableProps = {
  caption: 'Registrations table',
  registrations: [],
};

const renderComponent = (props?: Partial<RegistrationsTableProps>) =>
  render(<RegistrationsTable {...defaultProps} {...props} />);

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

test('should render all registrations', () => {
  renderComponent({
    registrations: registrations.data,
  });

  for (const name of registrationNames) {
    screen.getByRole('button', { name });
  }
});

test('should open event page by clicking event', () => {
  const registrationName = registrations.data[0].name;
  const registrationId = registrations.data[0].id;
  const { history } = renderComponent({
    registrations: registrations.data,
  });

  act(() =>
    userEvent.click(screen.getByRole('button', { name: registrationName }))
  );

  expect(history.location.pathname).toBe(
    `/fi/registrations/edit/${registrationId}`
  );
});

test('should open event page by pressing enter on row', () => {
  const registrationName = registrations.data[0].name;
  const registrationId = registrations.data[0].id;
  const { history } = renderComponent({
    registrations: registrations.data,
  });

  act(() =>
    userEvent.type(
      screen.getByRole('button', { name: registrationName }),
      '{enter}'
    )
  );

  expect(history.location.pathname).toBe(
    `/fi/registrations/edit/${registrationId}`
  );
});
