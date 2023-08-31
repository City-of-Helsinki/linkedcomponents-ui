import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import { registration } from '../../../../registration/__mocks__/registration';
import { signup } from '../../../__mocks__/signup';
import ConfirmCancelSignupModal, {
  ConfirmCancelSignupModalProps,
} from '../ConfirmCancelSignupModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmCancelSignupModalProps = {
  isOpen: true,
  isSaving: false,
  onClose: jest.fn(),
  onConfirm: jest.fn(),
  registration,
  signup,
};

const renderComponent = (props: Partial<ConfirmCancelSignupModalProps>) =>
  render(<ConfirmCancelSignupModal {...defaultProps} {...props} />);

test('should call onCancel', async () => {
  const onConfirm = jest.fn();
  const user = userEvent.setup();
  renderComponent({ onConfirm });

  const cancelEventButton = screen.getByRole('button', {
    name: 'Peruuta ilmoittautuminen',
  });
  await user.click(cancelEventButton);
  expect(onConfirm).toBeCalled();
});

test('should call onClose', async () => {
  const onClose = jest.fn();
  const user = userEvent.setup();
  renderComponent({ onClose });

  const closeButton = screen.getByRole('button', { name: 'Peruuta' });
  await user.click(closeButton);
  expect(onClose).toBeCalled();
});
