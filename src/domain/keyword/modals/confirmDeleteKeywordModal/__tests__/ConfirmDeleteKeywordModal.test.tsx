import {
  configure,
  render,
  shouldClickButton,
  shouldRenderDeleteModal,
} from '../../../../../utils/testUtils';
import ConfirmDeleteKeywordModal, {
  ConfirmDeleteKeywordModalProps,
} from '../ConfirmDeleteKeywordModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmDeleteKeywordModalProps = {
  isOpen: true,
  isSaving: false,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
};

const renderComponent = (props?: Partial<ConfirmDeleteKeywordModalProps>) =>
  render(<ConfirmDeleteKeywordModal {...defaultProps} {...props} />);

test('should render component', async () => {
  renderComponent();

  shouldRenderDeleteModal({
    confirmButtonLabel: 'Poista avainsana',
    heading: 'Varmista avainsanan poistaminen',
    text: 'Tämä toiminto poistaa avainsanan lopullisesti.',
  });
});

test('should call onConfirm', async () => {
  const onConfirm = vi.fn();
  renderComponent({ onConfirm });

  await shouldClickButton({
    buttonLabel: 'Poista avainsana',
    onClick: onConfirm,
  });
});

test('should call onClose', async () => {
  const onClose = vi.fn();
  renderComponent({ onClose });

  await shouldClickButton({ buttonLabel: 'Peruuta', onClick: onClose });
});
