import React from 'react';

import {
  fakeAuthContextValue,
  fakeAuthenticatedAuthContextValue,
} from '../../../../utils/mockAuthContextValue';
import {
  act,
  configure,
  CustomRenderOptions,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { mockedEventResponse } from '../../../event/__mocks__/event';
import { registration } from '../../../registration/__mocks__/registration';
import { REGISTRATION_ACTIONS } from '../../../registrations/constants';
import {
  getMockedUserResponse,
  mockedUserResponse,
} from '../../../user/__mocks__/user';
import RegistrationAuthenticationNotification from '../RegistrationAuthenticationNotification';

configure({ defaultHidden: true });

const authContextValue = fakeAuthenticatedAuthContextValue();

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
  const mockedUserResponse = getMockedUserResponse({
    adminOrganizations: [],
    organizationMemberships: [],
  });
  const mocks = [...defaultMocks, mockedUserResponse];

  renderComponent({ authContextValue, mocks });

  screen.getByRole('region');
  screen.getByRole('heading', {
    name: 'Ei oikeuksia muokata ilmoittautumisia.',
  });
});

test('should show notification if user has an admin organization but the id is different', async () => {
  const mockedUserResponse = getMockedUserResponse({
    adminOrganizations: ['not-publisher'],
    organizationMemberships: [],
  });
  const mocks = [...defaultMocks, mockedUserResponse];

  renderComponent({ authContextValue, mocks });

  await screen.findByRole('heading', {
    name: 'Ilmoittautumista ei voi muokata',
  });
  screen.getByText('Sinulla ei ole oikeuksia muokata tätä ilmoittautumista.');
});

test('should not show notification if user is signed in and has an admin organization', async () => {
  const mocks = [...defaultMocks, mockedUserResponse];

  renderComponent({ authContextValue, mocks });

  await waitFor(() =>
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  );
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
