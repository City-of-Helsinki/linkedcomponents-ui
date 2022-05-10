import React from 'react';

import {
  act,
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import Collapsible from '../Collapsible';

configure({ defaultHidden: true });

it('should show and hide content by clicking title', async () => {
  const user = userEvent.setup();
  const title = 'Collapsible content';

  render(
    <Collapsible title={title}>
      <div>Content text</div>
    </Collapsible>
  );

  const toggleButton = screen.getByRole('button', { name: title });
  const region = screen.getByRole('region', { hidden: true });

  expect(region.getAttribute('hidden')).toBe('');

  await act(async () => await user.click(toggleButton));
  expect(region.getAttribute('hidden')).toBeNull();

  await act(async () => await user.click(toggleButton));
  expect(region.getAttribute('hidden')).toBe('');
});
