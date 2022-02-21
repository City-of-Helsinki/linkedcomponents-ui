import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import translations from '../../../app/i18n/fi.json';
import {
  event,
  eventName,
  mocks,
  subEventName,
  subSubEventNames,
} from '../__mocks__/modals';
import ConfirmCancelModal, {
  ConfirmCancelModalProps,
} from '../ConfirmCancelModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmCancelModalProps = {
  event,
  isOpen: true,
  isSaving: false,
  onCancel: jest.fn(),
  onClose: jest.fn(),
};

const renderComponent = (props?: Partial<ConfirmCancelModalProps>) =>
  render(<ConfirmCancelModal {...defaultProps} {...props} />, { mocks });

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

test('should call onCancel', async () => {
  const onCancel = jest.fn();
  renderComponent({ onCancel });

  const cancelEventButton = screen.getByRole('button', {
    name: 'Peruuta tapahtuma',
  });
  userEvent.click(cancelEventButton);
  expect(onCancel).toBeCalled();
});

test('should call onClose', async () => {
  const onClose = jest.fn();
  renderComponent({ onClose });

  const closeButton = screen.getByRole('button', {
    name: 'Peruuta',
  });
  userEvent.click(closeButton);
  expect(onClose).toBeCalled();
});
