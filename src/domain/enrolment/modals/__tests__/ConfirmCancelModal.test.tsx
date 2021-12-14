import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import { registration } from '../../../registration/__mocks__/registration';
import { enrolment } from '../../__mocks__/enrolment';
import ConfirmCancelModal, {
  ConfirmCancelModalProps,
} from '../ConfirmCancelModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmCancelModalProps = {
  enrolment,
  isOpen: true,
  isSaving: false,
  onCancel: jest.fn(),
  onClose: jest.fn(),
  registration,
};

const renderComponent = (props: Partial<ConfirmCancelModalProps>) =>
  render(<ConfirmCancelModal {...defaultProps} {...props} />);

test('should call onCancel', async () => {
  const onCancel = jest.fn();
  renderComponent({ onCancel });

  const cancelEventButton = screen.getByRole('button', {
    name: 'Peruuta ilmoittautuminen',
  });
  userEvent.click(cancelEventButton);
  expect(onCancel).toBeCalled();
});

test('should call onClose', async () => {
  const onClose = jest.fn();
  renderComponent({ onClose });

  const closeButton = screen.getByRole('button', {
    name: 'Peruuta',
  });
  userEvent.click(closeButton);
  expect(onClose).toBeCalled();
});
