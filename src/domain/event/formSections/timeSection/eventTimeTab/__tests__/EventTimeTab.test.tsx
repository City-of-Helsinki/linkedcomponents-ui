import { Formik } from 'formik';
import React from 'react';
import { vi } from 'vitest';

import {
  configure,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../../../../utils/testUtils';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../../constants';
import { EventTime, RecurringEventSettings } from '../../../../types';
import { publicEventSchema } from '../../../../validation';
import {
  TimeSectionContext,
  timeSectionContextDefaultValue,
  TimeSectionProvider,
} from '../../TimeSectionContext';
import EventTimeTab from '../EventTimeTab';

configure({ defaultHidden: true });

beforeEach(() => {
  vi.useRealTimers();
});

const type = EVENT_TYPE.General;

type InitialValues = {
  [EVENT_FIELDS.EVENT_TIMES]: EventTime[];
  [EVENT_FIELDS.EVENTS]: EventTime[];
  [EVENT_FIELDS.IS_UMBRELLA]: boolean;
  [EVENT_FIELDS.RECURRING_EVENTS]: RecurringEventSettings[];
  [EVENT_FIELDS.TYPE]: string;
};
const defaultInitialValue: InitialValues = {
  [EVENT_FIELDS.EVENT_TIMES]: [],
  [EVENT_FIELDS.EVENTS]: [],
  [EVENT_FIELDS.IS_UMBRELLA]: false,
  [EVENT_FIELDS.RECURRING_EVENTS]: [],
  [EVENT_FIELDS.TYPE]: type,
};

const eventTimes = [
  {
    id: null,
    endTime: new Date('2021-06-11T15:00:00.000Z'),
    startTime: new Date('2021-06-11T12:00:00.000Z'),
  },
];

const renderComponent = (initialValues?: Partial<typeof defaultInitialValue>) =>
  render(
    <Formik
      initialValues={{ ...defaultInitialValue, ...initialValues }}
      onSubmit={vi.fn()}
      validationSchema={publicEventSchema}
    >
      <TimeSectionProvider isEditingAllowed>
        <EventTimeTab />
      </TimeSectionProvider>
    </Formik>
  );

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
      return screen.getByLabelText(/Tapahtuma päättyy/i);
    case 'endTime':
      const endTimeGroup = screen.getByRole('group', {
        name: /päättymisaika/i,
      });
      return within(endTimeGroup).getByLabelText('tunnit');
    case 'toggle':
      return screen.getAllByRole('button', { name: /valinnat/i })[0];
    case 'startDate':
      return screen.getByLabelText(/Tapahtuma alkaa/i);
    case 'startTime':
      const startTimeGroup = screen.getByRole('group', {
        name: /alkamisaika/i,
      });
      return within(startTimeGroup).getByLabelText('tunnit');
  }
};

const enterFormValues = async ({
  endDate,
  endTime,
  startDate,
  startTime,
}: {
  endDate: string;
  endTime: string;
  startDate: string;
  startTime: string;
}) => {
  const user = userEvent.setup();

  const startDateInput = getSingleEventElement('startDate');
  const endDateInput = getSingleEventElement('endDate');
  const startTimeInput = getSingleEventElement('startTime');
  const endTimeInput = getSingleEventElement('endTime');

  fireEvent.change(startDateInput, { target: { value: startDate } });
  fireEvent.change(endDateInput, { target: { value: endDate } });

  const timeFields = [
    { component: startTimeInput, value: startTime },
    { component: endTimeInput, value: endTime },
  ];

  for (const { component, value } of timeFields) {
    await user.click(component);
    await user.type(component, value);
  }
};

test('should add/delete event time', async () => {
  vi.setSystemTime('2021-04-12');
  const user = userEvent.setup();

  const initialValues = { [EVENT_FIELDS.EVENT_TIMES]: eventTimes };

  renderComponent(initialValues);

  await enterFormValues({
    endDate: '14.4.2021',
    endTime: '14.00',
    startDate: '14.4.2021',
    startTime: '12.00',
  });

  const addButton = getSingleEventElement('addButton');
  await waitFor(() => expect(addButton).toBeEnabled());
  await user.click(addButton);

  await screen.findByRole('row', {
    name: '1 14.4.2021 12.00 – 14.4.2021 14.00',
  });
  screen.getByRole('row', {
    name: '2 11.6.2021 12.00 – 11.6.2021 15.00',
  });

  const toggleButton = getSingleEventElement('toggle');
  await user.click(toggleButton);

  const deleteButton = getSingleEventElement('delete');
  await user.click(deleteButton);

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

test('should edit event time', async () => {
  vi.setSystemTime('2021-04-12');
  const user = userEvent.setup();

  const initialValues = { [EVENT_FIELDS.EVENT_TIMES]: eventTimes };

  renderComponent(initialValues);

  screen.getByRole('row', {
    name: '1 11.6.2021 12.00 – 11.6.2021 15.00',
  });

  const toggleMenuButton = screen.getByRole('button', { name: /valinnat/i });
  await user.click(toggleMenuButton);

  const editButton = screen.getByRole('button', { name: /muokkaa/i });
  await user.click(editButton);

  const withinEditModal = within(
    screen.getByRole('dialog', { name: 'Muokkaa ajankohtaa' })
  );
  const startDateInput = withinEditModal.getByLabelText(/Tapahtuma alkaa/i);
  await user.click(startDateInput);
  await user.clear(startDateInput);
  await user.type(startDateInput, '2.5.2021');

  const updateButton = screen.getByRole('button', {
    name: /tallenna muutokset/i,
  });
  await user.click(updateButton);

  await screen.findByRole('row', {
    name: '1 2.5.2021 12.00 – 11.6.2021 15.00',
  });
});

test('should show validation error when end time is before start time in new event time', async () => {
  vi.setSystemTime('2021-04-12');
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
    await user.click(component);
    await user.type(component, value);
  }

  await screen.findByText(
    'Tämän päivämäärän tulee olla 14.4.2021 14.00 jälkeen'
  );
});

test('should set isUmbrella to false when adding more than 1 event time', async () => {
  vi.setSystemTime('2021-04-12');
  const user = userEvent.setup();
  const setIsUmbrella = vi.fn();

  render(
    <Formik
      initialValues={{
        ...defaultInitialValue,
        isUmbrella: true,
        [EVENT_FIELDS.EVENT_TIMES]: eventTimes,
      }}
      onSubmit={vi.fn()}
      validationSchema={publicEventSchema}
    >
      <TimeSectionContext.Provider
        value={{
          ...timeSectionContextDefaultValue,
          eventTimes,
          isUmbrella: true,
          setIsUmbrella,
        }}
      >
        <EventTimeTab />
      </TimeSectionContext.Provider>
    </Formik>
  );

  await enterFormValues({
    endDate: '14.4.2021',
    endTime: '14.00',
    startDate: '14.4.2021',
    startTime: '12.00',
  });

  const addButton = getSingleEventElement('addButton');
  await waitFor(() => expect(addButton).toBeEnabled());
  await user.click(addButton);

  expect(setIsUmbrella).toBeCalledWith(false);
});
