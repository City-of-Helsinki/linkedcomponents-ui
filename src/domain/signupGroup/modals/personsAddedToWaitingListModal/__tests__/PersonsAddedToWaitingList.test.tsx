import {
  configure,
  render,
  shouldClickButton,
} from '../../../../../utils/testUtils';
import PersonsAddedToWaitingListModal, {
  PersonsAddedToWaitingListModalProps,
} from '../PersonsAddedToWaitingListModal';

configure({ defaultHidden: true });

const defaultProps: PersonsAddedToWaitingListModalProps = {
  isOpen: true,
  onClose: vi.fn(),
};

const renderComponent = (props: Partial<PersonsAddedToWaitingListModalProps>) =>
  render(<PersonsAddedToWaitingListModal {...defaultProps} {...props} />);

test('should call onClose', async () => {
  const onClose = vi.fn();
  renderComponent({ onClose });

  await shouldClickButton({ buttonLabel: 'Sulje', onClick: onClose });
});
