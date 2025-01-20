import { MockedResponse } from '@apollo/client/testing';

import {
  PostFeedbackDocument,
  PostGuestFeedbackDocument,
} from '../../../../../generated/graphql';
import { fakeFeedback } from '../../../../../utils/mockDataUtils';
import {
  fakeOidcUserProfileState,
  fakeOidcUserState,
  mockAuthenticatedLoginState,
  mockUnauthenticatedLoginState,
} from '../../../../../utils/mockLoginHooks';
import {
  act,
  configure,
  CustomRenderOptions,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import { mockedUserResponse } from '../../../../user/__mocks__/user';
import { isContactInfoSentSuccessfully } from '../../testUtils';
import ContactPage from '../ContactPage';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState({
    user: fakeOidcUserState({
      profile: fakeOidcUserProfileState({
        name: values.name,
        email: values.email,
      }),
    }),
  });
});

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
  request: { query: PostFeedbackDocument, variables: postFeedbackVariables },
  result: postFeedbackResponse,
};

const mockedInvalidPostFeedbackResponse: MockedResponse = {
  request: { query: PostFeedbackDocument, variables: postFeedbackVariables },
  error: {
    ...new Error(),
    result: { body: ['Arvo saa olla enintään 255 merkkiä pitkä.'] },
  } as Error,
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

type GetElementKey =
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
  | 'topicToggleButton';

const getElement = (key: GetElementKey) => {
  switch (key) {
    case 'body':
      return screen.getByLabelText(/viesti/i);
    case 'email':
      return screen.getByLabelText(/sähköpostiosoite/i);
    case 'eventFormTopicOption':
      return screen.getByRole('option', { name: /ongelma syöttölomakkeessa/i });
    case 'featureRequestTopicOption':
      return screen.getByRole('option', { name: /ominaisuustoive/i });
    case 'generalTopicOption':
      return screen.getByRole('option', { name: /yleinen palaute/i });
    case 'name':
      return screen.getByLabelText(/nimi/i);
    case 'otherTopicOption':
      return screen.getByRole('option', { name: /muu asia/i });
    case 'permissionsTopicOption':
      return screen.getByRole('option', { name: /käyttöoikeudet/i });
    case 'sendButton':
      return screen.getByRole('button', { name: /lähetä/i });
    case 'subject':
      return screen.getByLabelText(/otsikko/i);
    case 'topicToggleButton':
      return screen.getByRole('combobox', { name: /yhteydenoton aihe/i });
  }
};

const enterCommonValues = async () => {
  const user = userEvent.setup();

  const topicToggleButton = getElement('topicToggleButton');
  const subjectInput = getElement('subject');
  const bodyInput = getElement('body');

  await user.click(topicToggleButton);
  const generalTopic = getElement('generalTopicOption');
  await user.click(generalTopic);
  await user.type(subjectInput, values.subject);
  await user.type(bodyInput, values.body);

  return { bodyInput, subjectInput, topicToggleButton };
};

const renderComponent = (options?: CustomRenderOptions) =>
  render(<ContactPage />, options);

test('should scroll to first error', async () => {
  mockUnauthenticatedLoginState();
  const user = userEvent.setup();

  renderComponent();

  const nameInput = getElement('name');
  const emailInput = getElement('email');
  const sendButton = getElement('sendButton');

  await user.type(nameInput, values.name);
  await user.click(sendButton);

  await waitFor(() => expect(emailInput).toHaveFocus());
});

test('should scroll to topic selector when topic is not selected', async () => {
  const user = userEvent.setup();

  mockUnauthenticatedLoginState();
  renderComponent();

  const nameInput = getElement('name');
  const emailInput = getElement('email');
  const topicToggleButton = getElement('topicToggleButton');
  const sendButton = getElement('sendButton');

  await user.type(nameInput, values.name);
  await user.type(emailInput, values.email);
  await user.click(sendButton);

  await waitFor(() => expect(topicToggleButton).toHaveFocus());
});

test('should show correct faq items when "event_form" topic is selected', async () => {
  const user = userEvent.setup();

  mockUnauthenticatedLoginState();
  renderComponent({ mocks: [mockedPostGuestFeedbackResponse] });

  const nameInput = getElement('name');
  const emailInput = getElement('email');
  const topicToggleButton = getElement('topicToggleButton');

  await user.type(nameInput, values.name);
  await user.type(emailInput, values.email);
  await user.click(topicToggleButton);
  const eventFormTopic = getElement('eventFormTopicOption');
  await user.click(eventFormTopic);

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

  mockUnauthenticatedLoginState();
  renderComponent({ mocks: [mockedPostGuestFeedbackResponse] });

  const nameInput = getElement('name');
  const emailInput = getElement('email');
  const topicToggleButton = getElement('topicToggleButton');

  await user.type(nameInput, values.name);
  await user.type(emailInput, values.email);
  await user.click(topicToggleButton);
  const permissionsTopic = getElement('permissionsTopicOption');
  await user.click(permissionsTopic);

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
] as [string, GetElementKey][])(
  'should not show any faq item when %p topic is selected',
  async (topic, topicOption) => {
    mockUnauthenticatedLoginState();
    const user = userEvent.setup();

    renderComponent({
      mocks: [mockedPostGuestFeedbackResponse],
    });

    const topicToggleButton = getElement('topicToggleButton');

    await act(async () => await user.click(topicToggleButton));

    const eventFormTopic = getElement('eventFormTopicOption');

    await user.click(eventFormTopic);

    const faqHeadings = [
      'Kuinka pääsen syöttämään tapahtumia Linked Eventsiin?',
      'Syöttölomake ei toimi odotetulla tavalla, mitä voin tehdä?',
      'Lisäämäni tapahtuma ei näy palvelussa, missä vika?',
      'Saako Linked Events-rajapintaa käyttää omiin projekteihin?',
      'Kenellä on oikeus lisätä julkisia tapahtumia?',
      'Voinko lisätä mitä tahansa kuvia tapahtumiin?',
    ];

    expect(
      await screen.findByRole('button', { name: faqHeadings[0] })
    ).toBeInTheDocument();

    await act(() => user.click(topicToggleButton));

    const option = getElement(topicOption);

    await user.click(option);

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
  mockUnauthenticatedLoginState();
  const user = userEvent.setup();

  renderComponent({ mocks: [mockedPostGuestFeedbackResponse] });

  const nameInput = getElement('name');
  const emailInput = getElement('email');
  const sendButton = getElement('sendButton');

  await user.type(nameInput, values.name);
  await user.type(emailInput, values.email);
  await enterCommonValues();
  await user.click(sendButton);

  await isContactInfoSentSuccessfully();
});

test('should succesfully send feedback when user is signed in', async () => {
  const user = userEvent.setup();

  renderComponent({
    mocks: [mockedUserResponse, mockedPostFeedbackResponse],
  });

  const sendButton = getElement('sendButton');

  await enterCommonValues();
  await user.click(sendButton);

  await isContactInfoSentSuccessfully();
});

test('should show server errors', async () => {
  const user = userEvent.setup();

  renderComponent({
    mocks: [mockedUserResponse, mockedInvalidPostFeedbackResponse],
  });

  await enterCommonValues();

  const sendButton = getElement('sendButton');
  await user.click(sendButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/arvo saa olla enintään 255 merkkiä pitkä./i);
});
