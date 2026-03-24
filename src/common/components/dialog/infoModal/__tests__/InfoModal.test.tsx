import { screen } from '@testing-library/react';
import React from 'react';

import { render } from '../../../../../utils/testUtils';
import InfoModal from '../InfoModal';

const defaultProps = {
  closeButtonText: 'Close',
  description: 'Modal body text',
  heading: 'Modal title',
  id: 'test-info-modal',
  isOpen: true,
  onClose: vi.fn(),
};

test('sets description role to alert when reReadDescription is true', () => {
  render(<InfoModal {...defaultProps} reReadDescription={true} />);

  expect(screen.getByText('Modal body text')).toHaveAttribute('role', 'alert');
});

test('omits description role when reReadDescription is false or omitted', () => {
  const { rerender } = render(
    <InfoModal {...defaultProps} reReadDescription={false} />
  );
  expect(screen.getByText('Modal body text')).not.toHaveAttribute('role');

  rerender(<InfoModal {...defaultProps} />);
  expect(screen.getByText('Modal body text')).not.toHaveAttribute('role');
});
