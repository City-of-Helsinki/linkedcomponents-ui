import {
  configure,
  render,
  screen,
  shouldClickButton,
} from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import {
  event,
  eventName,
  mocks,
  subEventName,
  subSubEventNames,
} from '../../__mocks__/modals';
import ConfirmPostponeEventModal, {
  ConfirmPostponeEventModalProps,
} from '../ConfirmPostponeEventModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmPostponeEventModalProps = {
  event,
  isOpen: true,
  isSaving: false,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
};

const renderComponent = (props?: Partial<ConfirmPostponeEventModalProps>) =>
  render(<ConfirmPostponeEventModal {...defaultProps} {...props} />, { mocks });

test('should render component', async () => {
  renderComponent();
  screen.getByRole('heading', { name: 'Varmista tapahtuman lykkääminen' });
  screen.getByText(translations.common.warning);
  screen.getByText(translations.event.postponeEventModal.text1);
  screen.getByText(translations.event.postponeEventModal.text2);

  screen.getByText(eventName);
  await screen.findByText(subEventName);
  for (const subSubEventName of subSubEventNames) {
    await screen.findByText(subSubEventName);
  }

  screen.getByRole('button', { name: 'Lykkää tapahtumaa' });
  screen.getByRole('button', { name: 'Peruuta' });
});

test('should call onConfirm', async () => {
  const onConfirm = vi.fn();
  renderComponent({ onConfirm });

  await shouldClickButton({
    buttonLabel: 'Lykkää tapahtumaa',
    onClick: onConfirm,
  });
});

test('should call onClose', async () => {
  const onClose = vi.fn();
  renderComponent({ onClose });

  await shouldClickButton({ buttonLabel: 'Peruuta', onClick: onClose });
});
