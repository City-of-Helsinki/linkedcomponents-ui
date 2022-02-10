import React from 'react';

import { AttendeeStatus } from '../../../../generated/graphql';
import {
  act,
  configure,
  CustomRenderOptions,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import {
  registration,
  registrationId,
} from '../../../registration/__mocks__/registration';
import {
  attendeeNames,
  attendees,
  mockedAttendeesResponse,
} from '../../__mocks__/enrolmentsPage';
import { ENROLMENTS_PAGE_SIZE } from '../../constants';
import EnrolmentsTable, { EnrolmentsTableProps } from '../EnrolmentsTable';

configure({ defaultHidden: true });

const defaultProps: EnrolmentsTableProps = {
  caption: 'Enrolments table',
  enrolmentsVariables: { attendeeStatus: AttendeeStatus.Attending },
  heading: 'Enrolments table',
  pagePath: 'attendeePage',
  registration,
};

const enrolmentName = attendees[0].name;
const enrolmentId = attendees[0].id;

const defaultMocks = [mockedAttendeesResponse];

const renderComponent = (
  props?: Partial<EnrolmentsTableProps>,
  renderOptions: CustomRenderOptions = {}
) => {
  const { mocks = defaultMocks } = renderOptions;

  return render(<EnrolmentsTable {...defaultProps} {...props} />, {
    ...renderOptions,
    mocks,
  });
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
  renderComponent(undefined, { mocks: [] });

  screen.getByRole('heading', { name: 'Enrolments table' });

  const columnHeaders = ['Nimi', 'Sähköposti', 'Puhelinnumero', 'Status'];

  for (const name of columnHeaders) {
    screen.getByRole('columnheader', { name });
  }
  await screen.findByText('Ei tuloksia');
});

test('should navigate between pages', async () => {
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  // Page 1 enrolment should be visible.
  screen.getByRole('button', { name: attendeeNames[0] });
  expect(
    screen.queryByRole('button', { name: attendeeNames[ENROLMENTS_PAGE_SIZE] })
  ).not.toBeInTheDocument();

  const page2Button = getElement('page2');
  userEvent.click(page2Button);

  // Page 2 enrolment should be visible.
  screen.getByRole('button', { name: attendeeNames[ENROLMENTS_PAGE_SIZE] });
  expect(
    screen.queryByRole('button', { name: attendeeNames[0] })
  ).not.toBeInTheDocument();

  const page1Button = getElement('page1');
  userEvent.click(page1Button);

  // Page 1 enrolment should be visible.
  screen.getByRole('button', { name: attendeeNames[0] });
  expect(
    screen.queryByRole('button', { name: attendeeNames[ENROLMENTS_PAGE_SIZE] })
  ).not.toBeInTheDocument();
});

test('should open enrolment page by clicking event', async () => {
  const { history } = renderComponent();

  const enrolmentButton = await screen.findByRole('button', {
    name: enrolmentName,
  });
  act(() => userEvent.click(enrolmentButton));

  expect(history.location.pathname).toBe(
    `/fi/registrations/${registrationId}/enrolments/edit/${enrolmentId}`
  );
});

test('should open enrolment page by pressing enter on row', async () => {
  const { history } = renderComponent();

  const enrolmentButton = await screen.findByRole('button', {
    name: enrolmentName,
  });
  act(() => userEvent.type(enrolmentButton, '{enter}'));

  expect(history.location.pathname).toBe(
    `/fi/registrations/${registrationId}/enrolments/edit/${enrolmentId}`
  );
});
