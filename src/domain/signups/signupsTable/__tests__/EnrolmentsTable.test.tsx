import { MockedResponse } from '@apollo/client/testing';
import React from 'react';
import { toast } from 'react-toastify';

import { AttendeeStatus } from '../../../../generated/graphql';
import { fakeSignups } from '../../../../utils/mockDataUtils';
import {
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import { EnrolmentPageProvider } from '../../../enrolment/enrolmentPageContext/EnrolmentPageContext';
import { mockedEventResponse } from '../../../event/__mocks__/event';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import {
  registration,
  registrationId,
} from '../../../registration/__mocks__/registration';
import {
  attendeeNames,
  attendees,
  attendeesWithGroup,
  getMockedAttendeesResponse,
  signupGroupId,
} from '../../__mocks__/signupsPage';
import { SIGNUPS_PAGE_SIZE } from '../../constants';
import SignupsTable, { SignupsTableProps } from '../SignupsTable';

configure({ defaultHidden: true });

const defaultMocks = [mockedEventResponse, mockedOrganizationAncestorsResponse];

const defaultProps: SignupsTableProps = {
  caption: 'Signups table',
  heading: 'Signups table',
  pagePath: 'attendeePage',
  registration: registration,
  signupsVariables: { attendeeStatus: AttendeeStatus.Attending },
};

const signupName = [attendeeNames[0].firstName, attendeeNames[0].lastName].join(
  ' '
);

const renderComponent = (mocks: MockedResponse[] = defaultMocks) => {
  return render(
    <EnrolmentPageProvider>
      <SignupsTable {...defaultProps} />
    </EnrolmentPageProvider>,
    { mocks }
  );
};

const getElement = (key: 'page1' | 'page2') => {
  switch (key) {
    case 'page1':
      return screen.getByRole('link', { name: 'Sivu 1' });
    case 'page2':
      return screen.getByRole('link', { name: 'Sivu 2' });
  }
};

test('should render signups table', async () => {
  renderComponent([
    ...defaultMocks,
    getMockedAttendeesResponse(fakeSignups(0)),
  ]);

  screen.getByRole('heading', { name: 'Signups table' });

  const columnHeaders = ['Nimi', 'Sähköposti', 'Puhelinnumero', 'Status'];

  for (const name of columnHeaders) {
    screen.getByRole('columnheader', { name });
  }
  await screen.findByText(
    'Hakusi ei tuottanut yhtään tuloksia. Tarkista hakutermisi ja yritä uudestaan.'
  );
});

test('should navigate between pages', async () => {
  const user = userEvent.setup();

  renderComponent([...defaultMocks, getMockedAttendeesResponse(attendees)]);

  await loadingSpinnerIsNotInDocument();

  // Page 1 signup should be visible.
  screen.getByRole('button', { name: signupName });
  expect(
    screen.queryByRole('button', {
      name: [
        attendeeNames[SIGNUPS_PAGE_SIZE].firstName,
        attendeeNames[SIGNUPS_PAGE_SIZE].lastName,
      ].join(' '),
    })
  ).not.toBeInTheDocument();

  const page2Button = getElement('page2');
  await user.click(page2Button);

  // Page 2 signup should be visible.
  await screen.findByRole('button', {
    name: [
      attendeeNames[SIGNUPS_PAGE_SIZE].firstName,
      attendeeNames[SIGNUPS_PAGE_SIZE].lastName,
    ].join(' '),
  });
  expect(
    screen.queryByRole('button', { name: signupName })
  ).not.toBeInTheDocument();

  const page1Button = getElement('page1');
  await user.click(page1Button);

  // Page 1 signup should be visible.
  screen.getByRole('button', { name: signupName });
  expect(
    screen.queryByRole('button', {
      name: [
        attendeeNames[SIGNUPS_PAGE_SIZE].firstName,
        attendeeNames[SIGNUPS_PAGE_SIZE].lastName,
      ].join(' '),
    })
  ).not.toBeInTheDocument();
});

test('should show toast message by clicking a signup without group', async () => {
  toast.error = jest.fn();
  const user = userEvent.setup();
  renderComponent([...defaultMocks, getMockedAttendeesResponse(attendees)]);

  const signupButton = await screen.findByRole('button', {
    name: signupName,
  });
  await user.click(signupButton);

  expect(toast.error).toBeCalledWith(
    'TODO: Editing a single signup is not supported yet'
  );
});

test('should open edit signup group page by clicking a signup with group', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    getMockedAttendeesResponse(attendeesWithGroup),
  ]);

  const signupButton = await screen.findByRole('button', {
    name: signupName,
  });
  await user.click(signupButton);

  expect(history.location.pathname).toBe(
    `/fi/registrations/${registrationId}/signup-group/edit/${signupGroupId}`
  );
});

test('should show toast message by pressing enter on a signup without group', async () => {
  toast.error = jest.fn();
  const user = userEvent.setup();
  renderComponent([...defaultMocks, getMockedAttendeesResponse(attendees)]);

  await loadingSpinnerIsNotInDocument();
  const signupButton = await screen.findByRole('button', {
    name: signupName,
  });
  await user.type(signupButton, '{enter}');

  expect(toast.error).toBeCalledWith(
    'TODO: Editing a single signup is not supported yet'
  );
});

test('should open edit signup group page by pressing enter on a signup with group', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    getMockedAttendeesResponse(attendeesWithGroup),
  ]);

  await loadingSpinnerIsNotInDocument();
  const signupButton = await screen.findByRole('button', {
    name: signupName,
  });
  await user.type(signupButton, '{enter}');

  expect(history.location.pathname).toBe(
    `/fi/registrations/${registrationId}/signup-group/edit/${signupGroupId}`
  );
});

test('should open actions dropdown', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent([
    ...defaultMocks,
    getMockedAttendeesResponse(attendeesWithGroup),
  ]);

  const withinRow = within(
    await screen.findByRole('button', { name: signupName })
  );
  const menuButton = withinRow.getByRole('button', { name: 'Valinnat' });
  await user.click(menuButton);

  const editButton = await withinRow.findByRole('button', {
    name: /muokkaa tietoja/i,
  });

  await user.click(editButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registrationId}/signup-group/edit/${signupGroupId}`
    )
  );
});
