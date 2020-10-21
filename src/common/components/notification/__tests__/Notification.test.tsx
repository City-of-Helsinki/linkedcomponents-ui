import React from 'react';

import { render, screen } from '../../../../utils/testUtils';
import Notification from '../Notification';

it('should render notification', () => {
  const label = 'Notification label';
  const text = 'Notification text';
  render(<Notification label={label}>{text}</Notification>);

  expect(screen.queryByText(label)).toBeInTheDocument();
  expect(screen.queryByText(text)).toBeInTheDocument();
});
