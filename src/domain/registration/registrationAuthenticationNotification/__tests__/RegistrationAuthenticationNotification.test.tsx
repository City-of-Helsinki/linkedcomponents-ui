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
import userManager from '../../../auth/userManager';
import { mockedEventResponse } from '../../../event/__mocks__/event';
import { registration } from '../../../registration/__mocks__/registration';
import { REGISTRATION_ACTIONS } from '../../../registrations/constants';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import RegistrationAuthenticationNotification from '../RegistrationAuthenticationNotification';

configure({ defaultHidden: true });
beforeEach(() => clear());

const userVariables = {
  createPath: undefined,
  id: TEST_USER_ID,
};

const renderComponent = (renderOptions?: CustomRenderOptions) =>
  render(
    <RegistrationAuthenticationNotification
      action={REGISTRATION_ACTIONS.UPDATE}
      registration={registration}
    />,
    renderOptions
  );

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
  const mocks = [mockedEventResponse, mockedUserResponse];

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
