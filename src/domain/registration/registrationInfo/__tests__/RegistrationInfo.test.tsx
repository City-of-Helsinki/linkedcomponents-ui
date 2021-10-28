import React from 'react';

import { Registration } from '../../../../generated/graphql';
import { fakeRegistration } from '../../../../utils/mockDataUtils';
import { render, screen } from '../../../../utils/testUtils';
import RegistrationInfo from '../RegistrationInfo';

const renderComponent = (registration: Registration) =>
  render(<RegistrationInfo registration={registration} />);

test('should render event info with creator info', () => {
  const registration = fakeRegistration({
    name: 'Registration name',
    createdBy: "Creator's name - organization",
    lastModifiedTime: '2021-01-04T12:00:00+00:00',
  });

  renderComponent(registration);

  screen.getByRole('heading', { name: 'Registration name' });
  screen.getByText('04.01.2021 12.00');
  screen.getByText("Creator's name - organization");
});
