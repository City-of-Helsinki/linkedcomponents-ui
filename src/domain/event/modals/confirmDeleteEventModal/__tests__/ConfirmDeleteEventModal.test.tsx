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
import ConfirmDeleteEventModal, {
  ConfirmDeleteEventModalProps,
} from '../ConfirmDeleteEventModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmDeleteEventModalProps = {
  event,
  isOpen: true,
  isSaving: false,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
};

const renderComponent = (props?: Partial<ConfirmDeleteEventModalProps>) =>
  render(<ConfirmDeleteEventModal {...defaultProps} {...props} />, { mocks });

const eventWithRegistration = {
  ...event,
  registration: { atId: generateAtId(TEST_REGISTRATION_ID, 'registration') },
};

test.each([
  [event, false],
  [eventWithRegistration, true],
])('should render modal', async (event, hasRegistration) => {
  renderComponent({ event });
  screen.getByRole('heading', { name: 'Varmista tapahtuman poistaminen' });
  screen.getByText(translations.common.warning);
  screen.getByText(translations.event.deleteEventModal.text1);
  screen.getByText(translations.event.deleteEventModal.text2);
  if (hasRegistration) {
    screen.getByText(translations.event.deleteEventModal.text3);
  } else {
    expect(
      screen.queryByText(translations.event.deleteEventModal.text3)
    ).not.toBeInTheDocument();
  }

  screen.getByText(translations.event.deleteEventModal.text4);

  screen.getByText(eventName);
  await screen.findByText(subEventName);
  for (const subSubEventName of subSubEventNames) {
    await screen.findByText(subSubEventName);
  }

  screen.getByRole('button', { name: 'Poista tapahtuma' });
  screen.getByRole('button', { name: 'Peruuta' });
});

test('should call onConfirm', async () => {
  const onConfirm = vi.fn();
  renderComponent({ onConfirm });

  await shouldClickButton({
    buttonLabel: 'Poista tapahtuma',
    onClick: onConfirm,
  });
});

test('should call onClose', async () => {
  const onClose = vi.fn();
  renderComponent({ onClose });

  await shouldClickButton({ buttonLabel: 'Peruuta', onClick: onClose });
});
