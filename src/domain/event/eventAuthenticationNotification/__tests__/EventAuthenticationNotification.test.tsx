import { MockedResponse } from '@apollo/client/testing';
import { advanceTo, clear } from 'jest-date-mock';
import React from 'react';

import { userVariables } from '../../../../domain/user/__mocks__/user';
import { UserDocument } from '../../../../generated/graphql';
import {
  fakeAuthContextValue,
  fakeAuthenticatedAuthContextValue,
} from '../../../../utils/mockAuthContextValue';
import { fakeEvent, fakeUser } from '../../../../utils/mockDataUtils';
import {
  act,
  configure,
  CustomRenderOptions,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { hiddenStyles } from '../../../app/authenticationNotification/AuthenticationNotification';
import EventAuthenticationNotification, {
  EventAuthenticationNotificationProps,
} from '../EventAuthenticationNotification';

configure({ defaultHidden: true });
beforeEach(() => clear());

const authContextValue = fakeAuthenticatedAuthContextValue();

const renderComponent = (
  renderOptions?: CustomRenderOptions,
  props?: EventAuthenticationNotificationProps
) => render(<EventAuthenticationNotification {...props} />, renderOptions);

test('should not show notification if user is signed in and has organizations', async () => {
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

  renderComponent({ authContextValue, mocks });

  await waitFor(() =>
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  );
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

  renderComponent({ authContextValue, mocks });

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
    request: { query: UserDocument, variables: userVariables },
    result: userResponse,
  };
  const mocks = [mockedUserResponse];

  renderComponent({ authContextValue, mocks }, { event });

  screen.getByRole('region');
  await screen.findByRole('heading', { name: 'Tapahtumaa ei voi muokata' });
  screen.getByText('Menneisyydessä olevia tapahtumia ei voi muokata.');
});

test('should start sign in process', async () => {
  const user = userEvent.setup();

  const signIn = jest.fn();
  const authContextValue = fakeAuthContextValue({ signIn });
  renderComponent({ authContextValue });

  const signInButton = screen.getByRole('button', { name: 'kirjautua sisään' });
  await act(async () => await user.click(signInButton));

  expect(signIn).toBeCalled();
});

test('should hide notification when clicking close button', async () => {
  const user = userEvent.setup();
  renderComponent();

  const notification = screen.getByRole('region');
  const closeButton = screen.getByRole('button', { name: 'Sulje' });

  await act(async () => await user.click(closeButton));
  await waitFor(() => expect(notification).toHaveStyle(hiddenStyles));
});
