import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../../../utils/testUtils';
import AttendeeAccordion, {
  AttendeeAccordionProps,
} from '../AttendeeAccordion';

configure({ defaultHidden: true });

const content = 'Accordion content';
const toggleButtonLabel = 'Toggle';

const defaultProps: AttendeeAccordionProps = {
  toggleButtonLabel,
  open: true,
  onClick: jest.fn(),
};

const renderComponent = (props?: Partial<AttendeeAccordionProps>) =>
  render(
    <AttendeeAccordion {...defaultProps} {...props}>
      {content}
    </AttendeeAccordion>
  );

test('should not show contentif accordion is not open', async () => {
  renderComponent({ open: false });

  expect(
    screen.queryByRole('region', { hidden: false })
  ).not.toBeInTheDocument();
});

test('should show contentif accordion is open', async () => {
  renderComponent({ open: true });

  screen.getByRole('region', { hidden: false });
});

test('should call onClick', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();

  renderComponent({ open: true, onClick });

  const toggleButton = screen.getByRole('button', { name: toggleButtonLabel });
  await user.click(toggleButton);
  expect(onClick).toBeCalled();
});
