import React from 'react';

import {
  configure,
  fireEvent,
  pasteToTextEditor,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import { signup } from '../../../__mocks__/signup';
import SendMessageModal, { SendMessageModalProps } from '../SendMessageModal';

configure({ defaultHidden: true });

const defaultProps: SendMessageModalProps = {
  isOpen: true,
  isSaving: false,
  onClose: jest.fn(),
  onSendMessage: jest.fn(),
  signup,
};

const renderComponent = (props: Partial<SendMessageModalProps>) =>
  render(<SendMessageModal {...defaultProps} {...props} />);

test('should validate fields and call onSendMessage', async () => {
  // Mock getClientRects for ckeditor
  global.Range.prototype.getClientRects = jest
    .fn()
    .mockImplementation(() => []);

  const onSendMessage = jest.fn();
  const user = userEvent.setup();
  renderComponent({ signup: undefined, onSendMessage });

  screen.getByRole('heading', { name: 'Lähetä viesti osallistujille' });
  const cancelEventButton = screen.getByRole('button', {
    name: 'Lähetä viesti',
  });
  const subjectInput = screen.getByLabelText(/Otsikko/i);
  const messageInput = await screen.findByLabelText(
    /editorin muokkausalue: main/i
  );
  await user.click(cancelEventButton);
  expect(subjectInput).toHaveFocus();

  fireEvent.change(subjectInput, { target: { value: 'Subject' } });
  await user.click(cancelEventButton);
  expect(messageInput).toHaveFocus();

  pasteToTextEditor(messageInput, 'Message');
  await user.click(cancelEventButton);
  expect(onSendMessage).toBeCalledWith({
    'send-message': {
      body: '<p>Message</p>',
      subject: 'Subject',
    },
  });
});

test('should call onSendMessage when sending message to a single signup', async () => {
  // Mock getClientRects for ckeditor
  global.Range.prototype.getClientRects = jest
    .fn()
    .mockImplementation(() => []);

  const onSendMessage = jest.fn();
  const user = userEvent.setup();
  renderComponent({ onSendMessage });

  screen.getByRole('heading', { name: 'Lähetä viesti osallistujalle' });
  const subjectInput = screen.getByLabelText(/Otsikko/i);
  const messageInput = await screen.findByLabelText(
    /editorin muokkausalue: main/i
  );
  fireEvent.change(subjectInput, { target: { value: 'Subject' } });
  pasteToTextEditor(messageInput, 'Message');

  const cancelEventButton = screen.getByRole('button', {
    name: 'Lähetä viesti',
  });
  await user.click(cancelEventButton);
  expect(onSendMessage).toBeCalledWith(
    {
      'send-message': {
        body: '<p>Message</p>',
        subject: 'Subject',
      },
    },
    [signup.id]
  );
});

test('should call onClose', async () => {
  const onClose = jest.fn();
  const user = userEvent.setup();
  renderComponent({ onClose });

  const closeButton = screen.getByRole('button', { name: 'Peruuta' });
  await user.click(closeButton);
  expect(onClose).toBeCalled();
});
