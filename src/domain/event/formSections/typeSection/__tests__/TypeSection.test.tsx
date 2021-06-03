import { Formik } from 'formik';
import range from 'lodash/range';
import React from 'react';

import {
  EventsDocument,
  SuperEventType,
} from '../../../../../generated/graphql';
import { fakeEvent, fakeEvents } from '../../../../../utils/mockDataUtils';
import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import { EventTime, RecurringEventSettings } from '../../../types';
import TypeSection, { TypeSectionProps } from '../TypeSection';

configure({ defaultHidden: true });

const type = EVENT_TYPE.General;

const eventNames = range(1, 6).map((val) => `Event name ${val}`);
const events = fakeEvents(
  eventNames.length,
  eventNames.map((name) => ({ name: { fi: name } }))
);

const eventsVariables = {
  createPath: undefined,
  superEventType: ['umbrella'],
  text: '',
};
const eventsResponse = { data: { events } };
const mockedEventsResponse = {
  request: {
    query: EventsDocument,
    variables: eventsVariables,
  },
  result: eventsResponse,
};

const mocks = [mockedEventsResponse];

type InitialValues = {
  [EVENT_FIELDS.EVENT_TIMES]: EventTime[];
  [EVENT_FIELDS.HAS_UMBRELLA]: boolean;
  [EVENT_FIELDS.IS_UMBRELLA]: boolean;
  [EVENT_FIELDS.RECURRING_EVENTS]: RecurringEventSettings[];
  [EVENT_FIELDS.SUPER_EVENT]: string | null;
  [EVENT_FIELDS.TYPE]: string;
};

const defaultInitialValues: InitialValues = {
  [EVENT_FIELDS.EVENT_TIMES]: [],
  [EVENT_FIELDS.HAS_UMBRELLA]: false,
  [EVENT_FIELDS.IS_UMBRELLA]: false,
  [EVENT_FIELDS.RECURRING_EVENTS]: [],
  [EVENT_FIELDS.SUPER_EVENT]: null,
  [EVENT_FIELDS.TYPE]: type,
};

const renderComponent = (
  initialValues?: InitialValues,
  props?: Partial<TypeSectionProps>
) =>
  render(
    <Formik
      initialValues={initialValues || defaultInitialValues}
      onSubmit={jest.fn()}
    >
      <TypeSection {...props} />
    </Formik>,
    { mocks }
  );

const findElement = (key: 'isUmbrellaCheckbox') => {
  switch (key) {
    case 'isUmbrellaCheckbox':
      return screen.findByRole('checkbox', {
        name: translations.event.form.labelIsUmbrella[type],
      });
  }
};

const getElement = (key: 'hasUmbrellaCheckbox' | 'umbrellaSelector') => {
  switch (key) {
    case 'hasUmbrellaCheckbox':
      return screen.getByRole('checkbox', {
        name: translations.event.form.labelHasUmbrella[type],
      });
    case 'umbrellaSelector':
      return screen.getByRole('combobox', {
        name: new RegExp(translations.event.form.labelUmbrellaEvent),
      });
  }
};

test('should render type section', async () => {
  renderComponent();

  getElement('hasUmbrellaCheckbox');
  await findElement('isUmbrellaCheckbox');
});

test('should render umbrella event selector if hasUmbrella is checked', async () => {
  renderComponent();

  const hasUmbrellaCheckbox = getElement('hasUmbrellaCheckbox');
  userEvent.click(hasUmbrellaCheckbox);

  getElement('umbrellaSelector');
});

test('should disable isUmbrella checkbox if hasUmbrella checkbox is checked', async () => {
  renderComponent({ ...defaultInitialValues, hasUmbrella: true });

  const isUmbrellaCheckbox = await findElement('isUmbrellaCheckbox');
  expect(isUmbrellaCheckbox).toBeDisabled();
});

test('should disable isUmbrella checkbox if saved umbrella event has at least one sub-event', async () => {
  renderComponent(
    { ...defaultInitialValues, isUmbrella: true },
    {
      savedEvent: fakeEvent({
        superEventType: SuperEventType.Umbrella,
        subEvents: [fakeEvent()],
      }),
    }
  );

  const isUmbrellaCheckbox = await findElement('isUmbrellaCheckbox');
  expect(isUmbrellaCheckbox).toBeChecked();
  expect(isUmbrellaCheckbox).toBeDisabled();
});

test('should disable isUmbrella checkbox when editing recurring event', async () => {
  renderComponent(undefined, {
    savedEvent: fakeEvent({ superEventType: SuperEventType.Recurring }),
  });

  const isUmbrellaCheckbox = await findElement('isUmbrellaCheckbox');
  expect(isUmbrellaCheckbox).not.toBeChecked();
  expect(isUmbrellaCheckbox).toBeDisabled();
});

test('should uncheck isUmbrella checkbox if there is more than 1 event time', async () => {
  renderComponent({
    ...defaultInitialValues,
    isUmbrella: true,
    eventTimes: [
      { id: null, endTime: new Date(), startTime: new Date() },
      { id: null, endTime: new Date(), startTime: new Date() },
    ],
  });

  const isUmbrellaCheckbox = await findElement('isUmbrellaCheckbox');
  expect(isUmbrellaCheckbox).not.toBeChecked();
});

test('should uncheck isUmbrella checkbox if there is more than 1 event times', async () => {
  renderComponent({
    ...defaultInitialValues,
    isUmbrella: true,
    recurringEvents: [
      {
        endDate: new Date(),
        endTime: '12.00',
        eventTimes: [
          { id: null, endTime: new Date(), startTime: new Date() },
          { id: null, endTime: new Date(), startTime: new Date() },
        ],
        repeatDays: [],
        repeatInterval: 1,
        startDate: new Date(),
        startTime: '11.00',
      },
    ],
  });

  const isUmbrellaCheckbox = await findElement('isUmbrellaCheckbox');
  expect(isUmbrellaCheckbox).not.toBeChecked();
});

test('should show link to super event if super event type is recurring', async () => {
  renderComponent(undefined, {
    savedEvent: fakeEvent({
      superEvent: fakeEvent({ superEventType: SuperEventType.Recurring }),
    }),
  });

  screen.getByText(translations.event.form.infoTextUmbrellaSubEvent);
});
