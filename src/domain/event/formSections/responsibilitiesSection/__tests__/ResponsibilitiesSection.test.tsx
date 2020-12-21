import { Formik } from 'formik';
import range from 'lodash/range';
import React from 'react';

import { EventsDocument } from '../../../../../generated/graphql';
import lowerCaseFirstLetter from '../../../../../utils/lowerCaseFirstLetter';
import { fakeEvents } from '../../../../../utils/mockDataUtils';
import {
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import {
  EVENT_FIELDS,
  EVENT_INFO_LANGUAGES,
  EVENT_TYPE,
} from '../../../constants';
import ResponsibilitiesSection from '../ResponsibilitiesSection';

const type = EVENT_TYPE.EVENT;
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
        [EVENT_FIELDS.SUPER_EVENT]: null,
        [EVENT_FIELDS.TYPE]: type,
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
    const langText = lowerCaseFirstLetter(
      translations.form.inLanguage[language]
    );

    expect(
      screen.queryByLabelText(
        translations.event.form.labelProvider[type].replace(
          '{{langText}}',
          langText
        )
      )
    ).toBeInTheDocument();
  });

  expect(
    screen.queryByRole('checkbox', {
      name: translations.event.form.labelHasUmbrella[type],
    })
  ).toBeInTheDocument();

  expect(
    screen.queryByRole('checkbox', {
      name: translations.event.form.labelIsUmbrella[type],
    })
  ).toBeInTheDocument();
});

test('should render umberlla event selector if isUmbrella is checked', async () => {
  renderComponent();

  userEvent.click(
    screen.getByRole('checkbox', {
      name: translations.event.form.labelHasUmbrella[type],
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
