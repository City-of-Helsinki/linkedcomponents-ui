import React from 'react';

import { Registration } from '../../../../generated/graphql';
import getValue from '../../../../utils/getValue';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import { mockedOrganizationResponse } from '../../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import {
  mockedEventResponses,
  registrations,
} from '../../__mocks__/registrationsPage';
import RegistrationsTable, {
  RegistrationsTableProps,
} from '../RegistrationsTable';

configure({ defaultHidden: true });

const registrationId = getValue(registrations.data[0]?.id, '');
const registration = registrations.data[0] as Registration;

const mocks = [
  ...mockedEventResponses,
  mockedOrganizationResponse,
  mockedOrganizationAncestorsResponse,
];

const defaultProps: RegistrationsTableProps = {
  caption: 'Registrations table',
  registrations: [],
};

const renderComponent = (props?: Partial<RegistrationsTableProps>) =>
  render(<RegistrationsTable {...defaultProps} {...props} />, { mocks });

test('should render registrations table', async () => {
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
  screen.getByText(
    'Hakusi ei tuottanut yhtään tuloksia. Tarkista hakutermisi ja yritä uudestaan.'
  );
});

test('should open registration page by clicking event name', async () => {
  const user = userEvent.setup();

  const { history } = await renderComponent({ registrations: [registration] });

  const button = await screen.findByRole(
    'button',
    { name: registrationId },
    { timeout: 20000 }
  );
  await user.click(button);
  expect(history.location.pathname).toBe(
    `/fi/registrations/edit/${registrationId}`
  );
});

test('should open registration page by pressing enter on row', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent({ registrations: [registration] });

  const button = await screen.findByRole(
    'button',
    { name: registrationId },
    { timeout: 20000 }
  );
  await user.click(button);
  await user.type(button, '{enter}');

  expect(history.location.pathname).toBe(
    `/fi/registrations/edit/${registrationId}`
  );
});

test('should open actions dropdown', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent({ registrations: [registration] });

  const withinRow = within(
    screen.getByRole('button', { name: registrationId })
  );
  const menuButton = withinRow.getByRole('button', { name: 'Valinnat' });
  await user.click(menuButton);

  const editButton = await withinRow.findByRole('button', { name: /muokkaa/i });

  await user.click(editButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/edit/${registrationId}`
    )
  );
});
