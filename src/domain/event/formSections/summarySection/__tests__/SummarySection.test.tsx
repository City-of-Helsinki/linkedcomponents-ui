import { Formik } from 'formik';
import React from 'react';
import { vi } from 'vitest';

import { render, screen } from '../../../../../utils/testUtils';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import SummarySection from '../SummarySection';

const eventType = EVENT_TYPE.General;

const initialValues = {
  [EVENT_FIELDS.IS_VERIFIED]: false,
  [EVENT_FIELDS.TYPE]: eventType,
};

const renderComponent = () =>
  render(
    <Formik initialValues={initialValues} onSubmit={vi.fn()}>
      <SummarySection isEditingAllowed={true} />
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
