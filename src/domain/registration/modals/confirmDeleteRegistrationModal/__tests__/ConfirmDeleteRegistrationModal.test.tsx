import React from 'react';
import { vi } from 'vitest';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import ConfirmDeleteRegistrationModal, {
  ConfirmDeleteRegistrationModalProps,
} from '../ConfirmDeleteRegistrationModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmDeleteRegistrationModalProps = {
  isOpen: true,
  isSaving: false,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
};

const renderComponent = (
  props?: Partial<ConfirmDeleteRegistrationModalProps>
) => render(<ConfirmDeleteRegistrationModal {...defaultProps} {...props} />);

test('should render component', async () => {
  renderComponent();
  screen.getByRole('heading', {
    name: 'Varmista ilmoittautumisen poistaminen',
  });
  screen.getByText('Varoitus!');
  screen.getByText('Tämä toiminto poistaa ilmoittautumisen lopullisesti.');

  screen.getByRole('button', { name: 'Poista ilmoittautuminen' });
  screen.getByRole('button', { name: 'Peruuta' });
});

test('should call onConfirm', async () => {
  const onConfirm = vi.fn();
  const user = userEvent.setup();
  renderComponent({ onConfirm });

  const deleteRegistrationButton = screen.getByRole('button', {
    name: 'Poista ilmoittautuminen',
  });
  await user.click(deleteRegistrationButton);
  expect(onConfirm).toBeCalled();
});

test('should call onClose', async () => {
  const onClose = vi.fn();
  const user = userEvent.setup();
  renderComponent({ onClose });

  const closeButton = screen.getByRole('button', { name: 'Peruuta' });
  await user.click(closeButton);

  expect(onClose).toBeCalled();
});
