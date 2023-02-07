import React from 'react';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import translations from '../../../../app/i18n/fi.json';
import {
  event,
  eventName,
  mocks,
  subEventName,
  subSubEventNames,
} from '../../__mocks__/modals';
import ConfirmPostponeModal, {
  ConfirmPostponeModalProps,
} from '../ConfirmPostponeModal';

configure({ defaultHidden: true });

const defaultProps: ConfirmPostponeModalProps = {
  event,
  isOpen: true,
  isSaving: false,
  onClose: jest.fn(),
  onPostpone: jest.fn(),
};

const renderComponent = (props?: Partial<ConfirmPostponeModalProps>) =>
  render(<ConfirmPostponeModal {...defaultProps} {...props} />, { mocks });

test('should render component', async () => {
  renderComponent();
  screen.getByRole('heading', { name: 'Varmista tapahtuman lykkääminen' });
  screen.getByText(translations.common.warning);
  screen.getByText(translations.event.postponeEventModal.text1);
  screen.getByText(translations.event.postponeEventModal.text2);

  screen.getByText(eventName);
  await screen.findByText(subEventName);
  for (const subSubEventName of subSubEventNames) {
    await screen.findByText(subSubEventName);
  }

  screen.getByRole('button', { name: 'Lykkää tapahtumaa' });
  screen.getByRole('button', { name: 'Peruuta' });
});

test('should call onPostpone', async () => {
  const onPostpone = jest.fn();
  const user = userEvent.setup();

  renderComponent({ onPostpone });

  const postponeEventButton = screen.getByRole('button', {
    name: 'Lykkää tapahtumaa',
  });
  await user.click(postponeEventButton);
  expect(onPostpone).toBeCalled();
});

test('should call onClose', async () => {
  const onClose = jest.fn();
  const user = userEvent.setup();

  renderComponent({ onClose });

  const closeButton = screen.getByRole('button', { name: 'Peruuta' });
  await user.click(closeButton);
  expect(onClose).toBeCalled();
});
