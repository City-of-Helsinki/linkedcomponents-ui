import React from 'react';

import {
  act,
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
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

const getElement = (
  key: 'cancelButton' | 'deleteButton' | 'text' | 'title' | 'warning'
) => {
  switch (key) {
    case 'cancelButton':
      return screen.getByRole('button', { name: 'Peruuta' });
    case 'deleteButton':
      return screen.getByRole('button', { name: 'Poista organisaatio' });
    case 'text':
      return screen.getByText(
        translations.organization.deleteOrganizationModal.text
      );
    case 'title':
      return screen.getByRole('heading', {
        name: 'Varmista organisaation poistaminen',
      });
    case 'warning':
      return screen.getByText(translations.common.warning);
  }
};

test('should render component', async () => {
  renderComponent();
  getElement('title');
  getElement('warning');
  getElement('text');

  getElement('deleteButton');
  getElement('cancelButton');
});

test('should call onDelete', async () => {
  const onDelete = jest.fn();
  const user = userEvent.setup();
  renderComponent({ onDelete });

  const deleteButton = getElement('deleteButton');
  await act(async () => await user.click(deleteButton));
  expect(onDelete).toBeCalled();
});

test('should call onClose', async () => {
  const onClose = jest.fn();
  const user = userEvent.setup();
  renderComponent({ onClose });

  const cancelButton = getElement('cancelButton');
  await act(async () => await user.click(cancelButton));
  expect(onClose).toBeCalled();
});
