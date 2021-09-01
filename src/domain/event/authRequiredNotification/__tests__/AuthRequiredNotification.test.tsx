import { MockedResponse } from '@apollo/client/testing';
import { advanceTo, clear } from 'jest-date-mock';
import React from 'react';

import { TEST_USER_ID } from '../../../../constants';
import { UserDocument } from '../../../../generated/graphql';
import { fakeEvent, fakeUser } from '../../../../utils/mockDataUtils';
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
import userManager from '../../../auth/userManager';
import AuthRequiredNotification, {
  AuthRequiredNotificationProps,
  hiddenStyles,
} from '../AuthRequiredNotification';

configure({ defaultHidden: true });
beforeEach(() => clear());

const renderComponent = (
  renderOptions?: CustomRenderOptions,
  props?: AuthRequiredNotificationProps
) => render(<AuthRequiredNotification {...props} />, renderOptions);

const userVariables = {
  createPath: undefined,
  id: TEST_USER_ID,
};

test('should not show sign in notification if user is signed in and has organizations', async () => {
  const user = fakeUser({
    adminOrganizations: ['helsinki:123'],
    organizationMemberships: [],
  });
  const userResponse = { data: { user } };
  const mockedUserResponse: MockedResponse = {
    request: {
      query: UserDocument,
      variables: userVariables,
    },
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

test("should show notification if user is signed in but doesn't have organizations", () => {
  const user = fakeUser({
    adminOrganizations: [],
    organizationMemberships: [],
  });
  const userResponse = { data: { user } };
  const mockedUserResponse: MockedResponse = {
    request: {
      query: UserDocument,
      variables: userVariables,
    },
    result: userResponse,
  };
  const mocks = [mockedUserResponse];

  const storeState = fakeAuthenticatedStoreState();
  const store = getMockReduxStore(storeState);

  renderComponent({ mocks, store });

  screen.getByRole('region');
  screen.getByRole('heading', { name: 'Ei oikeuksia muokata tapahtumia.' });
});

test('should show notification if event is in the past', async () => {
  advanceTo('2021-07-09');
  const publisher = 'helsinki:123';
  const user = fakeUser({
    adminOrganizations: [publisher],
    organization: publisher,
    organizationMemberships: [],
  });
  const event = fakeEvent({
    publisher,
    startTime: '2019-11-08T12:27:34+00:00',
  });

  const userResponse = { data: { user } };
  const mockedUserResponse: MockedResponse = {
    request: {
      query: UserDocument,
      variables: userVariables,
    },
    result: userResponse,
  };
  const mocks = [mockedUserResponse];

  const storeState = fakeAuthenticatedStoreState();
  const store = getMockReduxStore(storeState);

  renderComponent({ mocks, store }, { event });

  screen.getByRole('region');
  await screen.findByRole('heading', { name: 'Tapahtumaa ei voi muokata' });
  screen.getByText('Menneisyydessä olevia tapahtumia ei voi muokata.');
});

test('should show sign in notification is user is not signed in', () => {
  renderComponent();
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
