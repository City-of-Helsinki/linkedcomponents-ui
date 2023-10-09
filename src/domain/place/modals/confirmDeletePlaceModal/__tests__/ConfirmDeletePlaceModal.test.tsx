import React from 'react';
import { vi } from 'vitest';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import ConfirmDeletePlaceModal, {
  ConfirmDeletePlaceModalProps,
} from '../ConfirmDeletePlaceModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmDeletePlaceModalProps = {
  isOpen: true,
  isSaving: false,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
};

const renderComponent = (props?: Partial<ConfirmDeletePlaceModalProps>) =>
  render(<ConfirmDeletePlaceModal {...defaultProps} {...props} />);

const getComponent = (
  key: 'buttonCancel' | 'buttonDelete' | 'heading' | 'text' | 'warning'
) => {
  switch (key) {
    case 'buttonCancel':
      return screen.getByRole('button', { name: 'Peruuta' });
    case 'buttonDelete':
      return screen.getByRole('button', { name: 'Poista paikka' });
    case 'heading':
      return screen.getByRole('heading', {
        name: 'Varmista paikan poistaminen',
      });
    case 'text':
      return screen.getByText('Tämä toiminto poistaa paikan lopullisesti.');
    case 'warning':
      return screen.getByText('Varoitus!');
  }
};

test('should render component', async () => {
  renderComponent();
  getComponent('heading');
  getComponent('warning');
  getComponent('text');
  getComponent('buttonDelete');
  screen.getByRole('button', { name: 'Peruuta' });
});

test('should call onConfirm', async () => {
  const onConfirm = vi.fn();
  const user = userEvent.setup();
  renderComponent({ onConfirm });

  const deleteButton = getComponent('buttonDelete');
  await user.click(deleteButton);

  expect(onConfirm).toBeCalled();
});

test('should call onClose', async () => {
  const onClose = vi.fn();
  const user = userEvent.setup();
  renderComponent({ onClose });

  const closeButton = getComponent('buttonCancel');
  await user.click(closeButton);

  expect(onClose).toBeCalled();
});
