import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import translations from '../../../app/i18n/fi.json';
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
      return screen.getByText(translations.place.deletePlaceModal.text);
    case 'warning':
      return screen.getByText(translations.common.warning);
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
  renderComponent({ onDelete });

  const deleteButton = getComponent('buttonDelete');
  userEvent.click(deleteButton);
  expect(onDelete).toBeCalled();
});

test('should call onClose', async () => {
  const onClose = jest.fn();
  renderComponent({ onClose });

  const closeButton = getComponent('buttonCancel');
  userEvent.click(closeButton);
  expect(onClose).toBeCalled();
});
