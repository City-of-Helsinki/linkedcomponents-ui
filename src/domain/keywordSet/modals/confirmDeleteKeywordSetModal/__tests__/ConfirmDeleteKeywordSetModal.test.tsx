import {
  configure,
  render,
  shouldClickButton,
  shouldRenderDeleteModal,
} from '../../../../../utils/testUtils';
import ConfirmDeleteKeywordSetModal, {
  ConfirmDeleteKeywordSetModalProps,
} from '../ConfirmDeleteKeywordSetModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmDeleteKeywordSetModalProps = {
  isOpen: true,
  isSaving: false,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
};

const renderComponent = (props?: Partial<ConfirmDeleteKeywordSetModalProps>) =>
  render(<ConfirmDeleteKeywordSetModal {...defaultProps} {...props} />);

test('should render component', async () => {
  renderComponent();

  shouldRenderDeleteModal({
    confirmButtonLabel: 'Poista avainsanaryhmä',
    heading: 'Varmista avainsanaryhmän poistaminen',
    text: 'Tämä toiminto poistaa avainsanaryhmän lopullisesti.',
  });
});

test('should call onConfirm', async () => {
  const onConfirm = vi.fn();
  renderComponent({ onConfirm });

  await shouldClickButton({
    buttonLabel: 'Poista avainsanaryhmä',
    onClick: onConfirm,
  });
});

test('should call onClose', async () => {
  const onClose = vi.fn();
  renderComponent({ onClose });

  await shouldClickButton({ buttonLabel: 'Peruuta', onClick: onClose });
});
