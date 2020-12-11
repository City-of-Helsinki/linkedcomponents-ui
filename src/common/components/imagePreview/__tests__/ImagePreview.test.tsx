import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { enterKeyPressHelper } from '../../../../utils/testUtils';
import ImagePreview, { ImagePreviewProps } from '../ImagePreview';

const label = 'Label text';

const defaultProps: ImagePreviewProps = {
  imageUrl: 'http://testurl.org',
  label,
  onClick: jest.fn(),
};

const renderComponent = (props?: Partial<ImagePreviewProps>) =>
  render(<ImagePreview {...defaultProps} {...props} />);

test('should call onClick', () => {
  const onClick = jest.fn();
  renderComponent({ onClick });

  const button = screen.getByRole('button', { name: label });
  userEvent.click(button);

  expect(onClick).toBeCalled();
});

test('should call onClick when clicking enter', () => {
  const onClick = jest.fn();
  renderComponent({ onClick });

  const button = screen.getByRole('button', { name: label });
  enterKeyPressHelper(button);

  expect(onClick).toBeCalled();
});
