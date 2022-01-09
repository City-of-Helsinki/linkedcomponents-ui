import React from 'react';

import { Registration } from '../../../../generated/graphql';
import { fakeRegistration } from '../../../../utils/mockDataUtils';
import { render, screen } from '../../../../utils/testUtils';
import { eventName, mockedEventResponse } from '../../../event/__mocks__/event';
import { TEST_EVENT_ID } from '../../../event/constants';
import RegistrationInfo from '../RegistrationInfo';

const mocks = [mockedEventResponse];

const renderComponent = (registration: Registration) =>
  render(<RegistrationInfo registration={registration} />, { mocks });

test('should render event info with creator info', async () => {
  const registration = fakeRegistration({
    createdBy: "Creator's name - organization",
    event: TEST_EVENT_ID,
    lastModifiedAt: '2021-01-04T12:00:00+00:00',
  });

  renderComponent(registration);

  await screen.findByRole('heading', { name: eventName });
  screen.getByText('04.01.2021 12.00');
  screen.getByText("Creator's name - organization");
});