import React from 'react';

import { render, screen, userEvent } from '../../../../utils/testUtils';
import Accordion from '../Accordion';

const content = 'Accordion content';
const toggleButtonLabel = 'Toggle';

const renderComponent = () =>
  render(
    <Accordion toggleButtonLabel={toggleButtonLabel}>{content}</Accordion>
  );

test('should show content only when accordion is open', () => {
  renderComponent();
  expect(screen.queryByRole('region')).not.toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: toggleButtonLabel }));

  screen.getByRole('region');
});
