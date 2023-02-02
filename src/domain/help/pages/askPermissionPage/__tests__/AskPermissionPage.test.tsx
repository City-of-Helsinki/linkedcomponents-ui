import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { PostFeedbackDocument } from '../../../../../generated/graphql';
import getValue from '../../../../../utils/getValue';
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
import {
  mockedOrganizationsResponse,
  organizations,
} from '../../../../organizations/__mocks__/organizationsPage';
import AskPermissionPage from '../AskPermissionPage';

configure({ defaultHidden: true });

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

const commonMocks = [mockedOrganizationsResponse];

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

type ElementKey =
  | 'body'
  | 'email'
  | 'jobDescription'
  | 'name'
  | 'organizationOption'
  | 'organizationToggleButton'
  | 'sendButton'
  | 'success';

const getElement = (key: ElementKey) => {
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
        name: organizations.data[0]?.name as string,
      });
    case 'organizationToggleButton':
      return screen.getByRole('button', { name: /organisaatio/i });
    case 'sendButton':
      return screen.getByRole('button', { name: /lähetä/i });

    case 'success':
      return screen.getByRole('heading', { name: /kiitos yhteydenotostasi/i });
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

  await act(async () => await user.click(organizationToggleButton));
  const organizationOption = getElement('organizationOption');
  await act(async () => await user.click(organizationOption));

  return { organizationToggleButton };
};

const enterCommonValues = async () => {
  const user = userEvent.setup();

  const jobDescriptionInput = getElement('jobDescription');
  const bodyInput = getElement('body');

  const { organizationToggleButton } = await selectOrganization();
  await act(
    async () => await user.type(jobDescriptionInput, values.jobDescription)
  );
  await act(async () => await user.type(bodyInput, values.body));

  return { organizationToggleButton, jobDescriptionInput, bodyInput };
};

const authContextValue = fakeAuthenticatedAuthContextValue(
  fakeOidcReducerState({
    user: fakeOidcUserState({
      profile: fakeOidcUserProfileState({
        name: values.name,
        email: values.email,
      }),
    }),
  })
);

test('should disable all fields if user is not authenticated', async () => {
  await act(async () => {
    await renderComponent();
  });

  const nameInput = getElement('name');
  const emailInput = getElement('email');
  const sendButton = getElement('sendButton');
  const organizationToggleButton = getElement('organizationToggleButton');
  const jobDescriptionInput = getElement('jobDescription');
  const bodyInput = getElement('body');

  expect(nameInput).toBeDisabled();
  expect(emailInput).toBeDisabled();
  expect(organizationToggleButton).toBeDisabled();
  expect(jobDescriptionInput).toBeDisabled();
  expect(bodyInput).toBeDisabled();
  expect(sendButton).toBeDisabled();
});

test('should scroll to organization selector when organization is not selected', async () => {
  const user = userEvent.setup();

  renderComponent({ mocks: [mockedPostFeedbackResponse], authContextValue });

  const organizationToggleButton = getElement('organizationToggleButton');
  const sendButton = getElement('sendButton');

  await act(async () => await user.click(sendButton));

  await waitFor(() => expect(organizationToggleButton).toHaveFocus());
});

test('should scroll to job description when it is empty', async () => {
  const user = userEvent.setup();

  renderComponent({ authContextValue });

  const jobDescriptionInput = getElement('jobDescription');
  const sendButton = getElement('sendButton');
  await selectOrganization();

  await act(async () => await user.click(sendButton));

  await waitFor(() => expect(jobDescriptionInput).toHaveFocus());
});

test('should succesfully send access request when user is signed in', async () => {
  const user = userEvent.setup();

  renderComponent({ mocks: [mockedPostFeedbackResponse], authContextValue });

  const { organizationToggleButton } = await enterCommonValues();

  const sendButton = getElement('sendButton');
  await act(async () => await user.click(sendButton));

  await waitFor(() => expect(organizationToggleButton).toHaveFocus());
  getElement('success');
});

test('should show server errors', async () => {
  const user = userEvent.setup();

  renderComponent({
    mocks: [mockedInvalidPostFeedbackResponse],
    authContextValue,
  });

  await enterCommonValues();

  const sendButton = getElement('sendButton');
  await act(async () => await user.click(sendButton));

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/arvo saa olla enintään 255 merkkiä pitkä./i);
});
