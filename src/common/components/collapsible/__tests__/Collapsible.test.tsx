import React from 'react';

import { render, screen, userEvent } from '../../../../utils/testUtils';
import Collapsible from '../Collapsible';

it('should show and hide content by clicking title', async () => {
  const title = 'Collapsible content';

  render(
    <Collapsible title={title}>
      <div>Content text</div>
    </Collapsible>
  );

  const toggleButton = screen.getByRole('button', { name: title });
  const region = screen.getByRole('region', { hidden: true });

  expect(region.getAttribute('hidden')).toBe('');

  userEvent.click(toggleButton);

  expect(region.getAttribute('hidden')).toBeNull();

  userEvent.click(toggleButton);

  expect(region.getAttribute('hidden')).toBe('');
});
