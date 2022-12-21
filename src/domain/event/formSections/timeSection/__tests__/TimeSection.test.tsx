import { Formik } from 'formik';
import { advanceTo, clear } from 'jest-date-mock';
import React from 'react';

import {
  EventFieldsFragment,
  SuperEventType,
} from '../../../../../generated/graphql';
import { fakeEvent } from '../../../../../utils/mockDataUtils';
import {
  act,
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import { EventTime, RecurringEventSettings } from '../../../types';
import { publicEventSchema } from '../../../validation';
import TimeSection from '../TimeSection';

configure({ defaultHidden: true });

beforeEach(() => clear());

const type = EVENT_TYPE.General;

type InitialValues = {
  [EVENT_FIELDS.EVENT_TIMES]: EventTime[];
  [EVENT_FIELDS.EVENTS]: EventTime[];
  [EVENT_FIELDS.RECURRING_EVENTS]: RecurringEventSettings[];
  [EVENT_FIELDS.TYPE]: string;
};
const defaultInitialValue: InitialValues = {
  [EVENT_FIELDS.EVENT_TIMES]: [],
  [EVENT_FIELDS.EVENTS]: [],
  [EVENT_FIELDS.RECURRING_EVENTS]: [],
  [EVENT_FIELDS.TYPE]: type,
};

const events = [
  {
    id: null,
    endTime: new Date('2021-04-18T15:00:00.000Z'),
    startTime: new Date('2021-04-18T12:00:00.000Z'),
  },
];

const eventTimes = [
  {
    id: null,
    endTime: new Date('2021-06-11T15:00:00.000Z'),
    startTime: new Date('2021-06-11T12:00:00.000Z'),
  },
];

const recurringEvents: RecurringEventSettings[] = [
  {
    endDate: new Date('2021-05-15T00:00:00.000Z'),
    endTime: '15.00',
    eventTimes: [
      {
        id: null,
        endTime: new Date('2021-05-03T15:00:00.000Z'),
        startTime: new Date('2021-05-03T12:00:00.000Z'),
      },
      {
        id: null,
        endTime: new Date('2021-05-10T15:00:00.000Z'),
        startTime: new Date('2021-05-10T12:00:00.000Z'),
      },
    ],
    repeatDays: ['mon'],
    repeatInterval: 1,
    startDate: new Date('2021-05-01T00:00:00.000Z'),
    startTime: '12.00',
  },
];

const renderComponent = (
  initialValues?: Partial<typeof defaultInitialValue>,
  savedEvent?: EventFieldsFragment
) =>
  render(
    <Formik
      initialValues={{ ...defaultInitialValue, ...initialValues }}
      onSubmit={jest.fn()}
      validationSchema={publicEventSchema}
    >
      <TimeSection isEditingAllowed={true} savedEvent={savedEvent} />
    </Formik>
  );

const getElement = (key: 'recurringEventTab') => {
  switch (key) {
    case 'recurringEventTab':
      return screen.getByRole('tab', { name: /toistuva tapahtuma/i });
  }
};

const getEventTimeElement = (key: 'startDate') => {
  switch (key) {
    case 'startDate':
      return screen.getByLabelText('Tapahtuma alkaa *');
  }
};

const getRecurringEventElement = (key: 'startDate') => {
  switch (key) {
    case 'startDate':
      return screen.getByLabelText(/toisto alkaa/i);
  }
};

test('should render all event times', async () => {
  advanceTo('2021-04-12');

  const initialValues = {
    [EVENT_FIELDS.EVENTS]: events,
    [EVENT_FIELDS.EVENT_TIMES]: eventTimes,
    [EVENT_FIELDS.RECURRING_EVENTS]: recurringEvents,
  };
  await act(async () => {
    await renderComponent(initialValues, fakeEvent());
  });

  // Event
  await screen.findByRole('row', {
    name: '1 18.4.2021 12.00 – 18.4.2021 15.00',
  });
  // Recurring event
  screen.getByRole('heading', {
    name: 'Ma, Viikon välein, 1.5.2021 – 15.5.2021',
  });
  // Single event time
  screen.getByRole('row', {
    name: '4 11.6.2021 12.00 – 11.6.2021 15.00',
  });
});

test('should change to recurring event tab', async () => {
  advanceTo('2021-04-12');
  const user = userEvent.setup();

  renderComponent();

  screen.getByRole('tabpanel', { name: /tapahtuman ajankohta/i });

  const recurringEventTab = getElement('recurringEventTab');
  await act(async () => await user.click(recurringEventTab));

  screen.getByRole('tabpanel', { name: /toistuva tapahtuma/i });
});

test('should not be able to add new event times when editing single event', async () => {
  advanceTo('2021-04-12');
  const user = userEvent.setup();

  const initialValues = { [EVENT_FIELDS.EVENTS]: events };

  renderComponent(
    initialValues,
    fakeEvent({
      endTime: events[0].endTime.toISOString(),
      startTime: events[0].startTime.toISOString(),
      superEventType: null,
    })
  );

  expect(getEventTimeElement('startDate')).toBeDisabled();

  const recurringEventTab = getElement('recurringEventTab');
  await act(async () => await user.click(recurringEventTab));

  expect(getRecurringEventElement('startDate')).toBeDisabled();
});

test('should be able to add new event times when editing recurring event', async () => {
  advanceTo('2021-04-12');
  const user = userEvent.setup();

  const initialValues = { [EVENT_FIELDS.EVENTS]: events };

  renderComponent(
    initialValues,
    fakeEvent({
      endTime: events[0].endTime.toISOString(),
      startTime: events[0].startTime.toISOString(),
      superEventType: SuperEventType.Recurring,
    })
  );

  expect(getEventTimeElement('startDate')).toBeEnabled();

  const recurringEventTab = getElement('recurringEventTab');
  await act(async () => await user.click(recurringEventTab));

  expect(getRecurringEventElement('startDate')).toBeEnabled();
});
