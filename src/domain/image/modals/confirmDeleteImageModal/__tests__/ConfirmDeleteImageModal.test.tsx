import {
  configure,
  render,
  shouldClickButton,
  shouldRenderDeleteModal,
} from '../../../../../utils/testUtils';
import ConfirmDeleteImageModal, {
  ConfirmDeleteImageModalProps,
} from '../ConfirmDeleteImageModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmDeleteImageModalProps = {
  isOpen: true,
  isSaving: false,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
};

const renderComponent = (props?: Partial<ConfirmDeleteImageModalProps>) =>
  render(<ConfirmDeleteImageModal {...defaultProps} {...props} />);

test('should render component', async () => {
  renderComponent();

  shouldRenderDeleteModal({
    confirmButtonLabel: 'Poista kuva',
    heading: 'Varmista kuvan poistaminen',
    text: 'Tämä toiminto poistaa kuvan lopullisesti.',
  });
});

test('should call onConfirm', async () => {
  const onConfirm = vi.fn();
  renderComponent({ onConfirm });

  await shouldClickButton({ buttonLabel: 'Poista kuva', onClick: onConfirm });
});

test('should call onClose', async () => {
  const onClose = vi.fn();
  renderComponent({ onClose });

  await shouldClickButton({ buttonLabel: 'Peruuta', onClick: onClose });
});
