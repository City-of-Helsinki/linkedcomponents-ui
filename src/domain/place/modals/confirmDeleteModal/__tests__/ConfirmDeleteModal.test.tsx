import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import ConfirmDeleteModal, {
  ConfirmDeleteModalProps,
} from '../ConfirmDeleteModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmDeleteModalProps = {
  isOpen: true,
  isSaving: false,
  onClose: jest.fn(),
  onDelete: jest.fn(),
};

const renderComponent = (props?: Partial<ConfirmDeleteModalProps>) =>
  render(<ConfirmDeleteModal {...defaultProps} {...props} />);

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

test('should call onDelete', async () => {
  const onDelete = jest.fn();
  const user = userEvent.setup();
  renderComponent({ onDelete });

  const deleteButton = getComponent('buttonDelete');
  await user.click(deleteButton);

  expect(onDelete).toBeCalled();
});

test('should call onClose', async () => {
  const onClose = jest.fn();
  const user = userEvent.setup();
  renderComponent({ onClose });

  const closeButton = getComponent('buttonCancel');
  await user.click(closeButton);

  expect(onClose).toBeCalled();
});
