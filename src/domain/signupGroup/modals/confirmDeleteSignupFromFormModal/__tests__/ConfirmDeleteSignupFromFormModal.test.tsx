import React from 'react';
import { vi } from 'vitest';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import ConfirmDeleteSignupFromFormModal, {
  ConfirmDeleteSignupFromFormModalProps,
} from '../ConfirmDeleteSignupFromFormModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmDeleteSignupFromFormModalProps = {
  isOpen: true,
  isSaving: false,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
  participantCount: 1,
};

const renderComponent = (
  props: Partial<ConfirmDeleteSignupFromFormModalProps>
) => render(<ConfirmDeleteSignupFromFormModal {...defaultProps} {...props} />);

test('should call onConfirm', async () => {
  const onConfirm = vi.fn();
  const user = userEvent.setup();
  renderComponent({ onConfirm });

  const deleteParticipantButton = screen.getByRole('button', {
    name: 'Poista osallistuja',
  });
  await user.click(deleteParticipantButton);
  expect(onConfirm).toBeCalled();
});

test('should call onClose', async () => {
  const onClose = vi.fn();
  const user = userEvent.setup();
  renderComponent({ onClose });

  const closeButton = screen.getByRole('button', { name: 'Peruuta' });
  await user.click(closeButton);
  expect(onClose).toBeCalled();
});
