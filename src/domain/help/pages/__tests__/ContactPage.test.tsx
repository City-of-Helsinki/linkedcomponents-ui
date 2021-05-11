import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import {
  PostFeedbackDocument,
  PostGuestFeedbackDocument,
} from '../../../../generated/graphql';
import { fakeFeedback } from '../../../../utils/mockDataUtils';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import {
  configure,
  CustomRenderOptions,
  getMockReduxStore,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import ContactPage from '../ContactPage';

configure({ defaultHidden: true });

const values = {
  body: 'Feedback message',
  email: 'name@email.com',
  name: "User's name",
  subject: 'Subject',
};

const postFeedbackVariables = { input: values };
const postFeedbackResponse = { data: fakeFeedback(values) };
const mockedPostFeedbackResponse: MockedResponse = {
  request: {
    query: PostFeedbackDocument,
    variables: postFeedbackVariables,
  },
  result: postFeedbackResponse,
};
const mockedPostGuestFeedbackResponse: MockedResponse = {
  request: {
    query: PostGuestFeedbackDocument,
    variables: postFeedbackVariables,
  },
  result: postFeedbackResponse,
};

const getElement = (
  key: 'body' | 'email' | 'name' | 'sendButton' | 'subject' | 'success'
) => {
  switch (key) {
    case 'body':
      return screen.getByRole('textbox', { name: /viesti/i });
    case 'email':
      return screen.getByRole('textbox', { name: /sähköpostiosoite/i });
    case 'name':
      return screen.getByRole('textbox', { name: /nimi/i });
    case 'sendButton':
      return screen.getByRole('button', { name: /lähetä/i });
    case 'subject':
      return screen.getByRole('textbox', { name: /otsikko/i });
    case 'success':
      return screen.getByRole('heading', { name: /kiitos yhteydenotostasi/i });
  }
};

const renderComponent = (options?: CustomRenderOptions) =>
  render(<ContactPage />, options);

test('should scroll to first error', async () => {
  renderComponent();
  const nameInput = getElement('name');
  const emailInput = getElement('email');
  const sendButton = getElement('sendButton');

  userEvent.type(nameInput, values.name);
  userEvent.click(sendButton);

  await waitFor(() => expect(emailInput).toHaveFocus());
});

test('should succesfully send feedback when user is not signed in', async () => {
  renderComponent({ mocks: [mockedPostGuestFeedbackResponse] });
  const nameInput = getElement('name');
  const emailInput = getElement('email');
  const subjectInput = getElement('subject');
  const bodyInput = getElement('body');
  const sendButton = getElement('sendButton');

  userEvent.type(nameInput, values.name);
  userEvent.type(emailInput, values.email);
  userEvent.type(subjectInput, values.subject);
  userEvent.type(bodyInput, values.body);
  userEvent.click(sendButton);

  await waitFor(() => expect(nameInput).toHaveFocus());
  getElement('success');
});

test('should succesfully send feedback when user is signed in', async () => {
  const state = fakeAuthenticatedStoreState();
  state.authentication.oidc.user.profile.email = values.email;
  state.authentication.oidc.user.profile.name = values.name;
  const store = getMockReduxStore(state);
  renderComponent({ mocks: [mockedPostFeedbackResponse], store });

  const subjectInput = getElement('subject');
  const bodyInput = getElement('body');
  const sendButton = getElement('sendButton');

  userEvent.type(subjectInput, values.subject);
  userEvent.type(bodyInput, values.body);
  userEvent.click(sendButton);

  await waitFor(() => expect(subjectInput).toHaveFocus());
  getElement('success');
});
