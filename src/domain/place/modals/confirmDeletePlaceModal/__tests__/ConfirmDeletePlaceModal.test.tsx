import {
  configure,
  render,
  shouldClickButton,
  shouldRenderDeleteModal,
} from '../../../../../utils/testUtils';
import ConfirmDeletePlaceModal, {
  ConfirmDeletePlaceModalProps,
} from '../ConfirmDeletePlaceModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmDeletePlaceModalProps = {
  isOpen: true,
  isSaving: false,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
};

const renderComponent = (props?: Partial<ConfirmDeletePlaceModalProps>) =>
  render(<ConfirmDeletePlaceModal {...defaultProps} {...props} />);

test('should render component', async () => {
  renderComponent();

  shouldRenderDeleteModal({
    confirmButtonLabel: 'Poista paikka',
    heading: 'Varmista paikan poistaminen',
    text: 'Tämä toiminto poistaa paikan lopullisesti.',
  });
});

test('should call onConfirm', async () => {
  const onConfirm = vi.fn();
  renderComponent({ onConfirm });

  await shouldClickButton({ buttonLabel: 'Poista paikka', onClick: onConfirm });
});

test('should call onClose', async () => {
  const onClose = vi.fn();
  renderComponent({ onClose });

  await shouldClickButton({ buttonLabel: 'Peruuta', onClick: onClose });
});
