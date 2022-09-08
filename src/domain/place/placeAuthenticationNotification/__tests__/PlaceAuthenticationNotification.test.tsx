import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { userVariables } from '../../../../domain/user/__mocks__/user';
import { UserDocument } from '../../../../generated/graphql';
import {
  fakeAuthContextValue,
  fakeAuthenticatedAuthContextValue,
} from '../../../../utils/mockAuthContextValue';
import { fakeUser } from '../../../../utils/mockDataUtils';
import {
  act,
  configure,
  CustomRenderOptions,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { TEST_PUBLISHER_ID } from '../../../organization/constants';
import { PLACE_ACTIONS } from '../../constants';
import PlaceAuthenticationNotification, {
  PlaceAuthenticationNotificationProps,
} from '../PlaceAuthenticationNotification';

configure({ defaultHidden: true });

const props: PlaceAuthenticationNotificationProps = {
  action: PLACE_ACTIONS.UPDATE,
  publisher: TEST_PUBLISHER_ID,
};

const renderComponent = (renderOptions?: CustomRenderOptions) =>
  render(<PlaceAuthenticationNotification {...props} />, renderOptions);

const authContextValue = fakeAuthenticatedAuthContextValue();

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

  screen.getByRole('heading', { name: 'Ei oikeuksia muokata paikkoja.' });
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

  renderComponent({ authContextValue, mocks });

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

  renderComponent({ authContextValue, mocks });

  await screen.findByRole('heading', { name: 'Paikkaa ei voi muokata' });
  screen.getByText('Sinulla ei ole oikeuksia muokata tätä paikkaa.');
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
