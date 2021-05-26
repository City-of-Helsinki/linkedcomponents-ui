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
const payload = {
  ...values,
  body: `Yleinen palaute:\n\n${values.body}`,
};

const postFeedbackVariables = { input: payload };
const postFeedbackResponse = { data: fakeFeedback(payload) };
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
  key:
    | 'body'
    | 'email'
    | 'eventFormTopicOption'
    | 'generalTopicOption'
    | 'name'
    | 'otherTopicOption'
    | 'permissionsTopicOption'
    | 'sendButton'
    | 'subject'
    | 'success'
    | 'topicToggleButton'
) => {
  switch (key) {
    case 'body':
      return screen.getByRole('textbox', { name: /viesti/i });
    case 'email':
      return screen.getByRole('textbox', { name: /sähköpostiosoite/i });
    case 'eventFormTopicOption':
      return screen.getByRole('option', { name: /ongelma syöttölomakkeessa/i });
    case 'generalTopicOption':
      return screen.getByRole('option', { name: /yleinen palaute/i });
    case 'name':
      return screen.getByRole('textbox', { name: /nimi/i });
    case 'otherTopicOption':
      return screen.getByRole('option', { name: /muu asia/i });
    case 'permissionsTopicOption':
      return screen.getByRole('option', { name: /käyttöoikeudet/i });
    case 'sendButton':
      return screen.getByRole('button', { name: /lähetä/i });
    case 'subject':
      return screen.getByRole('textbox', { name: /otsikko/i });
    case 'success':
      return screen.getByRole('heading', { name: /kiitos yhteydenotostasi/i });
    case 'topicToggleButton':
      return screen.getByRole('button', { name: /yhteydenoton aihe/i });
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

test('should scroll to topic selector when topic is not selected', async () => {
  renderComponent();
  const nameInput = getElement('name');
  const emailInput = getElement('email');
  const topicToggleButton = getElement('topicToggleButton');
  const sendButton = getElement('sendButton');

  userEvent.type(nameInput, values.name);
  userEvent.type(emailInput, values.email);
  userEvent.click(sendButton);

  await waitFor(() => expect(topicToggleButton).toHaveFocus());
});

test('should show correct faq items when "event_form" topic is selected', async () => {
  renderComponent({ mocks: [mockedPostGuestFeedbackResponse] });
  const nameInput = getElement('name');
  const emailInput = getElement('email');
  const topicToggleButton = getElement('topicToggleButton');

  userEvent.type(nameInput, values.name);
  userEvent.type(emailInput, values.email);
  userEvent.click(topicToggleButton);
  const eventFormTopic = getElement('eventFormTopicOption');
  userEvent.click(eventFormTopic);

  const faqHeadings = [
    'Kuinka pääsen syöttämään tapahtumia Linked Eventsiin?',
    'Syöttölomake ei toimi odotetulla tavalla, mitä voin tehdä?',
    'Lisäämäni tapahtuma ei näy palvelussa, missä vika?',
  ];

  await screen.findByRole('button', { name: faqHeadings[0] });
  faqHeadings.slice(1).forEach((name) => screen.getByRole('button', { name }));
});

test('should show correct faq items when "permissions" topic is selected', async () => {
  renderComponent({ mocks: [mockedPostGuestFeedbackResponse] });
  const nameInput = getElement('name');
  const emailInput = getElement('email');
  const topicToggleButton = getElement('topicToggleButton');

  userEvent.type(nameInput, values.name);
  userEvent.type(emailInput, values.email);
  userEvent.click(topicToggleButton);
  const permissionsTopic = getElement('permissionsTopicOption');
  userEvent.click(permissionsTopic);

  const faqHeadings = [
    'Saako Linked Events-rajapintaa käyttää omiin projekteihin?',
    'Kenellä on oikeus lisätä julkisia tapahtumia?',
    'Voinko lisätä mitä tahansa kuvia tapahtumiin?',
  ];

  await screen.findByRole('button', { name: faqHeadings[0] });
  faqHeadings.slice(1).forEach((name) => screen.getByRole('button', { name }));
});

test('should not show any faq item when "other" topic is selected', async () => {
  renderComponent({ mocks: [mockedPostGuestFeedbackResponse] });
  const topicToggleButton = getElement('topicToggleButton');

  userEvent.click(topicToggleButton);

  const eventFormTopic = getElement('eventFormTopicOption');
  userEvent.click(eventFormTopic);

  const faqHeadings = [
    'Kuinka pääsen syöttämään tapahtumia Linked Eventsiin?',
    'Syöttölomake ei toimi odotetulla tavalla, mitä voin tehdä?',
    'Lisäämäni tapahtuma ei näy palvelussa, missä vika?',
    'Saako Linked Events-rajapintaa käyttää omiin projekteihin?',
    'Kenellä on oikeus lisätä julkisia tapahtumia?',
    'Voinko lisätä mitä tahansa kuvia tapahtumiin?',
  ];

  await screen.findByRole('button', { name: faqHeadings[0] });

  userEvent.click(topicToggleButton);
  const otherTopicOption = getElement('otherTopicOption');
  userEvent.click(otherTopicOption);

  await waitFor(() =>
    expect(
      screen.queryByRole('button', { name: faqHeadings[0] })
    ).not.toBeInTheDocument()
  );
  faqHeadings
    .slice(1)
    .forEach((name) =>
      expect(screen.queryByRole('button', { name })).not.toBeInTheDocument()
    );
});

test('should succesfully send feedback when user is not signed in', async () => {
  renderComponent({ mocks: [mockedPostGuestFeedbackResponse] });
  const nameInput = getElement('name');
  const emailInput = getElement('email');
  const topicToggleButton = getElement('topicToggleButton');
  const subjectInput = getElement('subject');
  const bodyInput = getElement('body');
  const sendButton = getElement('sendButton');

  userEvent.type(nameInput, values.name);
  userEvent.type(emailInput, values.email);
  userEvent.click(topicToggleButton);
  const generalTopic = getElement('generalTopicOption');
  userEvent.click(generalTopic);
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

  const topicToggleButton = getElement('topicToggleButton');
  const subjectInput = getElement('subject');
  const bodyInput = getElement('body');
  const sendButton = getElement('sendButton');

  userEvent.click(topicToggleButton);
  const generalTopic = getElement('generalTopicOption');
  userEvent.click(generalTopic);
  userEvent.type(subjectInput, values.subject);
  userEvent.type(bodyInput, values.body);
  userEvent.click(sendButton);

  await waitFor(() => expect(subjectInput).toHaveFocus());
  getElement('success');
});
