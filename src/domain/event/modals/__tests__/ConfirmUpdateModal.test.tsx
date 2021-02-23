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
import ConfirmUpdateModal, {
  ConfirmUpdateModalProps,
} from '../ConfirmUpdateModal';

const defaultProps: ConfirmUpdateModalProps = {
  event,
  isOpen: true,
  isSaving: false,
  onClose: jest.fn(),
  onSave: jest.fn(),
};

const renderComponent = (props?: Partial<ConfirmUpdateModalProps>) =>
  render(<ConfirmUpdateModal {...defaultProps} {...props} />, { mocks });

test('should render component', async () => {
  renderComponent();
  screen.getByRole('heading', { name: 'Varmista tapahtuman tallentaminen' });
  screen.getByText(translations.event.updateEventModal.text1);
  screen.getByText(translations.event.updateEventModal.text2);

  await screen.findByText(eventName);
  await screen.findByText(subEventName);
  for (const subSubEventName of subSubEventNames) {
    await screen.findByText(subSubEventName);
  }

  screen.getByRole('button', { name: 'Tallenna' });
  screen.getByRole('button', { name: 'Kumoa' });
});

test('should call onSave', async () => {
  const onSave = jest.fn();
  renderComponent({ onSave });

  const updateEventButton = screen.getByRole('button', {
    name: 'Tallenna',
  });
  userEvent.click(updateEventButton);
  expect(onSave).toBeCalled();
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
