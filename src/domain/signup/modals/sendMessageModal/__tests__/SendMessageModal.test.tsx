import React from 'react';

import {
  configure,
  fireEvent,
  pasteToTextEditor,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import { signupGroup } from '../../../../signupGroup/__mocks__/editSignupGroupPage';
import { signup } from '../../../__mocks__/signup';
import SendMessageModal, { SendMessageModalProps } from '../SendMessageModal';

configure({ defaultHidden: true });

const defaultProps: SendMessageModalProps = {
  isOpen: true,
  isSaving: false,
  onClose: vi.fn(),
  onSendMessage: vi.fn(),
};

const renderComponent = (props: Partial<SendMessageModalProps>) =>
  render(<SendMessageModal {...defaultProps} {...props} />);

const getModalElements = async () => {
  const sendMessageButton = screen.getByRole('button', {
    name: 'Lähetä viesti',
  });
  const subjectInput = screen.getByLabelText(/Otsikko/i);
  const messageInput = await screen.findByLabelText(
    /editorin muokkausalue: main/i
  );
  return {
    messageInput,
    sendMessageButton,
    subjectInput,
  };
};

const sendMessage = async () => {
  const user = userEvent.setup();
  const { messageInput, sendMessageButton, subjectInput } =
    await getModalElements();

  fireEvent.change(subjectInput, { target: { value: 'Subject' } });
  pasteToTextEditor(messageInput, 'Message');
  await user.click(sendMessageButton);
};

test('should validate fields and call onSendMessage', async () => {
  // Mock getClientRects for ckeditor
  global.Range.prototype.getClientRects = vi.fn().mockImplementation(() => []);

  const onSendMessage = vi.fn();
  const user = userEvent.setup();
  renderComponent({ onSendMessage });

  screen.getByRole('heading', { name: 'Lähetä viesti osallistujille' });
  const { messageInput, sendMessageButton, subjectInput } =
    await getModalElements();
  await user.click(sendMessageButton);
  expect(subjectInput).toHaveFocus();

  fireEvent.change(subjectInput, { target: { value: 'Subject' } });
  await user.click(sendMessageButton);
  expect(messageInput).toHaveFocus();

  pasteToTextEditor(messageInput, 'Message');
  await user.click(sendMessageButton);
  expect(onSendMessage).toBeCalledWith({
    signupGroups: undefined,
    signups: undefined,
    values: {
      'send-message': {
        body: '<p>Message</p>',
        subject: 'Subject',
      },
    },
  });
});

test('should call onSendMessage when sending message to a signup', async () => {
  // Mock getClientRects for ckeditor
  global.Range.prototype.getClientRects = vi.fn().mockImplementation(() => []);

  const onSendMessage = vi.fn();
  renderComponent({ onSendMessage, signup });

  screen.getByRole('heading', { name: 'Lähetä viesti osallistujalle' });
  await sendMessage();
  expect(onSendMessage).toBeCalledWith({
    signupGroups: undefined,
    signups: [signup.id],
    values: {
      'send-message': {
        body: '<p>Message</p>',
        subject: 'Subject',
      },
    },
  });
});

test('should call onSendMessage when sending message to a signup group', async () => {
  // Mock getClientRects for ckeditor
  global.Range.prototype.getClientRects = vi.fn().mockImplementation(() => []);

  const onSendMessage = vi.fn();
  renderComponent({ onSendMessage, signupGroup });

  screen.getByRole('heading', { name: 'Lähetä viesti osallistujalle' });
  await sendMessage();
  expect(onSendMessage).toBeCalledWith({
    signupGroups: [signupGroup.id],
    signups: undefined,
    values: {
      'send-message': {
        body: '<p>Message</p>',
        subject: 'Subject',
      },
    },
  });
});

test('should call onClose', async () => {
  const onClose = vi.fn();
  const user = userEvent.setup();
  renderComponent({ onClose });

  const closeButton = screen.getByRole('button', { name: 'Peruuta' });
  await user.click(closeButton);
  expect(onClose).toBeCalled();
});
