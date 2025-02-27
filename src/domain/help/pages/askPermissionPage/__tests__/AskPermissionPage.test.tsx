import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { PostFeedbackDocument } from '../../../../../generated/graphql';
import getValue from '../../../../../utils/getValue';
import { fakeFeedback } from '../../../../../utils/mockDataUtils';
import {
  fakeOidcUserProfileState,
  fakeOidcUserState,
  mockAuthenticatedLoginState,
  mockUnauthenticatedLoginState,
} from '../../../../../utils/mockLoginHooks';
import {
  configure,
  CustomRenderOptions,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import {
  mockedOrganizationsResponse,
  organizations,
} from '../../../../organizations/__mocks__/organizationsPage';
import { mockedUserResponse } from '../../../../user/__mocks__/user';
import { isContactInfoSentSuccessfully } from '../../testUtils';
import AskPermissionPage from '../AskPermissionPage';

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
  jobDescription: 'Front-end developer',
  name: "User's name",
};

const payload = {
  email: values.email,
  name: values.name,
  subject: 'Käyttöoikeuspyyntö',
  body:
    'Organisaatio: Organization 1\n' +
    'ID: organization:1\n' +
    'Toimenkuva: Front-end developer\n' +
    '\n' +
    'Feedback message',
};

const commonMocks = [mockedOrganizationsResponse, mockedUserResponse];

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

type GetElementKey =
  | 'body'
  | 'email'
  | 'jobDescription'
  | 'name'
  | 'organizationOption'
  | 'organizationToggleButton'
  | 'sendButton';

const getElement = (key: GetElementKey) => {
  switch (key) {
    case 'body':
      return screen.getByLabelText(/viesti/i);
    case 'email':
      return screen.getByLabelText(/sähköpostiosoite/i);
    case 'jobDescription':
      return screen.getByLabelText(/toimenkuva/i);
    case 'name':
      return screen.getByLabelText(/nimi/i);
    case 'organizationOption':
      return screen.getByRole('option', {
        name: getValue(organizations.data[0]?.name, ''),
      });
    case 'organizationToggleButton':
      return screen.getByRole('combobox', { name: /organisaatio/i });
    case 'sendButton':
      return screen.getByRole('button', { name: /lähetä/i });
  }
};

const renderComponent = (options?: CustomRenderOptions) =>
  render(<AskPermissionPage />, {
    ...options,
    mocks: [...commonMocks, ...getValue(options?.mocks, [])],
  });

const selectOrganization = async () => {
  const user = userEvent.setup();
  const organizationToggleButton = getElement('organizationToggleButton');

  await user.click(organizationToggleButton);
  const organizationOption = getElement('organizationOption');
  await user.click(organizationOption);

  return { organizationToggleButton };
};

const enterCommonValues = async () => {
  const user = userEvent.setup();

  const jobDescriptionInput = getElement('jobDescription');
  const bodyInput = getElement('body');

  const { organizationToggleButton } = await selectOrganization();
  await user.type(jobDescriptionInput, values.jobDescription);
  await user.type(bodyInput, values.body);

  return { organizationToggleButton, jobDescriptionInput, bodyInput };
};

test('should disable all fields if user is not authenticated', async () => {
  mockUnauthenticatedLoginState();
  await renderComponent();

  const nameInput = getElement('name');
  const emailInput = getElement('email');
  const sendButton = getElement('sendButton');
  const organizationToggleButton = getElement('organizationToggleButton');
  const jobDescriptionInput = getElement('jobDescription');
  const bodyInput = getElement('body');

  expect(nameInput).toBeDisabled();
  expect(emailInput).toBeDisabled();
  expect(organizationToggleButton.getAttribute('aria-disabled')).toBe('true');
  expect(jobDescriptionInput).toBeDisabled();
  expect(bodyInput).toBeDisabled();
  expect(sendButton).toBeDisabled();
});

test('should scroll to organization selector when organization is not selected', async () => {
  const user = userEvent.setup();

  renderComponent({ mocks: [mockedPostFeedbackResponse] });

  const organizationToggleButton = getElement('organizationToggleButton');
  const sendButton = getElement('sendButton');

  await user.click(sendButton);

  await waitFor(() => expect(organizationToggleButton).toHaveFocus());
});

test('should scroll to job description when it is empty', async () => {
  const user = userEvent.setup();

  renderComponent();

  const jobDescriptionInput = getElement('jobDescription');
  const sendButton = getElement('sendButton');
  await selectOrganization();

  await user.click(sendButton);

  await waitFor(() => expect(jobDescriptionInput).toHaveFocus());
});

test('should succesfully send access request when user is signed in', async () => {
  const user = userEvent.setup();

  renderComponent({ mocks: [mockedPostFeedbackResponse] });

  await enterCommonValues();

  const sendButton = getElement('sendButton');
  await user.click(sendButton);

  await isContactInfoSentSuccessfully();
});

test('should show server errors', async () => {
  const user = userEvent.setup();

  renderComponent({
    mocks: [mockedInvalidPostFeedbackResponse],
  });

  await enterCommonValues();

  const sendButton = getElement('sendButton');
  await user.click(sendButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/arvo saa olla enintään 255 merkkiä pitkä./i);
});
