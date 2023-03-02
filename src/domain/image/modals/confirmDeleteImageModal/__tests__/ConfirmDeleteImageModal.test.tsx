import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import ConfirmDeleteImageModal, {
  ConfirmDeleteImageModalProps,
} from '../ConfirmDeleteImageModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmDeleteImageModalProps = {
  isOpen: true,
  isSaving: false,
  onClose: jest.fn(),
  onConfirm: jest.fn(),
};

const renderComponent = (props?: Partial<ConfirmDeleteImageModalProps>) =>
  render(<ConfirmDeleteImageModal {...defaultProps} {...props} />);

test('should render component', async () => {
  renderComponent();
  screen.getByRole('heading', { name: 'Varmista kuvan poistaminen' });
  screen.getByText('Varoitus!');
  screen.getByText('Tämä toiminto poistaa kuvan lopullisesti.');

  screen.getByRole('button', { name: 'Poista kuva' });
  screen.getByRole('button', { name: 'Peruuta' });
});

test('should call onConfirm', async () => {
  const onConfirm = jest.fn();
  const user = userEvent.setup();

  renderComponent({ onConfirm });

  const deleteButton = screen.getByRole('button', { name: 'Poista kuva' });
  await user.click(deleteButton);
  expect(onConfirm).toBeCalled();
});

test('should call onClose', async () => {
  const onClose = jest.fn();
  const user = userEvent.setup();

  renderComponent({ onClose });

  const closeButton = screen.getByRole('button', { name: 'Peruuta' });
  await user.click(closeButton);
  expect(onClose).toBeCalled();
});
