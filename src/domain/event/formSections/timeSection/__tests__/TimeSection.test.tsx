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
  waitFor,
  within,
} from '../../../../../utils/testUtils';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import { EventTime, RecurringEventSettings } from '../../../types';
import { publicEventSchema } from '../../../validation';
import TimeSection from '../TimeSection';

configure({
  defaultHidden: true,
});

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
    endDate: '15.5.2021',
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
    startDate: '1.5.2021',
    startTime: '12.00',
  },
];

const renderComponent = (
  initialValues?: Partial<typeof defaultInitialValue>,
  savedEvent?: EventFieldsFragment
) =>
  render(
    <Formik
      initialValues={{
        ...defaultInitialValue,
        ...initialValues,
      }}
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

const findSingleEventElement = (key: 'startTime') => {
  switch (key) {
    case 'startTime':
      return screen.findByRole('textbox', { name: 'Tapahtuma alkaa *' });
  }
};

const getSingleEventElement = (
  key:
    | 'addButton'
    | 'delete'
    | 'endDate'
    | 'endTime'
    | 'startDate'
    | 'startTime'
    | 'toggle'
) => {
  switch (key) {
    case 'addButton':
      return screen.getByRole('button', { name: /lisää ajankohta/i });
    case 'delete':
      return screen.getByRole('button', { name: /poista/i });
    case 'endDate':
      return screen.getByRole('textbox', { name: 'Tapahtuma päättyy *' });
    case 'endTime':
      return screen.getByRole('textbox', { name: /tapahtuma päättyy klo/i });
    case 'toggle':
      return screen.getAllByRole('button', { name: /valinnat/i })[0];
    case 'startDate':
      return screen.getByRole('textbox', { name: 'Tapahtuma alkaa *' });
    case 'startTime':
      return screen.getByRole('textbox', { name: /tapahtuma alkaa klo/i });
  }
};

const findRecurringEventElement = (key: 'startTime') => {
  switch (key) {
    case 'startTime':
      return screen.findByRole('textbox', { name: /tapahtuma alkaa klo/i });
  }
};

const getRecurringEventElement = (
  key:
    | 'addButton'
    | 'endDate'
    | 'endTime'
    | 'monCheckbox'
    | 'repeatInterval'
    | 'startDate'
    | 'startTime'
    | 'tueCheckbox'
) => {
  switch (key) {
    case 'addButton':
      return screen.getByRole('button', { name: /lisää toistuva tapahtuma/i });
    case 'endDate':
      return screen.getByRole('textbox', { name: /toisto päättyy/i });
    case 'endTime':
      return screen.getByRole('textbox', { name: /tapahtuma päättyy klo/i });
    case 'monCheckbox':
      return screen.getByRole('checkbox', { name: /ma/i });
    case 'repeatInterval':
      return screen.getByRole('spinbutton', { name: /tapahtuma toistuu \*/i });
    case 'startDate':
      return screen.getByRole('textbox', { name: /toisto alkaa/i });
    case 'startTime':
      return screen.getByRole('textbox', { name: /tapahtuma alkaa klo/i });
    case 'tueCheckbox':
      return screen.getByRole('checkbox', { name: /ti/i });
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

test('should add/delete event time', async () => {
  advanceTo('2021-04-12');
  const user = userEvent.setup();

  const initialValues = { [EVENT_FIELDS.EVENT_TIMES]: eventTimes };

  renderComponent(initialValues);

  const startDateInput = getSingleEventElement('startDate');
  const endDateInput = getSingleEventElement('endDate');
  const startTimeInput = getSingleEventElement('startTime');
  const endTimeInput = getSingleEventElement('endTime');

  const timeFields = [
    { component: startDateInput, value: '14.4.2021' },
    { component: endDateInput, value: '14.4.2021' },
    { component: startTimeInput, value: '12.00' },
    { component: endTimeInput, value: '14.00' },
  ];

  for (const { component, value } of timeFields) {
    await act(async () => await user.click(component));
    await act(async () => await user.type(component, value));
  }

  const addButton = getSingleEventElement('addButton');
  await waitFor(() => expect(addButton).toBeEnabled());
  await act(async () => await user.click(addButton));

  await screen.findByRole('row', {
    name: '1 14.4.2021 12.00 – 14.4.2021 14.00',
  });
  screen.getByRole('row', {
    name: '2 11.6.2021 12.00 – 11.6.2021 15.00',
  });

  const toggleButton = getSingleEventElement('toggle');
  await act(async () => await user.click(toggleButton));

  const deleteButton = getSingleEventElement('delete');
  await act(async () => await user.click(deleteButton));

  await waitFor(() =>
    expect(
      screen.queryByRole('row', {
        name: '1 14.4.2021 12.00 – 14.4.2021 14.00',
      })
    ).not.toBeInTheDocument()
  );
  screen.getByRole('row', {
    name: '1 11.6.2021 12.00 – 11.6.2021 15.00',
  });
});

test('should show validation error when end time is before start time in new event time', async () => {
  advanceTo('2021-04-12');
  const user = userEvent.setup();

  renderComponent();

  const startDateInput = getSingleEventElement('startDate');
  const endDateInput = getSingleEventElement('endDate');
  const startTimeInput = getSingleEventElement('startTime');
  const endTimeInput = getSingleEventElement('endTime');

  const timeFields = [
    { component: startDateInput, value: '14.4.2021' },
    { component: endDateInput, value: '14.4.2021' },
    { component: startTimeInput, value: '14.00' },
    { component: endTimeInput, value: '12.00' },
  ];

  for (const { component, value } of timeFields) {
    await act(async () => await user.click(component));
    await act(async () => await user.type(component, value));
  }

  await act(async () => await user.click(startTimeInput));
  await screen.findByText(
    'Tämän päivämäärän tulee olla 14.4.2021 14.00 jälkeen'
  );
});

test('should edit event time', async () => {
  advanceTo('2021-04-12');
  const user = userEvent.setup();

  const initialValues = { [EVENT_FIELDS.EVENT_TIMES]: eventTimes };

  renderComponent(initialValues);

  screen.getByRole('row', {
    name: '1 11.6.2021 12.00 – 11.6.2021 15.00',
  });

  const toggleMenuButton = screen.getByRole('button', { name: /valinnat/i });
  await act(async () => await user.click(toggleMenuButton));

  const editButton = screen.getByRole('button', { name: /muokkaa/i });
  await act(async () => await user.click(editButton));

  const withinEditModal = within(
    screen.getByRole('dialog', { name: 'Muokkaa ajankohtaa' })
  );
  const startDateInput = withinEditModal.getByRole('textbox', {
    name: 'Tapahtuma alkaa *',
  });
  await act(async () => await user.click(startDateInput));
  await act(async () => await user.clear(startDateInput));
  await act(async () => await user.type(startDateInput, '2.5.2021'));

  const updateButton = screen.getByRole('button', {
    name: /tallenna muutokset/i,
  });
  await act(async () => await user.click(updateButton));

  await screen.findByRole('row', {
    name: '1 2.5.2021 12.00 – 11.6.2021 15.00',
  });
});

test('should add/delete recurring event', async () => {
  advanceTo('2021-04-12');
  const user = userEvent.setup();

  const initialValues = { [EVENT_FIELDS.RECURRING_EVENTS]: recurringEvents };

  renderComponent(initialValues);

  const recurringEventTab = getElement('recurringEventTab');
  await act(async () => await user.click(recurringEventTab));

  const tueCheckbox = getRecurringEventElement('tueCheckbox');
  const endDateInput = getRecurringEventElement('endDate');
  const endTimeInput = getRecurringEventElement('endTime');
  const startDateInput = getRecurringEventElement('startDate');
  const startTimeInput = getRecurringEventElement('startTime');

  await act(async () => await user.click(tueCheckbox));

  const dateFields = [
    { component: startDateInput, value: '23.4.2021' },
    { component: endDateInput, value: '11.5.2021' },
  ];

  for (const { component, value } of dateFields) {
    await act(async () => await user.click(component));
    await act(async () => await user.type(component, value));
  }

  const timeFields = [
    { component: startTimeInput, value: '12:00' },
    { component: endTimeInput, value: '14:00' },
  ];

  for (const { component, value } of timeFields) {
    await act(async () => await user.click(component));
    await act(async () => await user.type(component, value));
  }

  const addButton = getRecurringEventElement('addButton');

  await waitFor(() => expect(addButton).toBeEnabled());
  await act(async () => await user.click(addButton));

  await screen.findByRole('heading', {
    name: 'Ti, Viikon välein, 23.4.2021 – 11.5.2021',
  });
  screen.getByRole('heading', {
    name: 'Ma, Viikon välein, 1.5.2021 – 15.5.2021',
  });

  const deleteButton = screen.getAllByRole('button', { name: /poista/i })[0];
  await act(async () => await user.click(deleteButton));

  await waitFor(() =>
    expect(
      screen.queryByRole('heading', {
        name: 'Ti, Viikon välein, 23.4.2021 – 11.5.2021',
      })
    ).not.toBeInTheDocument()
  );
  screen.getByRole('heading', {
    name: 'Ma, Viikon välein, 1.5.2021 – 15.5.2021',
  });
});

test('should show validation error when repeat interval in invalid in recurring event form', async () => {
  advanceTo('2021-04-12');
  const user = userEvent.setup();

  renderComponent();

  const recurringEventTab = getElement('recurringEventTab');
  await act(async () => await user.click(recurringEventTab));

  const repeatIntervalInput = getRecurringEventElement('repeatInterval');
  const startDateInput = getRecurringEventElement('startDate');

  await act(async () => await user.clear(repeatIntervalInput));
  await act(async () => await user.type(repeatIntervalInput, '0'));

  await act(async () => await user.click(startDateInput));
  await screen.findByText('Arvon tulee olla vähintään 1');

  await act(async () => await user.clear(repeatIntervalInput));
  await act(async () => await user.type(repeatIntervalInput, '5'));

  await screen.findByText('Arvon tulee olla enintään 4');
});

test('should show validation error when end date is before start date in recurring event form', async () => {
  advanceTo('2021-04-12');
  const user = userEvent.setup();

  renderComponent();

  const recurringEventTab = getElement('recurringEventTab');
  await act(async () => await user.click(recurringEventTab));

  const endDateInput = getRecurringEventElement('endDate');
  const startDateInput = getRecurringEventElement('startDate');

  const dateFields = [
    { component: startDateInput, value: '11.5.2021' },
    { component: endDateInput, value: '23.4.2021' },
  ];

  for (const { component, value } of dateFields) {
    await act(async () => await user.click(component));
    await act(async () => await user.type(component, value));
    await waitFor(() => expect(component).toHaveValue(value), {
      timeout: 10000,
    });
  }

  await act(async () => await user.click(startDateInput));
  await screen.findByText('Tämän päivämäärän tulee olla 11.5.2021 jälkeen');
});

test('should show validation error when end time is before start time in recurring event form', async () => {
  advanceTo('2021-04-12');
  const user = userEvent.setup();

  await act(async () => {
    await renderComponent();
  });

  const recurringEventTab = getElement('recurringEventTab');
  await act(async () => await user.click(recurringEventTab));

  const endTimeInput = getRecurringEventElement('endTime');
  const startTimeInput = getRecurringEventElement('startTime');

  const timeFields = [
    { component: startTimeInput, value: '14.00' },
    { component: endTimeInput, value: '12.00' },
  ];

  for (const { component, value } of timeFields) {
    await act(async () => await user.click(component));
    await act(async () => await user.type(component, value));
  }

  await act(async () => await user.click(startTimeInput));
  await screen.findByText('Tämän kellonajan tulee olla 14.00 jälkeen');
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

  const singleEventStartTimeInput = await findSingleEventElement('startTime');
  expect(singleEventStartTimeInput).toBeDisabled();

  const recurringEventTab = getElement('recurringEventTab');
  await act(async () => await user.click(recurringEventTab));

  const recurringEventStartTimeInput = await findRecurringEventElement(
    'startTime'
  );
  expect(recurringEventStartTimeInput).toBeDisabled();
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

  const recurringEventTab = getElement('recurringEventTab');
  await act(async () => await user.click(recurringEventTab));

  const recurringEventStartTimeInput = await findRecurringEventElement(
    'startTime'
  );
  expect(recurringEventStartTimeInput).toBeEnabled();
});
