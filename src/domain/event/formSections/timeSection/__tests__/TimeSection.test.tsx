import { Formik } from 'formik';
import { advanceTo, clear } from 'jest-date-mock';
import React from 'react';

import { WEEK_DAY } from '../../../../../constants';
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
import TimeSection from '../TimeSection';

configure({ defaultHidden: true });

const type = EVENT_TYPE.EVENT;

const defaultInitialValue = {
  [EVENT_FIELDS.END_TIME]: null,
  [EVENT_FIELDS.EVENT_TIMES]: [],
  [EVENT_FIELDS.RECURRING_EVENTS]: [],
  [EVENT_FIELDS.START_TIME]: null,
  [EVENT_FIELDS.TYPE]: type,
};

const renderTimeSection = (initialValues?: Partial<EventFormFields>) =>
  render(
    <Formik
      initialValues={{
        ...defaultInitialValue,
        ...initialValues,
      }}
      onSubmit={jest.fn()}
      validationSchema={eventValidationSchema}
    >
      <TimeSection />
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
    translations.event.form.infoTextEventTimes5[type],
  ];

  texts.forEach((text) => {
    expect(screen.queryByText(text)).toBeInTheDocument();
  });

  const fields = [
    translations.event.form.labelStartTime[type],
    translations.event.form.labelEndTime[type],
  ];

  fields.forEach((name) => {
    screen.queryByRole('textbox', { name });
  });

  const buttons = [
    translations.event.form.buttonAddEventTime,
    translations.event.form.buttonAddRecurringEvent,
  ];

  buttons.forEach((name) => {
    screen.queryByRole('button', { name });
  });
});

test('should show error message when end time is before start time', async () => {
  advanceTo('2020-11-04');
  renderTimeSection();

  const startTime = '07.11.2020 15.00';
  const endTime = '07.11.2020 12.00';
  const startInput = screen.getByRole('textbox', {
    name: translations.event.form.labelStartTime[type],
  });
  const endInput = screen.getByRole('textbox', {
    name: translations.event.form.labelEndTime[type],
  });

  userEvent.click(startInput);
  userEvent.type(startInput, startTime);
  userEvent.click(endInput);

  expect(startInput).toHaveValue(startTime);

  userEvent.type(endInput, endTime);
  userEvent.tab();

  expect(endInput).toHaveValue(endTime);

  await waitFor(() => {
    expect(
      screen.queryByText(
        translations.form.validation.date.after.replace('{{after}}', startTime)
      )
    ).toBeInTheDocument();
  });
});

test('should add and delete event time', async () => {
  renderTimeSection();
  const startTimeName = translations.event.form.labelStartTime[type];
  const endTimeName = translations.event.form.labelEndTime[type];

  expect(screen.getAllByRole('textbox', { name: startTimeName })).toHaveLength(
    1
  );
  expect(screen.getAllByRole('textbox', { name: endTimeName })).toHaveLength(1);

  const addButton = screen.getByRole('button', {
    name: translations.event.form.buttonAddEventTime,
  });
  userEvent.click(addButton);

  expect(screen.getAllByRole('textbox', { name: startTimeName })).toHaveLength(
    2
  );
  expect(screen.getAllByRole('textbox', { name: endTimeName })).toHaveLength(2);

  const deleteButton = screen.getByRole('button', {
    name: translations.event.form.buttonDeleteEventTime,
  });
  userEvent.click(deleteButton);

  expect(screen.getAllByRole('textbox', { name: startTimeName })).toHaveLength(
    1
  );
  expect(screen.getAllByRole('textbox', { name: endTimeName })).toHaveLength(1);
});

test('should open recurring event settings modal and close it with close button', async () => {
  renderTimeSection();

  const modalTitleText = translations.event.form.modalTitleRecurringEvent;

  expect(
    screen.queryByRole('heading', { name: modalTitleText })
  ).not.toBeInTheDocument();

  userEvent.click(
    screen.queryByRole('button', {
      name: translations.event.form.buttonOpenRecurringEventSettings,
    })
  );

  expect(
    screen.queryByRole('heading', { name: modalTitleText })
  ).toBeInTheDocument();

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
    'Viikon välein Ma, Ti, Ke, To, Pe, La ja Su, Ajalla 10.12.2020 – 12.12.2021, 12.30 – 14.00';

  // Should not show recurring event details
  infoCells.forEach((text) => {
    expect(
      screen.queryByRole('cell', { name: text, hidden: false })
    ).not.toBeInTheDocument();
  });

  const toggleButton = screen.getByRole('button', {
    name: toggleButtonText,
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
  infoCells.forEach((text) => {
    expect(
      screen.queryByRole('cell', { name: text, hidden: false })
    ).not.toBeInTheDocument();
  });

  userEvent.click(
    screen.getByRole('button', {
      name: translations.event.form.buttonDeleteRecurringEvent,
    })
  );

  // Recurring event should be removed
  expect(
    screen.queryByRole('button', {
      name: toggleButtonText,
    })
  ).not.toBeInTheDocument();
});

test('should add new recurring event', async () => {
  advanceTo('2020-11-04');
  renderTimeSection();

  userEvent.click(
    screen.getByRole('button', {
      name: translations.event.form.buttonOpenRecurringEventSettings,
    })
  );

  const modalTitleText = translations.event.form.modalTitleRecurringEvent;
  await waitFor(() => {
    expect(
      screen.queryByRole('heading', { name: modalTitleText })
    ).toBeInTheDocument();
  });

  userEvent.click(screen.getByRole('checkbox', { name: /ma/i }));

  const startDateInput = screen.getByRole('textbox', {
    name: translations.event.form.labelRecurringEventStartDate,
  });
  userEvent.click(startDateInput);
  userEvent.type(startDateInput, '18.11.2020');

  const endDateInput = screen.getByRole('textbox', {
    name: translations.event.form.labelRecurringEventEndDate,
  });
  userEvent.click(endDateInput);
  userEvent.type(endDateInput, '25.09.2021');

  const startTimeInput = screen.getByRole('textbox', {
    name: translations.event.form.labelRecurringEventStartTime[type],
  });
  userEvent.click(startTimeInput);
  userEvent.type(startTimeInput, '12.30');

  const endTimeInput = screen.getByRole('textbox', {
    name: translations.event.form.labelRecurringEventEndTime[type],
  });
  userEvent.click(endTimeInput);
  userEvent.type(endTimeInput, '14.00');

  userEvent.click(startTimeInput);
  userEvent.click(
    screen.getByRole('button', {
      name: translations.event.form.buttonAddRecurringEvent,
    })
  );

  await waitFor(() => {
    expect(
      screen.queryByRole('heading', { name: modalTitleText })
    ).not.toBeInTheDocument();
  });

  expect(
    screen.getByRole('button', {
      name: 'Viikon välein Ma, Ajalla 18.11.2020 – 25.09.2021, 12.30 – 14.00',
    })
  ).toBeInTheDocument();
});
