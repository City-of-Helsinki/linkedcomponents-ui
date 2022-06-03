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

test('should render component', async () => {
  renderComponent();
  screen.getByRole('heading', {
    name: 'Varmista ilmoittautumisen poistaminen',
  });
  screen.getByText(translations.common.warning);
  screen.getByText(translations.registration.deleteRegistrationModal.text);

  screen.getByRole('button', { name: 'Poista ilmoittautuminen' });
  screen.getByRole('button', { name: 'Peruuta' });
});

test('should call onDelete', async () => {
  const onDelete = jest.fn();
  const user = userEvent.setup();
  renderComponent({ onDelete });

  const deleteRegistrationButton = screen.getByRole('button', {
    name: 'Poista ilmoittautuminen',
  });
  await act(async () => await user.click(deleteRegistrationButton));
  expect(onDelete).toBeCalled();
});

test('should call onClose', async () => {
  const onClose = jest.fn();
  const user = userEvent.setup();
  renderComponent({ onClose });

  const closeButton = screen.getByRole('button', { name: 'Peruuta' });
  await act(async () => await user.click(closeButton));
  expect(onClose).toBeCalled();
});
