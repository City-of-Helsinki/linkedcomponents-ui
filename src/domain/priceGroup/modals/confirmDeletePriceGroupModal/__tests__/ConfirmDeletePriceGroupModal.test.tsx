import {
  configure,
  render,
  shouldCallModalButtonAction,
  shouldRenderDeleteModal,
} from '../../../../../utils/testUtils';
import ConfirmDeletePriceGroupModal, {
  ConfirmDeletePriceGroupModalProps,
} from '../ConfirmDeletePriceGroupModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmDeletePriceGroupModalProps = {
  isOpen: true,
  isSaving: false,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
};

const renderComponent = (props?: Partial<ConfirmDeletePriceGroupModalProps>) =>
  render(<ConfirmDeletePriceGroupModal {...defaultProps} {...props} />);

test('should render component', async () => {
  renderComponent();
  shouldRenderDeleteModal({
    confirmButtonLabel: 'Poista hintaryhmä',
    heading: 'Varmista hintaryhmän poistaminen',
    text: 'Tämä toiminto poistaa hintaryhmän lopullisesti.',
  });
});

test('should call onConfirm', async () => {
  const onConfirm = vi.fn();
  renderComponent({ onConfirm });

  await shouldCallModalButtonAction('Poista hintaryhmä', onConfirm);
});

test('should call onClose', async () => {
  const onClose = vi.fn();
  renderComponent({ onClose });

  await shouldCallModalButtonAction('Peruuta', onClose);
});
