import {
  configure,
  render,
  shouldClickButton,
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
  renderComponent({ onConfirm });

  await shouldClickButton({
    buttonLabel: 'Poista osallistuja',
    onClick: onConfirm,
  });
});

test('should call onClose', async () => {
  const onClose = vi.fn();
  renderComponent({ onClose });

  await shouldClickButton({ buttonLabel: 'Peruuta', onClick: onClose });
});
