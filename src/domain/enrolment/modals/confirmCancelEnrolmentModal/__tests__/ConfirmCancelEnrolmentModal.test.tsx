import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import { registration } from '../../../../registration/__mocks__/registration';
import { enrolment } from '../../../__mocks__/enrolment';
import ConfirmCancelEnrolmentModal, {
  ConfirmCancelEnrolmentModalProps,
} from '../ConfirmCancelEnrolmentModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmCancelEnrolmentModalProps = {
  enrolment,
  isOpen: true,
  isSaving: false,
  onClose: jest.fn(),
  onConfirm: jest.fn(),
  registration,
};

const renderComponent = (props: Partial<ConfirmCancelEnrolmentModalProps>) =>
  render(<ConfirmCancelEnrolmentModal {...defaultProps} {...props} />);

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
