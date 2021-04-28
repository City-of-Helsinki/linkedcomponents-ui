import { Formik } from 'formik';
import React from 'react';

import { EventType } from '../../../../../generated/graphql';
import { render, screen } from '../../../../../utils/testUtils';
import { EVENT_FIELDS } from '../../../constants';
import SummarySection from '../SummarySection';

const eventType = EventType.General;

const initialValues = {
  [EVENT_FIELDS.IS_VERIFIED]: false,
  [EVENT_FIELDS.TYPE]: eventType,
};

const renderComponent = () =>
  render(
    <Formik initialValues={initialValues} onSubmit={jest.fn()}>
      <SummarySection />
    </Formik>
  );

test('should render summary section', () => {
  renderComponent();

  expect(
    screen.getByRole('link', {
      name: 'koskevia ohjeita ja säädöksiä (avataan uudessa välilehdessä)',
    })
  ).toBeInTheDocument();
});
