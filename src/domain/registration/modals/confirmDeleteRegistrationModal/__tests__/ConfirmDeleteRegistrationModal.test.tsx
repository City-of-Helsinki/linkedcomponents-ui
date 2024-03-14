import {
  configure,
  render,
  shouldClickButton,
  shouldRenderDeleteModal,
} from '../../../../../utils/testUtils';
import ConfirmDeleteRegistrationModal, {
  ConfirmDeleteRegistrationModalProps,
} from '../ConfirmDeleteRegistrationModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmDeleteRegistrationModalProps = {
  isOpen: true,
  isSaving: false,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
};

const renderComponent = (
  props?: Partial<ConfirmDeleteRegistrationModalProps>
) => render(<ConfirmDeleteRegistrationModal {...defaultProps} {...props} />);

test('should render component', async () => {
  renderComponent();

  shouldRenderDeleteModal({
    confirmButtonLabel: 'Poista ilmoittautuminen',
    heading: 'Varmista ilmoittautumisen poistaminen',
    text: 'Tämä toiminto poistaa ilmoittautumisen lopullisesti.',
  });
});

test('should call onConfirm', async () => {
  const onConfirm = vi.fn();
  renderComponent({ onConfirm });

  await shouldClickButton({
    buttonLabel: 'Poista ilmoittautuminen',
    onClick: onConfirm,
  });
});

test('should call onClose', async () => {
  const onClose = vi.fn();
  renderComponent({ onClose });

  await shouldClickButton({ buttonLabel: 'Peruuta', onClick: onClose });
});
