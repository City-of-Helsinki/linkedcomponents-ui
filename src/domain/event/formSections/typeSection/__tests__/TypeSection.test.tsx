import { Formik } from 'formik';
import React from 'react';

import { SuperEventType } from '../../../../../generated/graphql';
import { fakeEvent } from '../../../../../utils/mockDataUtils';
import { configure, render, screen } from '../../../../../utils/testUtils';
import { mockedUmbrellaEventsResponse } from '../../../__mocks__/createEventPage';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import { EventTime, RecurringEventSettings } from '../../../types';
import TypeSection, { TypeSectionProps } from '../TypeSection';

configure({ defaultHidden: true });

const type = EVENT_TYPE.General;

const mocks = [mockedUmbrellaEventsResponse];

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
      onSubmit={vi.fn()}
    >
      <TypeSection {...props} isEditingAllowed={true} isExternalUser={false} />
    </Formik>,
    { mocks }
  );

const findElement = (key: 'isUmbrellaCheckbox' | 'umbrellaSelector') => {
  switch (key) {
    case 'isUmbrellaCheckbox':
      return screen.findByRole('checkbox', {
        name: 'Tämä tapahtuma on kattotapahtuma.',
      });
    case 'umbrellaSelector':
      return screen.findByRole('combobox', {
        name: /Kattotapahtuma/,
      });
  }
};

test('should render umbrella event selector if hasUmbrella is checked', async () => {
  renderComponent({ ...defaultInitialValues, hasUmbrella: true });

  await findElement('umbrellaSelector');
});

test('should disable isUmbrella checkbox if hasUmbrella checkbox is checked', async () => {
  renderComponent({ ...defaultInitialValues, hasUmbrella: true });

  const isUmbrellaCheckbox = await findElement('isUmbrellaCheckbox');
  expect(isUmbrellaCheckbox).toBeDisabled();
});

test('should disable isUmbrella checkbox when editing an umbrella event with at least one sub-event', async () => {
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

test('should disable isUmbrella checkbox when exiting event which has super event', async () => {
  renderComponent(undefined, {
    savedEvent: fakeEvent({
      superEventType: SuperEventType.Umbrella,
      superEvent: fakeEvent(),
    }),
  });

  const isUmbrellaCheckbox = await findElement('isUmbrellaCheckbox');
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

test('should show link to super event if super event type is recurring', async () => {
  renderComponent(undefined, {
    savedEvent: fakeEvent({
      superEvent: fakeEvent({ superEventType: SuperEventType.Recurring }),
    }),
  });

  screen.getByText(
    'Jos haluat lisätä tämän tapahtuman osaksi kattotapahtumaa, tee se'
  );
});
