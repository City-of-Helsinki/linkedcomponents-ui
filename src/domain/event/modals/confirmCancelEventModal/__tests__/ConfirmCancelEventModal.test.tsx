import generateAtId from '../../../../../utils/generateAtId';
import {
  configure,
  render,
  screen,
  shouldClickButton,
} from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import { TEST_REGISTRATION_ID } from '../../../../registration/constants';
import {
  event,
  eventName,
  mocks,
  subEventName,
  subSubEventNames,
} from '../../__mocks__/modals';
import ConfirmCancelEventModal, {
  ConfirmCancelEventModalProps,
} from '../ConfirmCancelEventModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmCancelEventModalProps = {
  event,
  isOpen: true,
  isSaving: false,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
};

const renderComponent = (props?: Partial<ConfirmCancelEventModalProps>) =>
  render(<ConfirmCancelEventModal {...defaultProps} {...props} />, { mocks });

const eventWithRegistration = {
  ...event,
  registration: { atId: generateAtId(TEST_REGISTRATION_ID, 'registration') },
};

test.each([
  [event, false],
  [eventWithRegistration, true],
])('should render modal', async (event, hasRegistration) => {
  renderComponent({ event });

  screen.getByRole('heading', { name: 'Varmista tapahtuman peruminen' });
  screen.getByText(translations.event.cancelEventModal.warning);
  screen.getByText(translations.common.warning);
  screen.getByText(translations.event.cancelEventModal.text1);

  if (hasRegistration) {
    screen.getByText(translations.event.cancelEventModal.text2);
  } else {
    expect(
      screen.queryByText(translations.event.cancelEventModal.text2)
    ).not.toBeInTheDocument();
  }

  screen.getByText(translations.event.cancelEventModal.text3);

  screen.getByText(eventName);
  await screen.findByText(subEventName);

  for (const subSubEventName of subSubEventNames) {
    await screen.findByText(subSubEventName);
  }

  screen.getByRole('button', { name: 'Peruuta tapahtuma' });
  screen.getByRole('button', { name: 'Peruuta' });
});

test('should call onConfirm', async () => {
  const onConfirm = vi.fn();
  renderComponent({ onConfirm });

  await shouldClickButton({
    buttonLabel: 'Peruuta tapahtuma',
    onClick: onConfirm,
  });
});

test('should call onClose', async () => {
  const onClose = vi.fn();
  renderComponent({ onClose });

  await shouldClickButton({ buttonLabel: 'Peruuta', onClick: onClose });
});
