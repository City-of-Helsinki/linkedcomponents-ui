import { Formik } from 'formik';
import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import TimeSection from '../TimeSection';

configure({ defaultHidden: true });

const renderComponent = () =>
  render(
    <Formik
      initialValues={{
        [EVENT_FIELDS.EVENT_TIMES]: [],
        [EVENT_FIELDS.RECURRING_EVENTS]: [],
        [EVENT_FIELDS.TYPE]: EVENT_TYPE.EVENT,
      }}
      onSubmit={jest.fn()}
    >
      <TimeSection />
    </Formik>
  );

test('should change active tab', async () => {
  renderComponent();

  screen.getByRole('heading', { name: 'Syötä tapahtuman ajankohta' });
  expect(
    screen.queryByRole('heading', { name: 'Toistuva tapahtuma' })
  ).not.toBeInTheDocument();

  const recurringEventTab = screen.getByRole('tab', {
    name: /toistuva tapahtuma/i,
  });
  userEvent.click(recurringEventTab);

  expect(
    screen.queryByRole('heading', { name: 'Syötä tapahtuman ajankohta' })
  ).not.toBeInTheDocument();
  screen.getByRole('heading', { name: 'Toistuva tapahtuma' });
});
