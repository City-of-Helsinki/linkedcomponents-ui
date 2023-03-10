import React from 'react';

import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
import {
  configure,
  CustomRenderOptions,
  render,
  screen,
  waitFor,
} from '../../../../utils/testUtils';
import { mockedEventResponse } from '../../../event/__mocks__/event';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { registration } from '../../../registration/__mocks__/registration';
import { REGISTRATION_ACTIONS } from '../../../registrations/constants';
import {
  getMockedUserResponse,
  mockedUserResponse,
} from '../../../user/__mocks__/user';
import RegistrationAuthenticationNotification from '../RegistrationAuthenticationNotification';

configure({ defaultHidden: true });

const authContextValue = fakeAuthenticatedAuthContextValue();

const defaultMocks = [mockedEventResponse, mockedOrganizationAncestorsResponse];

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
