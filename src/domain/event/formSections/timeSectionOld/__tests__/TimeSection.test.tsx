import { Formik } from 'formik';
import { advanceTo, clear } from 'jest-date-mock';
import React from 'react';

import { WEEK_DAY } from '../../../../../constants';
import { fakeEvent } from '../../../../../utils/mockDataUtils';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import { EventFormFields } from '../../../types';
import { eventValidationSchema } from '../../../utils';
import TimeSection, { TimeSectionProps } from '../TimeSection';

configure({ defaultHidden: true });

const type = EVENT_TYPE.EVENT;

const defaultInitialValue = {
  [EVENT_FIELDS.END_TIME]: null,
  [EVENT_FIELDS.EVENT_TIMES]: [],
  [EVENT_FIELDS.RECURRING_EVENTS]: [],
  [EVENT_FIELDS.START_TIME]: null,
  [EVENT_FIELDS.TYPE]: type,
};

const renderTimeSection = (
  initialValues?: Partial<EventFormFields>,
  props?: TimeSectionProps
) =>
  render(
    <Formik
      initialValues={{
        ...defaultInitialValue,
        ...initialValues,
      }}
      onSubmit={jest.fn()}
      validationSchema={eventValidationSchema}
    >
      <TimeSection {...props} />
    </Formik>
  );

afterAll(() => {
  clear();
});

test('should render TimeSection', () => {
  renderTimeSection();

  //  Notification title is same as section title
  expect(
    screen.queryAllByRole('heading', {
      name: translations.event.form.titleTime[type],
    })
  ).toHaveLength(2);

  const texts = [
    translations.event.form.infoTextEventTimes1[type],
    translations.event.form.infoTextEventTimes2[type],
    translations.event.form.infoTextEventTimes3[type],
    translations.event.form.infoTextEventTimes4[type],
    translations.event.form.infoTextEventTimes5,
  ];

  texts.forEach((text) => {
    screen.getByText(text);
  });

  const fields = [
    translations.event.form.labelStartTime[type],
    translations.event.form.labelEndTime[type],
  ];

  fields.forEach((name) => {
    screen.getByRole('textbox', { name });
  });

  const buttons = [
    translations.event.form.buttonAddEventTime,
    translations.event.form.buttonOpenRecurringEventSettings[type],
  ];

  buttons.forEach((name) => {
    screen.getByRole('button', { name });
  });
});

test('add button should be disabled when editing existing event', async () => {
  renderTimeSection(undefined, { savedEvent: fakeEvent() });
  const addButton = screen.getByRole('button', {
    name: translations.event.form.buttonAddEventTime,
  });
  const addRecurringEventButton = screen.getByRole('button', {
    name: translations.event.form.buttonOpenRecurringEventSettings[type],
  });
  expect((addButton as HTMLButtonElement).disabled).toBe(true);
  expect((addRecurringEventButton as HTMLButtonElement).disabled).toBe(true);
});

test('should add and delete event time', async () => {
  renderTimeSection();
  const startTimeName = translations.event.form.labelStartTime[type];
  const endTimeName = translations.event.form.labelEndTime[type];

  expect(
    screen.queryAllByRole('textbox', { name: startTimeName })
  ).toHaveLength(1);
  expect(screen.queryAllByRole('textbox', { name: endTimeName })).toHaveLength(
    1
  );

  const addButton = screen.getByRole('button', {
    name: translations.event.form.buttonAddEventTime,
  });
  userEvent.click(addButton);

  expect(
    screen.queryAllByRole('textbox', { name: startTimeName })
  ).toHaveLength(2);
  expect(screen.queryAllByRole('textbox', { name: endTimeName })).toHaveLength(
    2
  );

  const deleteButton = screen.getByRole('button', {
    name: translations.event.form.buttonDeleteEventTime,
  });
  userEvent.click(deleteButton);

  expect(
    screen.queryAllByRole('textbox', { name: startTimeName })
  ).toHaveLength(1);
  expect(screen.queryAllByRole('textbox', { name: endTimeName })).toHaveLength(
    1
  );
});

test('should open recurring event settings modal and close it with close button', async () => {
  renderTimeSection();

  const modalTitleText = translations.event.form.modalTitleRecurringEvent[type];

  expect(
    screen.queryByRole('heading', { name: modalTitleText })
  ).not.toBeInTheDocument();

  userEvent.click(
    screen.queryByRole('button', {
      name: translations.event.form.buttonOpenRecurringEventSettings[type],
    })
  );

  screen.getByRole('heading', { name: modalTitleText });

  userEvent.click(
    screen.queryByRole('button', {
      name: translations.common.close,
    })
  );

  expect(
    screen.queryByRole('heading', { name: modalTitleText })
  ).not.toBeInTheDocument();
});

test('should render recurring event settings info and delete it with delete button', async () => {
  advanceTo('2020-11-04');
  renderTimeSection({
    [EVENT_FIELDS.RECURRING_EVENTS]: [
      {
        endDate: new Date('2021-12-12'),
        endTime: '14.00',
        eventTimes: [],
        repeatDays: [
          WEEK_DAY.SUN,
          WEEK_DAY.SAT,
          WEEK_DAY.FRI,
          WEEK_DAY.THU,
          WEEK_DAY.WED,
          WEEK_DAY.TUE,
          WEEK_DAY.MON,
        ],
        repeatInterval: 1,
        startDate: new Date('2020-12-10'),
        startTime: '12.30',
      },
    ],
  });

  const infoCells = [
    'Viikon välein',
    'Maanantai, Tiistai, Keskiviikko, Torstai, Perjantai, Lauantai ja Sunnuntai',
    'klo 12.30',
    'klo 14.00',
    '10.12.2020',
    '12.12.2021',
  ];

  const toggleButtonText =
    'Viikon välein Ma, Ti, Ke, To, Pe, La ja Su, 10.12.2020 – 12.12.2021, 12.30 – 14.00';

  // Should not show recurring event details
  expect(
    screen.queryByRole('cell', { name: 'Viikon välein', hidden: false })
  ).not.toBeInTheDocument();

  const toggleButton = screen.getByRole('button', {
    name: toggleButtonText,
  });
  const deleteButton = screen.getByRole('button', {
    name: translations.event.form.buttonDeleteRecurringEvent,
  });

  userEvent.click(toggleButton);

  // Should show recurring event details
  infoCells.forEach((text) => {
    expect(
      screen.queryByRole('cell', { name: text, hidden: false })
    ).toBeInTheDocument();
  });

  userEvent.click(toggleButton);

  // Should not show recurring event details
  expect(
    screen.queryByRole('cell', { name: 'Viikon välein', hidden: false })
  ).not.toBeInTheDocument();

  userEvent.click(deleteButton);

  // Recurring event should be removed
  expect(toggleButton).not.toBeInTheDocument();
});

test('should add new recurring event', async () => {
  advanceTo('2020-11-04');
  renderTimeSection();

  userEvent.click(
    screen.getByRole('button', {
      name: translations.event.form.buttonOpenRecurringEventSettings[type],
    })
  );

  const modalTitleText = translations.event.form.modalTitleRecurringEvent[type];
  await screen.findByRole('heading', { name: modalTitleText });

  userEvent.click(screen.getByRole('checkbox', { name: /ma/i }));

  const fields = [
    {
      name: translations.event.form.labelRecurringEventStartDate,
      value: '18.11.2020',
    },
    {
      name: translations.event.form.labelRecurringEventEndDate,
      value: '25.09.2021',
    },
    {
      name: translations.event.form.labelRecurringEventStartTime[type],
      value: '12.30',
    },
    {
      name: translations.event.form.labelRecurringEventEndTime[type],
      value: '14.00',
    },
  ];

  for (const { name, value } of fields) {
    const input = screen.getByRole('textbox', { name });
    userEvent.click(input);
    userEvent.type(input, value);

    await waitFor(() => {
      expect(input).toHaveValue(value);
    });
  }

  userEvent.click(
    screen.getByRole('button', {
      name: translations.event.form.buttonAddRecurringEvent[type],
    })
  );

  await screen.findByRole('button', {
    name: 'Viikon välein Ma, 18.11.2020 – 25.09.2021, 12.30 – 14.00',
  });
});
