import React from 'react';

import {
  fakeSignup,
  fakeSignupGroup,
} from '../../../../../utils/mockDataUtils';
import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import { registration } from '../../../../registration/__mocks__/registration';
import { signup } from '../../../__mocks__/signup';
import ConfirmDeleteSignupOrSignupGroupModal, {
  ConfirmDeleteSignupOrSignupGroupModalProps,
} from '../ConfirmDeleteSignupOrSignupGroupModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmDeleteSignupOrSignupGroupModalProps = {
  isOpen: true,
  isSaving: false,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
  registration,
  signup,
};

const renderComponent = (
  props: Partial<ConfirmDeleteSignupOrSignupGroupModalProps>
) => {
  const allProps = {
    ...defaultProps,
    ...props,
  } as ConfirmDeleteSignupOrSignupGroupModalProps;
  return render(<ConfirmDeleteSignupOrSignupGroupModal {...allProps} />);
};

test('should call onConfirm', async () => {
  const onConfirm = vi.fn();
  const user = userEvent.setup();
  renderComponent({ onConfirm });

  const cancelEventButton = screen.getByRole('button', {
    name: 'Peruuta ilmoittautuminen',
  });
  await user.click(cancelEventButton);
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

test('should should list of signup name if signup is defined', async () => {
  const signup = fakeSignup({ firstName: 'Signup', lastName: 'User' });
  renderComponent({ signup });

  screen.getByText('Signup User');
});

test('should should list of signup names when signupGroup is defined', async () => {
  const signup1 = fakeSignup({ firstName: 'Signup', lastName: 'User 1' });
  const signup2 = fakeSignup({ firstName: 'Signup', lastName: 'User 2' });
  const signupGroup = fakeSignupGroup({ signups: [signup1, signup2] });
  renderComponent({ signupGroup, signup: undefined });

  screen.getByText('Signup User 1');
  screen.getByText('Signup User 2');
});
