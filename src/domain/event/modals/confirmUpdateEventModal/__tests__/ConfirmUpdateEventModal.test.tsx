import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import {
  event,
  eventName,
  mocks,
  subEventName,
  subSubEventNames,
} from '../../__mocks__/modals';
import ConfirmUpdateEventModal, {
  ConfirmUpdateEventModalProps,
} from '../ConfirmUpdateEventModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmUpdateEventModalProps = {
  event,
  isOpen: true,
  isSaving: false,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
};

const renderComponent = (props?: Partial<ConfirmUpdateEventModalProps>) =>
  render(<ConfirmUpdateEventModal {...defaultProps} {...props} />, { mocks });

test('should render component', async () => {
  renderComponent();
  screen.getByRole('heading', { name: 'Varmista tapahtuman tallentaminen' });
  screen.getByText(translations.event.updateEventModal.text1);
  screen.getByText(translations.event.updateEventModal.text2);

  screen.getByText(eventName);
  await screen.findByText(subEventName);
  for (const subSubEventName of subSubEventNames) {
    await screen.findByText(subSubEventName);
  }

  screen.getByRole('button', { name: 'Tallenna' });
  screen.getByRole('button', { name: 'Peruuta' });
});

test('should call onConfirm', async () => {
  const onConfirm = vi.fn();
  const user = userEvent.setup();

  renderComponent({ onConfirm });

  const updateEventButton = screen.getByRole('button', { name: 'Tallenna' });
  await user.click(updateEventButton);
  expect(onConfirm).toBeCalled();
});

test('should call onClose', async () => {
  const onClose = vi.fn();
  const user = userEvent.setup();

  renderComponent({ onClose });

  const closeButton = screen.getByRole('button', { name: 'Peruuta' });
  await user.click(closeButton);
  expect(onClose).toBeCalled();
});
