import { configure, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import React from 'react';

import { enterKeyPressHelper } from '../../../../utils/testUtils';
import ImagePreview, { ImagePreviewProps } from '../ImagePreview';

configure({ defaultHidden: true });

const label = 'Label text';

const defaultProps: ImagePreviewProps = {
  imageUrl: 'http://testurl.org',
  label,
  onClick: vi.fn(),
};

const renderComponent = (props?: Partial<ImagePreviewProps>) =>
  render(<ImagePreview {...defaultProps} {...props} />);

test('should call onClick', async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();
  renderComponent({ onClick });

  const button = screen.getByRole('button', { name: label });
  await user.click(button);

  expect(onClick).toBeCalled();
});

test('should call onClick when clicking enter', async () => {
  const onClick = vi.fn();
  renderComponent({ onClick });

  const button = screen.getByRole('button', { name: label });
  enterKeyPressHelper(button);

  expect(onClick).toBeCalled();
});
