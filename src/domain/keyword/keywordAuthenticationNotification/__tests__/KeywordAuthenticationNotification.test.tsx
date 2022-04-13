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
import { TEST_PUBLISHER_ID } from '../../../organization/constants';
import { KEYWORD_ACTIONS } from '../../constants';
import KeywordAuthenticationNotification, {
  KeywordAuthenticationNotificationProps,
} from '../KeywordAuthenticationNotification';

configure({ defaultHidden: true });
beforeEach(() => clear());

const userVariables = { createPath: undefined, id: TEST_USER_ID };

const props: KeywordAuthenticationNotificationProps = {
  action: KEYWORD_ACTIONS.UPDATE,
  publisher: TEST_PUBLISHER_ID,
};

const renderComponent = (renderOptions?: CustomRenderOptions) =>
  render(<KeywordAuthenticationNotification {...props} />, renderOptions);

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
  const mocks = [mockedUserResponse];

  renderComponent({ mocks, store });

  screen.getByRole('heading', { name: 'Ei oikeuksia muokata avainsanoja.' });
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
  const mocks = [mockedUserResponse];

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
  const mocks = [mockedUserResponse];

  renderComponent({ mocks, store });

  await screen.findByRole('heading', { name: 'Avainsanaa ei voi muokata' });
  screen.getByText('Sinulla ei ole oikeuksia muokata tätä avainsanaa.');
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
