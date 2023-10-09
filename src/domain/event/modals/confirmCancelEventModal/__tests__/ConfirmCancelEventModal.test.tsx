import React from 'react';
import { vi } from 'vitest';

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

test('should render component', async () => {
  renderComponent();

  screen.getByRole('heading', { name: 'Varmista tapahtuman peruminen' });
  screen.getByText(translations.event.cancelEventModal.warning);
  screen.getByText(translations.common.warning);
  screen.getByText(translations.event.cancelEventModal.text1);
  screen.getByText(translations.event.cancelEventModal.text2);

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
  const user = userEvent.setup();

  renderComponent({ onConfirm });

  const cancelEventButton = screen.getByRole('button', {
    name: 'Peruuta tapahtuma',
  });
  await user.click(cancelEventButton);
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
