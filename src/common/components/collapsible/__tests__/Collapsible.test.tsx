import React from 'react';

import {
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

  await user.click(toggleButton);
  expect(region.getAttribute('hidden')).toBeNull();

  await user.click(toggleButton);
  expect(region.getAttribute('hidden')).toBe('');
});

it('should render the collapsible panel as a semantic <section> element', () => {
  const title = 'Collapsible content';

  render(
    <Collapsible title={title}>
      <div>Content text</div>
    </Collapsible>
  );

  const region = screen.getByRole('region', { hidden: true });

  // Sonar S6819: prefer <section aria-labelledby=...> over <div role="region">
  expect(region.tagName).toBe('SECTION');
});

it('should render the collapsible title as a semantic heading element', () => {
  const title = 'Collapsible content';

  render(
    <Collapsible headingLevel={4} title={title}>
      <div>Content text</div>
    </Collapsible>
  );

  // Sonar S6819: prefer <h1>-<h6> over <div role="heading">
  const heading = screen.getByRole('heading', { level: 4, name: title });
  expect(heading.tagName).toBe('H4');
});
