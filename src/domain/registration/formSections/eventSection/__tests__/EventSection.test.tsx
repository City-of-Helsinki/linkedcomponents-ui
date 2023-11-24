/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik } from 'formik';
import * as formik from 'formik';
import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import { REGISTRATION_FIELDS } from '../../../constants';
import {
  event,
  eventName,
  mockedEventResponse,
  mockedEventsResponse,
  mockedFilteredEventsResponse,
} from '../__mocks__/eventSection';
import EventSection from '../EventSection';

configure({ defaultHidden: true });

type InitialValues = {
  [REGISTRATION_FIELDS.EVENT]: string | null;
};

const defaultInitialValues: InitialValues = {
  [REGISTRATION_FIELDS.EVENT]: null,
};

const mocks = [
  mockedEventResponse,
  mockedEventsResponse,
  mockedFilteredEventsResponse,
];

const renderComponent = (initialValues?: Partial<InitialValues>) => {
  return render(
    <Formik
      initialValues={{ ...defaultInitialValues, ...initialValues }}
      onSubmit={vi.fn()}
      enableReinitialize={true}
    >
      <EventSection isEditingAllowed={true} />
    </Formik>,
    { mocks }
  );
};

const getElement = (key: 'inputField' | 'toggleButton') => {
  switch (key) {
    case 'inputField':
      return screen.getByRole('combobox', { name: 'Tapahtuma *' });
    case 'toggleButton':
      return screen.getByRole('button', { name: 'Tapahtuma: Valikko' });
  }
};

test('should copy values from event to registration form when event is selected', async () => {
  const setValues = vi.fn();
  vi.spyOn(formik, 'useFormikContext').mockReturnValue({
    setValues,
    values: {},
  } as any);
  const user = userEvent.setup();
  renderComponent();

  const toggleButton = getElement('toggleButton');
  await user.click(toggleButton);

  const eventOption = await screen.findByRole('option', {
    name: new RegExp(eventName),
  });
  await user.click(eventOption);
  expect(setValues).toBeCalledWith({
    audienceMaxAge: 18,
    audienceMinAge: 12,
    enrolmentEndTimeDate: new Date('2022-12-10T12:00:00.000Z'),
    enrolmentEndTimeTime: '12:00',
    enrolmentStartTimeDate: new Date('2022-12-01T09:00:00.000Z'),
    enrolmentStartTimeTime: '09:00',
    event: event.atId,
    maximumAttendeeCapacity: 10,
    minimumAttendeeCapacity: 5,
  });
});

test('should clear values from registration form when event is unselected', async () => {
  const setValues = vi.fn();
  vi.spyOn(formik, 'useFormikContext').mockReturnValue({
    setValues,
    values: { event: event.atId },
  } as any);
  const user = userEvent.setup();
  renderComponent({ event: event.atId });

  const inputField = getElement('inputField');
  await waitFor(() => expect(inputField).toHaveValue('Event name 13.7.2020 –'));
  await user.clear(inputField);

  await waitFor(() =>
    expect(setValues).toBeCalledWith({
      audienceMaxAge: '',
      audienceMinAge: '',
      enrolmentEndTimeDate: null,
      enrolmentEndTimeTime: '',
      enrolmentStartTimeDate: null,
      enrolmentStartTimeTime: '',
      event: '',
      maximumAttendeeCapacity: '',
      minimumAttendeeCapacity: '',
    })
  );
});
