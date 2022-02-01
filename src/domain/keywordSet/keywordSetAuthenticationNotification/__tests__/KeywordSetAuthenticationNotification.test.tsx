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
import { mockedEventResponse } from '../../../event/__mocks__/event';
import { TEST_PUBLISHER_ID } from '../../../organization/constants';
import { KEYWORD_SET_ACTIONS } from '../../constants';
import KeywordSetAuthenticationNotification, {
  KeywordSetAuthenticationNotificationProps,
} from '../KeywordSetAuthenticationNotification';

configure({ defaultHidden: true });
beforeEach(() => clear());

const userVariables = { createPath: undefined, id: TEST_USER_ID };

const props: KeywordSetAuthenticationNotificationProps = {
  action: KEYWORD_SET_ACTIONS.UPDATE,
  publisher: TEST_PUBLISHER_ID,
};

const renderComponent = (renderOptions?: CustomRenderOptions) =>
  render(<KeywordSetAuthenticationNotification {...props} />, renderOptions);

const storeState = fakeAuthenticatedStoreState();
const store = getMockReduxStore(storeState);

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
  const mocks = [mockedEventResponse, mockedUserResponse];

  renderComponent({ mocks, store });

  screen.getByRole('heading', {
    name: 'Ei oikeuksia muokata avainsanaryhmiä.',
  });
});

test('should not show notification if user is signed in and has an admin organization', async () => {
  const user = fakeUser({
    adminOrganizations: [TEST_PUBLISHER_ID],
    organizationMemberships: [],
  });
  const userResponse = { data: { user } };
  const mockedUserResponse: MockedResponse = {
    request: { query: UserDocument, variables: userVariables },
    result: userResponse,
  };
  const mocks = [mockedEventResponse, mockedUserResponse];

  renderComponent({ mocks, store });

  await waitFor(() =>
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  );
});

test('should show notification if user has an admin organization but it is different than publisher', async () => {
  const user = fakeUser({
    adminOrganizations: ['not-publisher'],
    organizationMemberships: [],
  });
  const userResponse = { data: { user } };
  const mockedUserResponse: MockedResponse = {
    request: { query: UserDocument, variables: userVariables },
    result: userResponse,
  };
  const mocks = [mockedEventResponse, mockedUserResponse];

  renderComponent({ mocks, store });

  await screen.findByRole('heading', {
    name: 'Avainsanaryhmää ei voi muokata',
  });
  screen.getByText('Sinulla ei ole oikeuksia muokata tätä avainsanaryhmää.');
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
