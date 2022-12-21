import { Formik } from 'formik';
import { advanceTo, clear } from 'jest-date-mock';
import React from 'react';

import {
  act,
  configure,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../../../utils/testUtils';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../../constants';
import { TimeSectionProvider } from '../../TimeSectionContext';
import EventTimesTable, { EventTimesTableProps } from '../EventTimesTable';

configure({ defaultHidden: true });

const defaultProps: EventTimesTableProps = {
  eventTimes: [],
  setEventTimes: jest.fn(),
};

beforeEach(() => {
  clear();
});

const eventTime1 = {
  endTime: new Date('2021-05-02T15:00:00.000Z'),
  id: null,
  startTime: new Date('2021-05-02T12:00:00.000Z'),
};
const eventTime2 = {
  endTime: new Date('2021-05-03T15:00:00.000Z'),
  id: null,
  startTime: new Date('2021-05-03T12:00:00.000Z'),
};

const type = EVENT_TYPE.General;

type InitialValues = {
  [EVENT_FIELDS.TYPE]: string;
};
const defaultInitialValue: InitialValues = {
  [EVENT_FIELDS.TYPE]: type,
};

const renderComponent = (props?: Partial<EventTimesTableProps>) =>
  render(
    <Formik initialValues={defaultInitialValue} onSubmit={jest.fn()}>
      <TimeSectionProvider isEditingAllowed={true}>
        <EventTimesTable {...defaultProps} {...props} />
      </TimeSectionProvider>
    </Formik>
  );

test('should not show event times table if eventTimes is empty', async () => {
  renderComponent({ eventTimes: [] });

  expect(screen.queryByRole('table')).not.toBeInTheDocument();
});

test('should render event times table', async () => {
  advanceTo('2021-04-12');
  const eventTimes = [eventTime1, eventTime2];

  renderComponent({ eventTimes });

  screen.getByRole('table');
  screen.getByRole('row', { name: '1 2.5.2021 12.00 – 2.5.2021 15.00' });
  screen.getByRole('row', { name: '2 3.5.2021 12.00 – 3.5.2021 15.00' });
});

test('should call setEventTimes when deleting an event time', async () => {
  advanceTo('2021-04-12');

  const eventTimes = [eventTime1, eventTime2];
  const setEventTimes = jest.fn();

  const user = userEvent.setup();
  renderComponent({ eventTimes, setEventTimes });

  const withinRow = within(
    screen.getByRole('row', { name: '1 2.5.2021 12.00 – 2.5.2021 15.00' })
  );
  const toggleMenuButton = withinRow.getByRole('button', { name: /valinnat/i });
  await act(async () => await user.click(toggleMenuButton));
  const deleteButton = withinRow.getByRole('button', { name: /poista/i });
  await act(async () => await user.click(deleteButton));

  expect(setEventTimes).toBeCalledWith([eventTime2]);
});

test('should call setEventTimes when updating an event time', async () => {
  advanceTo('2021-04-12');

  const eventTimes = [eventTime1, eventTime2];
  const setEventTimes = jest.fn();

  const user = userEvent.setup();
  renderComponent({ eventTimes, setEventTimes });

  const withinRow = within(
    screen.getByRole('row', { name: '1 2.5.2021 12.00 – 2.5.2021 15.00' })
  );
  const toggleMenuButton = withinRow.getByRole('button', { name: /valinnat/i });
  await act(async () => await user.click(toggleMenuButton));
  const editButton = withinRow.getByRole('button', { name: /muokkaa/i });
  await act(async () => await user.click(editButton));

  const withinDialog = within(
    screen.getByRole('dialog', { name: 'Muokkaa ajankohtaa' })
  );
  const startDateInput = withinDialog.getByLabelText('Tapahtuma alkaa *');
  await act(async () => await user.clear(startDateInput));
  await act(async () => await user.type(startDateInput, '2.5.2021'));

  const updateButton = withinDialog.getByRole('button', {
    name: /tallenna muutokset/i,
  });
  await act(async () => await user.click(updateButton));

  await waitFor(() => {
    expect(setEventTimes).toBeCalledWith([
      { ...eventTime1, startTime: new Date('2021-05-02T12:00:00.000Z') },
      eventTime2,
    ]);
  });
});
