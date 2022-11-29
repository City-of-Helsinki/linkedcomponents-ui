import React from 'react';

import { AttendeeStatus } from '../../../../generated/graphql';
import {
  act,
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import { EnrolmentPageProvider } from '../../../enrolment/enrolmentPageContext/EnrolmentPageContext';
import {
  registration,
  registrationId,
} from '../../../registration/__mocks__/registration';
import { attendeeNames, attendees } from '../../__mocks__/enrolmentsPage';
import { ENROLMENTS_PAGE_SIZE } from '../../constants';
import EnrolmentsTable, { EnrolmentsTableProps } from '../EnrolmentsTable';

configure({ defaultHidden: true });

const defaultProps: EnrolmentsTableProps = {
  caption: 'Enrolments table',
  enrolmentsVariables: { attendeeStatus: AttendeeStatus.Attending },
  heading: 'Enrolments table',
  pagePath: 'attendeePage',
  registration: { ...registration, signups: attendees },
};

const enrolmentName = attendees[0].name as string;
const enrolmentId = attendees[0].id;

const renderComponent = (props?: Partial<EnrolmentsTableProps>) => {
  return render(
    <EnrolmentPageProvider>
      <EnrolmentsTable {...defaultProps} {...props} />
    </EnrolmentPageProvider>
  );
};

const getElement = (key: 'page1' | 'page2' | 'pagination') => {
  switch (key) {
    case 'page1':
      return screen.getByRole('button', { name: 'Sivu 1' });
    case 'page2':
      return screen.getByRole('button', { name: 'Sivu 2' });
    case 'pagination':
      return screen.getByRole('navigation', { name: 'Sivunavigointi' });
  }
};

test('should render enrolments table', async () => {
  renderComponent({ registration: { ...registration, signups: [] } });

  screen.getByRole('heading', { name: 'Enrolments table' });

  const columnHeaders = ['Nimi', 'Sähköposti', 'Puhelinnumero', 'Status'];

  for (const name of columnHeaders) {
    screen.getByRole('columnheader', { name });
  }
  await screen.findByText('Ei tuloksia');
});

test('should navigate between pages', async () => {
  const user = userEvent.setup();
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  // Page 1 enrolment should be visible.
  screen.getByRole('button', { name: attendeeNames[0] });
  expect(
    screen.queryByRole('button', { name: attendeeNames[ENROLMENTS_PAGE_SIZE] })
  ).not.toBeInTheDocument();

  const page2Button = getElement('page2');
  await act(async () => await user.click(page2Button));

  // Page 2 enrolment should be visible.
  screen.getByRole('button', { name: attendeeNames[ENROLMENTS_PAGE_SIZE] });
  expect(
    screen.queryByRole('button', { name: attendeeNames[0] })
  ).not.toBeInTheDocument();

  const page1Button = getElement('page1');
  await act(async () => await user.click(page1Button));

  // Page 1 enrolment should be visible.
  screen.getByRole('button', { name: attendeeNames[0] });
  expect(
    screen.queryByRole('button', { name: attendeeNames[ENROLMENTS_PAGE_SIZE] })
  ).not.toBeInTheDocument();
});

test('should open enrolment page by clicking event', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  const enrolmentButton = await screen.findByRole('button', {
    name: enrolmentName,
  });
  await act(async () => await user.click(enrolmentButton));

  expect(history.location.pathname).toBe(
    `/fi/registrations/${registrationId}/enrolments/edit/${enrolmentId}`
  );
});

test('should open enrolment page by pressing enter on row', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent();

  const enrolmentButton = await screen.findByRole('button', {
    name: enrolmentName,
  });
  await act(async () => await user.type(enrolmentButton, '{enter}'));

  expect(history.location.pathname).toBe(
    `/fi/registrations/${registrationId}/enrolments/edit/${enrolmentId}`
  );
});
