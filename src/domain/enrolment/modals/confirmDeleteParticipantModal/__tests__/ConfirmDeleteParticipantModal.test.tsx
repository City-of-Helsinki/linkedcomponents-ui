import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import ConfirmDeleteParticipantModal, {
  ConfirmDeleteParticipantModalProps,
} from '../ConfirmDeleteParticipantModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmDeleteParticipantModalProps = {
  isOpen: true,
  isSaving: false,
  onClose: jest.fn(),
  onDelete: jest.fn(),
  participantCount: 1,
};

const renderComponent = (props: Partial<ConfirmDeleteParticipantModalProps>) =>
  render(<ConfirmDeleteParticipantModal {...defaultProps} {...props} />);

test('should call onCancel', async () => {
  const onDelete = jest.fn();
  const user = userEvent.setup();
  renderComponent({ onDelete });

  const deleteParticipantButton = screen.getByRole('button', {
    name: 'Poista osallistuja',
  });
  await user.click(deleteParticipantButton);
  expect(onDelete).toBeCalled();
});

test('should call onClose', async () => {
  const onClose = jest.fn();
  const user = userEvent.setup();
  renderComponent({ onClose });

  const closeButton = screen.getByRole('button', { name: 'Peruuta' });
  await user.click(closeButton);
  expect(onClose).toBeCalled();
});
