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

test('should render component', async () => {
  renderComponent();
  screen.getByRole('heading', { name: 'Varmista kuvan poistaminen' });
  screen.getByText(translations.common.warning);
  screen.getByText(translations.image.deleteImageModal.text);

  screen.getByRole('button', { name: 'Poista kuva' });
  screen.getByRole('button', { name: 'Peruuta' });
});

test('should call onDelete', async () => {
  const onDelete = jest.fn();
  renderComponent({ onDelete });

  const deleteButton = screen.getByRole('button', { name: 'Poista kuva' });
  userEvent.click(deleteButton);
  expect(onDelete).toBeCalled();
});

test('should call onClose', async () => {
  const onClose = jest.fn();
  renderComponent({ onClose });

  const closeButton = screen.getByRole('button', { name: 'Peruuta' });
  userEvent.click(closeButton);
  expect(onClose).toBeCalled();
});
