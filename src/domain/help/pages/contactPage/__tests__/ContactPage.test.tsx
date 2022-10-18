import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import {
  PostFeedbackDocument,
  PostGuestFeedbackDocument,
} from '../../../../../generated/graphql';
import {
  fakeAuthenticatedAuthContextValue,
  fakeOidcReducerState,
  fakeOidcUserProfileState,
  fakeOidcUserState,
} from '../../../../../utils/mockAuthContextValue';
import { fakeFeedback } from '../../../../../utils/mockDataUtils';
import {
  act,
  configure,
  CustomRenderOptions,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
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
const postFeedbackResponse = { data: { postFeedback: fakeFeedback(payload) } };
const mockedPostFeedbackResponse: MockedResponse = {
  request: {
    query: PostFeedbackDocument,
    variables: postFeedbackVariables,
  },
  result: postFeedbackResponse,
};
const postGuestFeedbackResponse = {
  data: { postGuestFeedback: fakeFeedback(payload) },
};
const mockedPostGuestFeedbackResponse: MockedResponse = {
  request: {
    query: PostGuestFeedbackDocument,
    variables: postFeedbackVariables,
  },
  result: postGuestFeedbackResponse,
};

type ElementKey =
  | 'body'
  | 'email'
  | 'eventFormTopicOption'
  | 'featureRequestTopicOption'
  | 'generalTopicOption'
  | 'name'
  | 'otherTopicOption'
  | 'permissionsTopicOption'
  | 'sendButton'
  | 'subject'
  | 'success'
  | 'topicToggleButton';

const getElement = (key: ElementKey) => {
  switch (key) {
    case 'body':
      return screen.getByRole('textbox', { name: /viesti/i });
    case 'email':
      return screen.getByRole('textbox', { name: /sähköpostiosoite/i });
    case 'eventFormTopicOption':
      return screen.getByRole('option', { name: /ongelma syöttölomakkeessa/i });
    case 'featureRequestTopicOption':
      return screen.getByRole('option', { name: /ominaisuustoive/i });
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
  const user = userEvent.setup();
  renderComponent();

  const nameInput = getElement('name');
  const emailInput = getElement('email');
  const sendButton = getElement('sendButton');

  await act(async () => await user.type(nameInput, values.name));
  await act(async () => await user.click(sendButton));

  await waitFor(() => expect(emailInput).toHaveFocus());
});

test('should scroll to topic selector when topic is not selected', async () => {
  const user = userEvent.setup();
  renderComponent();

  const nameInput = getElement('name');
  const emailInput = getElement('email');
  const topicToggleButton = getElement('topicToggleButton');
  const sendButton = getElement('sendButton');

  await act(async () => await user.type(nameInput, values.name));
  await act(async () => await user.type(emailInput, values.email));
  await act(async () => await user.click(sendButton));

  await waitFor(() => expect(topicToggleButton).toHaveFocus());
});

test('should show correct faq items when "event_form" topic is selected', async () => {
  const user = userEvent.setup();
  renderComponent({ mocks: [mockedPostGuestFeedbackResponse] });

  const nameInput = getElement('name');
  const emailInput = getElement('email');
  const topicToggleButton = getElement('topicToggleButton');

  await act(async () => await user.type(nameInput, values.name));
  await act(async () => await user.type(emailInput, values.email));
  await act(async () => await user.click(topicToggleButton));
  const eventFormTopic = getElement('eventFormTopicOption');
  await act(async () => await user.click(eventFormTopic));

  const faqHeadings = [
    'Kuinka pääsen syöttämään tapahtumia Linked Eventsiin?',
    'Syöttölomake ei toimi odotetulla tavalla, mitä voin tehdä?',
    'Lisäämäni tapahtuma ei näy palvelussa, missä vika?',
  ];

  await screen.findByRole('button', { name: faqHeadings[0] });
  faqHeadings.slice(1).forEach((name) => screen.getByRole('button', { name }));
});

test('should show correct faq items when "permissions" topic is selected', async () => {
  const user = userEvent.setup();
  renderComponent({ mocks: [mockedPostGuestFeedbackResponse] });

  const nameInput = getElement('name');
  const emailInput = getElement('email');
  const topicToggleButton = getElement('topicToggleButton');

  await act(async () => await user.type(nameInput, values.name));
  await act(async () => await user.type(emailInput, values.email));
  await act(async () => await user.click(topicToggleButton));
  const permissionsTopic = getElement('permissionsTopicOption');
  await act(async () => await user.click(permissionsTopic));

  const faqHeadings = [
    'Saako Linked Events-rajapintaa käyttää omiin projekteihin?',
    'Kenellä on oikeus lisätä julkisia tapahtumia?',
    'Voinko lisätä mitä tahansa kuvia tapahtumiin?',
  ];

  await screen.findByRole('button', { name: faqHeadings[0] });
  faqHeadings.slice(1).forEach((name) => screen.getByRole('button', { name }));
});

test.each([
  ['feature_request', 'featureRequestTopicOption'],
  ['general', 'generalTopicOption'],
  ['other', 'otherTopicOption'],
] as [string, ElementKey][])(
  'should not show any faq item when %p topic is selected',
  async (topic, topicOption) => {
    const user = userEvent.setup();
    renderComponent({ mocks: [mockedPostGuestFeedbackResponse] });

    const topicToggleButton = getElement('topicToggleButton');

    await act(async () => await user.click(topicToggleButton));

    const eventFormTopic = getElement('eventFormTopicOption');
    await act(async () => await user.click(eventFormTopic));

    const faqHeadings = [
      'Kuinka pääsen syöttämään tapahtumia Linked Eventsiin?',
      'Syöttölomake ei toimi odotetulla tavalla, mitä voin tehdä?',
      'Lisäämäni tapahtuma ei näy palvelussa, missä vika?',
      'Saako Linked Events-rajapintaa käyttää omiin projekteihin?',
      'Kenellä on oikeus lisätä julkisia tapahtumia?',
      'Voinko lisätä mitä tahansa kuvia tapahtumiin?',
    ];

    await screen.findByRole('button', { name: faqHeadings[0] });

    await act(async () => await user.click(topicToggleButton));
    const option = getElement(topicOption);
    await act(async () => await user.click(option));

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
  }
);

test('should succesfully send feedback when user is not signed in', async () => {
  const user = userEvent.setup();
  renderComponent({ mocks: [mockedPostGuestFeedbackResponse] });

  const nameInput = getElement('name');
  const emailInput = getElement('email');
  const topicToggleButton = getElement('topicToggleButton');
  const subjectInput = getElement('subject');
  const bodyInput = getElement('body');
  const sendButton = getElement('sendButton');

  await act(async () => await user.type(nameInput, values.name));
  await act(async () => await user.type(emailInput, values.email));
  await act(async () => await user.click(topicToggleButton));
  const generalTopic = getElement('generalTopicOption');
  await act(async () => await user.click(generalTopic));
  await act(async () => await user.type(subjectInput, values.subject));
  await act(async () => await user.type(bodyInput, values.body));
  await act(async () => await user.click(sendButton));

  await waitFor(() => expect(nameInput).toHaveFocus());
  getElement('success');
});

test('should succesfully send feedback when user is signed in', async () => {
  const authContextValue = fakeAuthenticatedAuthContextValue(
    fakeOidcReducerState({
      user: fakeOidcUserState({ profile: fakeOidcUserProfileState(values) }),
    })
  );

  const user = userEvent.setup();
  renderComponent({ mocks: [mockedPostFeedbackResponse], authContextValue });

  const topicToggleButton = getElement('topicToggleButton');
  const subjectInput = getElement('subject');
  const bodyInput = getElement('body');
  const sendButton = getElement('sendButton');

  await act(async () => await user.click(topicToggleButton));
  const generalTopic = getElement('generalTopicOption');
  await act(async () => await user.click(generalTopic));
  await act(async () => await user.type(subjectInput, values.subject));
  await act(async () => await user.type(bodyInput, values.body));
  await act(async () => await user.click(sendButton));

  await waitFor(() => expect(subjectInput).toHaveFocus());
  getElement('success');
});
