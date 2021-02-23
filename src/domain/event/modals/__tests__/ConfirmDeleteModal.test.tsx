import React from 'react';

import {
  event,
  eventName,
  mocks,
  subEventName,
  subSubEventNames,
} from '../__mocks__/constants';
import { render, screen, userEvent } from '../../../../utils/testUtils';
import translations from '../../../app/i18n/fi.json';
import ConfirmDeleteModal, {
  ConfirmDeleteModalProps,
} from '../ConfirmDeleteModal';

const defaultProps: ConfirmDeleteModalProps = {
  event,
  isOpen: true,
  isSaving: false,
  onClose: jest.fn(),
  onDelete: jest.fn(),
};

const renderComponent = (props?: Partial<ConfirmDeleteModalProps>) =>
  render(<ConfirmDeleteModal {...defaultProps} {...props} />, { mocks });

test('should render component', async () => {
  renderComponent();
  screen.getByRole('heading', { name: 'Varmista tapahtuman poistaminen' });
  screen.getByText(translations.common.warning);
  screen.getByText(translations.event.deleteEventModal.text1);
  screen.getByText(translations.event.deleteEventModal.text2);
  screen.getByText(translations.event.deleteEventModal.text3);

  await screen.findByText(eventName);
  await screen.findByText(subEventName);
  for (const subSubEventName of subSubEventNames) {
    await screen.findByText(subSubEventName);
  }

  screen.getByRole('button', { name: 'Poista tapahtuma' });
  screen.getByRole('button', { name: 'Kumoa' });
});

test('should call onDelete', async () => {
  const onDelete = jest.fn();
  renderComponent({ onDelete });

  const deleteEventButton = screen.getByRole('button', {
    name: 'Poista tapahtuma',
  });
  userEvent.click(deleteEventButton);
  expect(onDelete).toBeCalled();
});

test('should call onClose', async () => {
  const onClose = jest.fn();
  renderComponent({ onClose });

  const closeButton = screen.getByRole('button', {
    name: 'Kumoa',
  });
  userEvent.click(closeButton);
  expect(onClose).toBeCalled();
});
