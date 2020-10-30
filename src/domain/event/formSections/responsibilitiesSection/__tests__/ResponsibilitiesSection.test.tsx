import { Formik } from 'formik';
import range from 'lodash/range';
import React from 'react';

import { EventsDocument } from '../../../../../generated/graphql';
import { fakeEvents } from '../../../../../utils/mockDataUtils';
import {
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import { EVENT_FIELDS, EVENT_INFO_LANGUAGES } from '../../../constants';
import ResponsibilitiesSection from '../ResponsibilitiesSection';

const eventNames = range(1, 6).map((val) => `Event name ${val}`);
const events = fakeEvents(
  eventNames.length,
  eventNames.map((name) => ({ name: { fi: name } }))
);
const eventsResponse = { data: { events } };

const eventsVariables = {
  createPath: undefined,
  superEventType: ['umbrella'],
  text: '',
};
const mocks = [
  {
    request: {
      query: EventsDocument,
      variables: eventsVariables,
    },
    result: eventsResponse,
  },
];

const languages: EVENT_INFO_LANGUAGES[] = [
  EVENT_INFO_LANGUAGES.FI,
  EVENT_INFO_LANGUAGES.SV,
];

const renderComponent = () =>
  render(
    <Formik
      initialValues={{
        [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: languages,
        [EVENT_FIELDS.HAS_UMBRELLA]: false,
        [EVENT_FIELDS.IS_UMBRELLA]: false,
        [EVENT_FIELDS.UMBRELLA_EVENT]: null,
      }}
      onSubmit={jest.fn()}
    >
      <ResponsibilitiesSection />
    </Formik>,
    { mocks }
  );

test('should render responsibilities section', () => {
  renderComponent();

  languages.forEach((language) => {
    expect(
      screen.queryByPlaceholderText(
        translations.event.form.placeholderProvider[language]
      )
    ).toBeInTheDocument();
  });

  expect(
    screen.queryByRole('checkbox', {
      name: translations.event.form.labelHasUmbrella,
    })
  ).toBeInTheDocument();

  expect(
    screen.queryByRole('checkbox', {
      name: translations.event.form.labelIsUmbrella,
    })
  ).toBeInTheDocument();
});

test('should render umberlla event selector if isUmbrella is checked', async () => {
  renderComponent();

  userEvent.click(
    screen.getByRole('checkbox', {
      name: translations.event.form.labelHasUmbrella,
    })
  );

  await waitFor(() => {
    expect(
      screen.queryByRole('combobox', {
        name: new RegExp(translations.event.form.labelUmbrellaEvent),
      })
    ).toBeInTheDocument();
  });
});
