import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import ConfirmDeleteKeywordModal, {
  ConfirmDeleteKeywordModalProps,
} from '../ConfirmDeleteKeywordModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmDeleteKeywordModalProps = {
  isOpen: true,
  isSaving: false,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
};

const renderComponent = (props?: Partial<ConfirmDeleteKeywordModalProps>) =>
  render(<ConfirmDeleteKeywordModal {...defaultProps} {...props} />);

test('should render component', async () => {
  renderComponent();
  screen.getByRole('heading', { name: 'Varmista avainsanan poistaminen' });
  screen.getByText('Varoitus!');
  screen.getByText('Tämä toiminto poistaa avainsanan lopullisesti.');

  screen.getByRole('button', { name: 'Poista avainsana' });
  screen.getByRole('button', { name: 'Peruuta' });
});

test('should call onConfirm', async () => {
  const onConfirm = vi.fn();
  const user = userEvent.setup();
  renderComponent({ onConfirm });

  const deleteButton = screen.getByRole('button', { name: 'Poista avainsana' });
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
