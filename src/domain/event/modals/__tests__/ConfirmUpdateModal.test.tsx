import React from 'react';

import {
  act,
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
import ConfirmUpdateModal, {
  ConfirmUpdateModalProps,
} from '../ConfirmUpdateModal';

configure({ defaultHidden: true });

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

  screen.getByText(eventName);
  await screen.findByText(subEventName);
  for (const subSubEventName of subSubEventNames) {
    await screen.findByText(subSubEventName);
  }

  screen.getByRole('button', { name: 'Tallenna' });
  screen.getByRole('button', { name: 'Peruuta' });
});

test('should call onSave', async () => {
  const onSave = jest.fn();
  const user = userEvent.setup();

  renderComponent({ onSave });

  const updateEventButton = screen.getByRole('button', { name: 'Tallenna' });
  await act(async () => await user.click(updateEventButton));
  expect(onSave).toBeCalled();
});

test('should call onClose', async () => {
  const onClose = jest.fn();
  const user = userEvent.setup();

  renderComponent({ onClose });

  const closeButton = screen.getByRole('button', { name: 'Peruuta' });
  await act(async () => await user.click(closeButton));
  expect(onClose).toBeCalled();
});
