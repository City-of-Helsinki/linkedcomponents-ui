import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import {
  mockedOrganizationsResponse,
  organizations,
  organizationsOverrides,
} from '../../../../organizations/__mocks__/organizationsPage';
import PublisherSelector, {
  PublisherSelectorProps,
} from '../PublisherSelector';

configure({ defaultHidden: true });

const mocks = [mockedOrganizationsResponse];

const toggleButtonLabel = 'Select place';

const defaultProps: PublisherSelectorProps = {
  onChange: vi.fn(),
  toggleButtonLabel,
  value: [],
};

const renderComponent = (props?: Partial<PublisherSelectorProps>) =>
  render(<PublisherSelector {...defaultProps} {...props} />, { mocks });

const getToggleButton = () =>
  screen.getByRole('button', { name: toggleButtonLabel });

test('should render publisher selector', async () => {
  const publisherId = organizations.data[0]?.id as string;
  const publisherName = organizations.data[0]?.name as string;
  const user = userEvent.setup();
  renderComponent({ value: [publisherId] });

  await screen.findByText(publisherName);

  const toggleButton = getToggleButton();
  await user.click(toggleButton);

  for (const { name } of organizationsOverrides) {
    await screen.findByLabelText(name as string);
  }
});
