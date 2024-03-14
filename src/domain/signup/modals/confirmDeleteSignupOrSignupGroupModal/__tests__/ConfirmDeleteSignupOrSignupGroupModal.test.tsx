import {
  fakeSignup,
  fakeSignupGroup,
} from '../../../../../utils/mockDataUtils';
import {
  configure,
  render,
  screen,
  shouldClickButton,
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
  renderComponent({ onConfirm });

  await shouldClickButton({
    buttonLabel: 'Peruuta ilmoittautuminen',
    onClick: onConfirm,
  });
});

test('should call onClose', async () => {
  const onClose = vi.fn();
  renderComponent({ onClose });

  await shouldClickButton({ buttonLabel: 'Peruuta', onClick: onClose });
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
