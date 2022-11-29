import React from 'react';

import {
  act,
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import PersonsAddedToWaitingListModal, {
  PersonsAddedToWaitingListModalProps,
} from '../PersonsAddedToWaitingListModal';

configure({ defaultHidden: true });

const defaultProps: PersonsAddedToWaitingListModalProps = {
  isOpen: true,
  onClose: jest.fn(),
};

const renderComponent = (props: Partial<PersonsAddedToWaitingListModalProps>) =>
  render(<PersonsAddedToWaitingListModal {...defaultProps} {...props} />);

test('should call onClose', async () => {
  const onClose = jest.fn();
  const user = userEvent.setup();
  renderComponent({ onClose });

  const closeButton = screen.getByRole('button', { name: 'Sulje' });
  await act(async () => await user.click(closeButton));
});
