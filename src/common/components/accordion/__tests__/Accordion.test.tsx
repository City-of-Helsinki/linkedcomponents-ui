import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import Accordion from '../Accordion';

configure({ defaultHidden: true });

const content = 'Accordion content';
const toggleButtonLabel = 'Toggle';

const renderComponent = () =>
  render(
    <Accordion toggleButtonLabel={toggleButtonLabel}>{content}</Accordion>
  );

test('should show content only when accordion is open', async () => {
  const user = userEvent.setup();
  renderComponent();
  expect(
    screen.queryByRole('region', { hidden: false })
  ).not.toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: toggleButtonLabel }));

  screen.getByRole('region');
});

test('should render the accordion content as a semantic <section> element', async () => {
  const user = userEvent.setup();
  renderComponent();

  await user.click(screen.getByRole('button', { name: toggleButtonLabel }));

  const region = screen.getByRole('region');

  // Sonar S6819: prefer <section aria-label=...> over <div role="region">
  expect(region.tagName).toBe('SECTION');
});
