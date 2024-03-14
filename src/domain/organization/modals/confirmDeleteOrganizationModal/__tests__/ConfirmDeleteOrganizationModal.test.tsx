import {
  configure,
  render,
  shouldClickButton,
  shouldRenderDeleteModal,
} from '../../../../../utils/testUtils';
import ConfirmDeleteOrganizationModal, {
  ConfirmDeleteOrganizationModalProps,
} from '../ConfirmDeleteOrganizationModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmDeleteOrganizationModalProps = {
  isOpen: true,
  isSaving: false,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
};

const renderComponent = (
  props?: Partial<ConfirmDeleteOrganizationModalProps>
) => render(<ConfirmDeleteOrganizationModal {...defaultProps} {...props} />);

test('should render component', async () => {
  renderComponent();

  shouldRenderDeleteModal({
    confirmButtonLabel: 'Poista organisaatio',
    heading: 'Varmista organisaation poistaminen',
    text: 'Tämä toiminto poistaa organisaation lopullisesti.',
  });
});

test('should call onConfirm', async () => {
  const onConfirm = vi.fn();
  renderComponent({ onConfirm });

  await shouldClickButton({
    buttonLabel: 'Poista organisaatio',
    onClick: onConfirm,
  });
});

test('should call onClose', async () => {
  const onClose = vi.fn();
  renderComponent({ onClose });

  await shouldClickButton({ buttonLabel: 'Peruuta', onClick: onClose });
});
