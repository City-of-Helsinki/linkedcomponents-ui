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
    mocks: [...commonMocks, ...(options?.mocks || [])],
  });

const enterCommonValues = async () => {
  const user = userEvent.setup();

  const organizationToggleButton = getElement('organizationToggleButton');
  const jobDescriptionInput = getElement('jobDescription');
  const bodyInput = getElement('body');

  await act(async () => await user.click(organizationToggleButton));
  const organizationOption = getElement('organizationOption');
  await act(async () => await user.click(organizationOption));
  await act(
    async () => await user.type(jobDescriptionInput, values.jobDescription)
  );
  await act(async () => await user.type(bodyInput, values.body));

  return { organizationToggleButton, jobDescriptionInput, bodyInput };
};

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

test('should scroll to organization selector when organization is not selected', async () => {
  const user = userEvent.setup();
  renderComponent();

  const nameInput = getElement('name');
  const emailInput = getElement('email');
  const organizationToggleButton = getElement('organizationToggleButton');
  const sendButton = getElement('sendButton');

  await act(async () => await user.type(nameInput, values.name));
  await act(async () => await user.type(emailInput, values.email));
  await act(async () => await user.click(sendButton));

  await waitFor(() => expect(organizationToggleButton).toHaveFocus());
});

test('should succesfully send feedback when user is not signed in', async () => {
  const user = userEvent.setup();
  renderComponent({ mocks: [mockedPostGuestFeedbackResponse] });

  const nameInput = getElement('name');
  const emailInput = getElement('email');

  await act(async () => await user.type(nameInput, values.name));
  await act(async () => await user.type(emailInput, values.email));
  await enterCommonValues();

  const sendButton = getElement('sendButton');
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

  const { organizationToggleButton } = await enterCommonValues();

  const sendButton = getElement('sendButton');
  await act(async () => await user.click(sendButton));

  await waitFor(() => expect(organizationToggleButton).toHaveFocus());
  getElement('success');
});

test('should show server errors', async () => {
  const authContextValue = fakeAuthenticatedAuthContextValue(
    fakeOidcReducerState({
      user: fakeOidcUserState({ profile: fakeOidcUserProfileState(values) }),
    })
  );

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
