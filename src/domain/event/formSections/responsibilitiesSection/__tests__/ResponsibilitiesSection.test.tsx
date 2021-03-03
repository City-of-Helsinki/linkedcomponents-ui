import { Formik } from 'formik';
import range from 'lodash/range';
import React from 'react';

import {
  EventsDocument,
  SuperEventType,
} from '../../../../../generated/graphql';
import lowerCaseFirstLetter from '../../../../../utils/lowerCaseFirstLetter';
import { fakeEvent, fakeEvents } from '../../../../../utils/mockDataUtils';
import { render, screen, userEvent } from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import {
  EVENT_FIELDS,
  EVENT_INFO_LANGUAGES,
  EVENT_TYPE,
} from '../../../constants';
import { RecurringEventSettings } from '../../../types';
import ResponsibilitiesSection, {
  ResponsibilitiesSectionProps,
} from '../ResponsibilitiesSection';

const type = EVENT_TYPE.EVENT;
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

const languages: EVENT_INFO_LANGUAGES[] = [
  EVENT_INFO_LANGUAGES.FI,
  EVENT_INFO_LANGUAGES.SV,
];

type InitialValues = {
  [EVENT_FIELDS.EVENT_TIMES]: string[];
  [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: string[];
  [EVENT_FIELDS.HAS_UMBRELLA]: boolean;
  [EVENT_FIELDS.IS_UMBRELLA]: boolean;
  [EVENT_FIELDS.PUBLISHER]: string;
  [EVENT_FIELDS.RECURRING_EVENTS]: RecurringEventSettings[];
  [EVENT_FIELDS.SUPER_EVENT]: string | null;
  [EVENT_FIELDS.TYPE]: string;
};

const defaultInitialValues: InitialValues = {
  [EVENT_FIELDS.EVENT_TIMES]: [],
  [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: languages,
  [EVENT_FIELDS.HAS_UMBRELLA]: false,
  [EVENT_FIELDS.IS_UMBRELLA]: false,
  [EVENT_FIELDS.PUBLISHER]: '',
  [EVENT_FIELDS.RECURRING_EVENTS]: [],
  [EVENT_FIELDS.SUPER_EVENT]: null,
  [EVENT_FIELDS.TYPE]: type,
};

const renderComponent = (
  initialValues?: InitialValues,
  props?: Partial<ResponsibilitiesSectionProps>
) =>
  render(
    <Formik
      initialValues={initialValues || defaultInitialValues}
      onSubmit={jest.fn()}
    >
      <ResponsibilitiesSection {...props} />
    </Formik>,
    { mocks }
  );

const findElement = (
  key:
    | 'hasUmbrellaCheckbox'
    | 'isUmbrellaCheckbox'
    | 'publisherSelector'
    | 'umbrellaSelector'
) => {
  switch (key) {
    case 'hasUmbrellaCheckbox':
      return screen.findByRole('checkbox', {
        name: translations.event.form.labelHasUmbrella[type],
      });
    case 'isUmbrellaCheckbox':
      return screen.findByRole('checkbox', {
        name: translations.event.form.labelIsUmbrella[type],
      });
    case 'publisherSelector':
      return screen.findByRole('button', {
        name: translations.event.form.labelPublisher[type],
      });
    case 'umbrellaSelector':
      return screen.findByRole('combobox', {
        name: new RegExp(translations.event.form.labelUmbrellaEvent),
      });
  }
};

test('should render responsibilities section', async () => {
  renderComponent();

  languages.forEach((language) => {
    const langText = lowerCaseFirstLetter(
      translations.form.inLanguage[language]
    );

    screen.getByLabelText(
      translations.event.form.labelProvider[type].replace(
        '{{langText}}',
        langText
      )
    );
  });

  await findElement('publisherSelector');
  await findElement('hasUmbrellaCheckbox');
  await findElement('isUmbrellaCheckbox');
});

test('should render umbrella event selector if hasUmbrella is checked', async () => {
  renderComponent();

  const hasUmbrellaCheckbox = await findElement('hasUmbrellaCheckbox');
  userEvent.click(hasUmbrellaCheckbox);

  await findElement('umbrellaSelector');
});

test('should uncheck isUmbrella checkbox if eventTimes is not empty', async () => {
  renderComponent({
    ...defaultInitialValues,
    isUmbrella: true,
    eventTimes: ['123'],
  });

  const isUmbrellaCheckbox = await findElement('isUmbrellaCheckbox');
  expect(isUmbrellaCheckbox).not.toBeChecked();
});

test('should uncheck isUmbrella checkbox if recurringsEvents is not empty', async () => {
  renderComponent({
    ...defaultInitialValues,
    isUmbrella: true,
    recurringEvents: [
      {
        endDate: new Date(),
        endTime: '14:15',
        repeatDays: [],
        repeatInterval: 1,
        startDate: new Date(),
        startTime: '12:15',
      },
    ],
  });

  const isUmbrellaCheckbox = await findElement('isUmbrellaCheckbox');
  expect(isUmbrellaCheckbox).not.toBeChecked();
});

test('should show link to super event if super event type is recurring', async () => {
  renderComponent(
    {
      ...defaultInitialValues,
    },
    {
      savedEvent: fakeEvent({
        superEvent: fakeEvent({ superEventType: SuperEventType.Recurring }),
      }),
    }
  );

  await findElement('publisherSelector');

  screen.getByText(translations.event.form.infoTextUmbrellaSubEvent);
});
