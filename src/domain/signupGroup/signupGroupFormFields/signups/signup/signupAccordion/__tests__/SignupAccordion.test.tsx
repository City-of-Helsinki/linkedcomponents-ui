import React from 'react';
import { vi } from 'vitest';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../../../utils/testUtils';
import SignupAccordion, { SignupAccordionProps } from '../SignupAccordion';

configure({ defaultHidden: true });

const content = 'Accordion content';
const toggleButtonLabel = 'Toggle';

const defaultProps: SignupAccordionProps = {
  inWaitingList: false,
  onClick: vi.fn(),
  open: true,
  toggleButtonLabel,
};

const renderComponent = (props?: Partial<SignupAccordionProps>) =>
  render(
    <SignupAccordion {...defaultProps} {...props}>
      {content}
    </SignupAccordion>
  );

test('should not show content if accordion is not open', async () => {
  renderComponent({ open: false });

  expect(
    screen.queryByRole('region', { hidden: false })
  ).not.toBeInTheDocument();
});

test('should show content if accordion is open', async () => {
  renderComponent({ open: true });

  screen.getByRole('region', { hidden: false });
});

test('should not show in waiting list text if signup is not in waiting list', async () => {
  renderComponent({ inWaitingList: false, open: true });

  expect(screen.queryByText('Varasija')).not.toBeInTheDocument();
});

test('should show in waiting list text if signup is in waiting list', async () => {
  renderComponent({ inWaitingList: true, open: true });

  screen.getByText('Varasija');
});

test('should call onClick when clicking', async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();

  renderComponent({ open: true, onClick });

  const toggleButton = screen.getByRole('button', { name: toggleButtonLabel });
  await user.click(toggleButton);
  expect(onClick).toBeCalled();
});

test('should call onClick by pressing enter', async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();

  renderComponent({ open: true, onClick });

  const toggleButton = screen.getByRole('button', { name: toggleButtonLabel });
  await user.type(toggleButton, '{enter}');
  expect(onClick).toBeCalled();
});
