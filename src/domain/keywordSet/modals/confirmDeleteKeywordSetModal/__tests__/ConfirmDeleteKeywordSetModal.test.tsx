import React from 'react';
import { vi } from 'vitest';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import ConfirmDeleteKeywordSetModal, {
  ConfirmDeleteKeywordSetModalProps,
} from '../ConfirmDeleteKeywordSetModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmDeleteKeywordSetModalProps = {
  isOpen: true,
  isSaving: false,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
};

const renderComponent = (props?: Partial<ConfirmDeleteKeywordSetModalProps>) =>
  render(<ConfirmDeleteKeywordSetModal {...defaultProps} {...props} />);

test('should render component', async () => {
  renderComponent();
  screen.getByRole('heading', { name: 'Varmista avainsanaryhmän poistaminen' });
  screen.getByText('Varoitus!');
  screen.getByText('Tämä toiminto poistaa avainsanaryhmän lopullisesti.');

  screen.getByRole('button', { name: 'Poista avainsanaryhmä' });
  screen.getByRole('button', { name: 'Peruuta' });
});

test('should call onConfirm', async () => {
  const onConfirm = vi.fn();
  const user = userEvent.setup();
  renderComponent({ onConfirm });

  const deleteButton = screen.getByRole('button', {
    name: 'Poista avainsanaryhmä',
  });
  await user.click(deleteButton);
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
