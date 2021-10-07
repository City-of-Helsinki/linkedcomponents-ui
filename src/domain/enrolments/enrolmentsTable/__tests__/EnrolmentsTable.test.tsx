import React from 'react';

import {
  act,
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import {
  attendeeNames,
  attendees,
  registration,
} from '../../__mocks__/enrolmentsPage';
import EnrolmentsTable, { EnrolmentsTableProps } from '../EnrolmentsTable';

configure({ defaultHidden: true });

const defaultProps: EnrolmentsTableProps = {
  caption: 'Enrolments table',
  enrolments: [],
  heading: 'Enrolments table',
  registration,
};

const renderComponent = (props?: Partial<EnrolmentsTableProps>) =>
  render(<EnrolmentsTable {...defaultProps} {...props} />);

test('should render enrolments table', () => {
  renderComponent();

  screen.getByRole('heading', { name: 'Enrolments table' });

  const columnHeaders = [
    'Nimi',
    'Sukupuoli',
    'Sähköposti',
    'Puhelinnumero',
    'Status',
  ];

  for (const name of columnHeaders) {
    screen.getByRole('columnheader', { name });
  }
  screen.getByText('Ei tuloksia');
});

test('should render all enrolments', () => {
  renderComponent({
    enrolments: attendees.data,
  });

  for (const name of attendeeNames) {
    screen.getByRole('button', { name });
  }
});

test('should open event page by clicking event', () => {
  const enrolmentName = attendees.data[0].name;
  const enrolmentId = attendees.data[0].id;
  const { history } = renderComponent({
    enrolments: attendees.data,
  });

  act(() =>
    userEvent.click(screen.getByRole('button', { name: enrolmentName }))
  );

  expect(history.location.pathname).toBe(
    `/fi/registrations/${registration.id}/enrolments/edit/${enrolmentId}`
  );
});

test('should open event page by pressing enter on row', () => {
  const enrolmentName = attendees.data[0].name;
  const enrolmentId = attendees.data[0].id;
  const { history } = renderComponent({
    enrolments: attendees.data,
  });

  act(() =>
    userEvent.type(
      screen.getByRole('button', { name: enrolmentName }),
      '{enter}'
    )
  );

  expect(history.location.pathname).toBe(
    `/fi/registrations/${registration.id}/enrolments/edit/${enrolmentId}`
  );
});
