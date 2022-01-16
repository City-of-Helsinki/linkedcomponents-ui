import { MockedResponse } from '@apollo/client/testing';
import { clear } from 'jest-date-mock';
import React from 'react';

import { TEST_USER_ID } from '../../../../constants';
import { UserDocument } from '../../../../generated/graphql';
import { fakeUser } from '../../../../utils/mockDataUtils';
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
import { hiddenStyles } from '../../../app/authenticationNotification/AuthenticationNotification';
import userManager from '../../../auth/userManager';
import RegistrationAuthenticationNotification from '../RegistrationAuthenticationNotification';

configure({ defaultHidden: true });
beforeEach(() => clear());

const userVariables = {
  createPath: undefined,
  id: TEST_USER_ID,
};

const renderComponent = (renderOptions?: CustomRenderOptions) =>
  render(<RegistrationAuthenticationNotification />, renderOptions);

test('should show sign in notification is user is not signed in', () => {
  renderComponent();
});

test("should show notification if user is signed in but doesn't have any organizations", () => {
  const user = fakeUser({
    adminOrganizations: [],
    organizationMemberships: [],
  });
  const userResponse = { data: { user } };
  const mockedUserResponse: MockedResponse = {
    request: { query: UserDocument, variables: userVariables },
    result: userResponse,
  };
  const mocks = [mockedUserResponse];

  const storeState = fakeAuthenticatedStoreState();
  const store = getMockReduxStore(storeState);

  renderComponent({ mocks, store });

  screen.getByRole('region');
  screen.getByRole('heading', {
    name: 'Ei oikeuksia muokata ilmoittautumisia.',
  });
});

test('should not show notification if user is signed in and has an admin organization', async () => {
  const user = fakeUser({
    adminOrganizations: ['helsinki:123'],
    organizationMemberships: [],
  });
  const userResponse = { data: { user } };
  const mockedUserResponse: MockedResponse = {
    request: { query: UserDocument, variables: userVariables },
    result: userResponse,
  };
  const mocks = [mockedUserResponse];

  const storeState = fakeAuthenticatedStoreState();
  const store = getMockReduxStore(storeState);

  renderComponent({ mocks, store });

  await waitFor(() =>
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  );
});

test('should start sign in process', () => {
  const signinRedirect = jest.spyOn(userManager, 'signinRedirect');

  renderComponent();

  const signInButton = screen.getByRole('button', { name: 'kirjautua sisään' });

  userEvent.click(signInButton);
  expect(signinRedirect).toBeCalled();
});

test('should hide notification when clicking close button', async () => {
  renderComponent();

  const notification = screen.getByRole('region');
  const closeButton = screen.getByRole('button', { name: 'Sulje' });

  userEvent.click(closeButton);
  await waitFor(() => expect(notification).toHaveStyle(hiddenStyles));
});
