import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import ConfirmDeleteOrganizationModal, {
  ConfirmDeleteOrganizationModalProps,
} from '../ConfirmDeleteOrganizationModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmDeleteOrganizationModalProps = {
  isOpen: true,
  isSaving: false,
  onClose: jest.fn(),
  onDelete: jest.fn(),
};

const renderComponent = (
  props?: Partial<ConfirmDeleteOrganizationModalProps>
) => render(<ConfirmDeleteOrganizationModal {...defaultProps} {...props} />);

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
        'Tämä toiminto poistaa organisaation lopullisesti.'
      );
    case 'title':
      return screen.getByRole('heading', {
        name: 'Varmista organisaation poistaminen',
      });
    case 'warning':
      return screen.getByText('Varoitus!');
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
  await user.click(deleteButton);
  expect(onDelete).toBeCalled();
});

test('should call onClose', async () => {
  const onClose = jest.fn();
  const user = userEvent.setup();
  renderComponent({ onClose });

  const cancelButton = getElement('cancelButton');
  await user.click(cancelButton);
  expect(onClose).toBeCalled();
});
