import { Formik } from 'formik';
import React from 'react';

import { SuperEventType } from '../../../../../generated/graphql';
import { fakeEvent } from '../../../../../utils/mockDataUtils';
import { render, screen } from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import EventTime, { EventTimeProps } from '../EventTime';

const type = EVENT_TYPE.EVENT;

const defaultProps: EventTimeProps = {
  eventTimePath: 'time[0]',
  type: type,
};

const initialValues = {
  [EVENT_FIELDS.END_TIME]: new Date('2021-12-01'),
  [EVENT_FIELDS.START_TIME]: new Date('2021-12-12'),
};

const renderComponent = (props?: Partial<EventTimeProps>) =>
  render(
    <Formik initialValues={initialValues} onSubmit={jest.fn()}>
      <EventTime {...defaultProps} {...props} />
    </Formik>
  );

test('start and end times should be enabled when editing umbrella event', () => {
  renderComponent({
    savedEvent: fakeEvent({ superEventType: SuperEventType.Umbrella }),
  });

  const fields = [
    translations.event.form.labelStartTime[type],
    translations.event.form.labelEndTime[type],
  ];

  fields.forEach((name) => {
    expect(
      (screen.getByRole('textbox', { name }) as HTMLInputElement).disabled
    ).toBeFalsy();
  });
});

test('start and end times should be disabled when editing recurring event', () => {
  renderComponent({
    savedEvent: fakeEvent({ superEventType: SuperEventType.Recurring }),
  });

  const fields = [
    translations.event.form.labelStartTime[type],
    translations.event.form.labelEndTime[type],
  ];

  fields.forEach((name) => {
    expect(
      (screen.getByRole('textbox', { name }) as HTMLInputElement).disabled
    ).toBe(true);
  });
});
