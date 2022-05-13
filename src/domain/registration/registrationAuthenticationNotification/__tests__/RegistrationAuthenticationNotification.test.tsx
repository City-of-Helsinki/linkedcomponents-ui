import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { UserDocument } from '../../../../generated/graphql';
import { fakeUser } from '../../../../utils/mockDataUtils';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import {
  act,
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
import {
  mockedUserResponse,
  userVariables,
} from '../../../user/__mocks__/user';
import RegistrationAuthenticationNotification from '../RegistrationAuthenticationNotification';

configure({ defaultHidden: true });

const storeState = fakeAuthenticatedStoreState();
const store = getMockReduxStore(storeState);

const defaultMocks = [mockedEventResponse];

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
  const mocks = [...defaultMocks, mockedUserResponse];

  renderComponent({ mocks, store });

  screen.getByRole('region');
  screen.getByRole('heading', {
    name: 'Ei oikeuksia muokata ilmoittautumisia.',
  });
});

test('should show notification if user has an admin organization but the id is different', async () => {
  const user = fakeUser({
    adminOrganizations: ['not-publisher'],
    organizationMemberships: [],
  });
  const userResponse = { data: { user } };
  const mockedUserResponse: MockedResponse = {
    request: { query: UserDocument, variables: userVariables },
    result: userResponse,
  };
  const mocks = [...defaultMocks, mockedUserResponse];

  renderComponent({ mocks, store });

  await screen.findByRole('heading', {
    name: 'Ilmoittautumista ei voi muokata',
  });
  screen.getByText('Sinulla ei ole oikeuksia muokata tätä ilmoittautumista.');
});

test('should not show notification if user is signed in and has an admin organization', async () => {
  const mocks = [...defaultMocks, mockedUserResponse];

  renderComponent({ mocks, store });

  await waitFor(() =>
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  );
});

test('should start sign in process', async () => {
  const signinRedirect = jest.spyOn(userManager, 'signinRedirect');
  const user = userEvent.setup();
  renderComponent();

  const signInButton = screen.getByRole('button', { name: 'kirjautua sisään' });
  await act(async () => await user.click(signInButton));
  expect(signinRedirect).toBeCalled();
});
