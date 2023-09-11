import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

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
  getMockedAttendeesResponse,
} from '../../__mocks__/enrolmentsPage';
import { ENROLMENTS_PAGE_SIZE } from '../../constants';
import EnrolmentsTable, { EnrolmentsTableProps } from '../EnrolmentsTable';

configure({ defaultHidden: true });

const defaultMocks = [mockedEventResponse, mockedOrganizationAncestorsResponse];

const defaultProps: EnrolmentsTableProps = {
  caption: 'Enrolments table',
  enrolmentsVariables: { attendeeStatus: AttendeeStatus.Attending },
  heading: 'Enrolments table',
  pagePath: 'attendeePage',
  registration: registration,
};

const enrolmentName = [
  attendeeNames[0].firstName,
  attendeeNames[0].lastName,
].join(' ');
const enrolmentId = attendees.data[0].id;

const renderComponent = (mocks: MockedResponse[] = defaultMocks) => {
  return render(
    <EnrolmentPageProvider>
      <EnrolmentsTable {...defaultProps} />
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

test('should render enrolments table', async () => {
  renderComponent([
    ...defaultMocks,
    getMockedAttendeesResponse(fakeSignups(0)),
  ]);

  screen.getByRole('heading', { name: 'Enrolments table' });

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

  // Page 1 enrolment should be visible.
  screen.getByRole('button', { name: enrolmentName });
  expect(
    screen.queryByRole('button', {
      name: [
        attendeeNames[ENROLMENTS_PAGE_SIZE].firstName,
        attendeeNames[ENROLMENTS_PAGE_SIZE].lastName,
      ].join(' '),
    })
  ).not.toBeInTheDocument();

  const page2Button = getElement('page2');
  await user.click(page2Button);

  // Page 2 enrolment should be visible.
  await screen.findByRole('button', {
    name: [
      attendeeNames[ENROLMENTS_PAGE_SIZE].firstName,
      attendeeNames[ENROLMENTS_PAGE_SIZE].lastName,
    ].join(' '),
  });
  expect(
    screen.queryByRole('button', { name: enrolmentName })
  ).not.toBeInTheDocument();

  const page1Button = getElement('page1');
  await user.click(page1Button);

  // Page 1 enrolment should be visible.
  screen.getByRole('button', { name: enrolmentName });
  expect(
    screen.queryByRole('button', {
      name: [
        attendeeNames[ENROLMENTS_PAGE_SIZE].firstName,
        attendeeNames[ENROLMENTS_PAGE_SIZE].lastName,
      ].join(' '),
    })
  ).not.toBeInTheDocument();
});

test('should open enrolment page by clicking event', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    getMockedAttendeesResponse(attendees),
  ]);

  const enrolmentButton = await screen.findByRole('button', {
    name: enrolmentName,
  });
  await user.click(enrolmentButton);

  expect(history.location.pathname).toBe(
    `/fi/registrations/${registrationId}/enrolments/edit/${enrolmentId}`
  );
});

test('should open enrolment page by pressing enter on row', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    getMockedAttendeesResponse(attendees),
  ]);

  await loadingSpinnerIsNotInDocument();
  const enrolmentButton = await screen.findByRole('button', {
    name: enrolmentName,
  });
  await user.type(enrolmentButton, '{enter}');

  expect(history.location.pathname).toBe(
    `/fi/registrations/${registrationId}/enrolments/edit/${enrolmentId}`
  );
});

test('should open actions dropdown', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent([
    ...defaultMocks,
    getMockedAttendeesResponse(attendees),
  ]);

  const withinRow = within(
    await screen.findByRole('button', { name: enrolmentName })
  );
  const menuButton = withinRow.getByRole('button', { name: 'Valinnat' });
  await user.click(menuButton);

  const editButton = await withinRow.findByRole('button', {
    name: /muokkaa tietoja/i,
  });

  await user.click(editButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registrationId}/enrolments/edit/${enrolmentId}`
    )
  );
});
