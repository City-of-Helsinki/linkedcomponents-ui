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
import {
  getMockedUserResponse,
  mockedUserResponse,
} from '../../../user/__mocks__/user';
import { ENROLMENT_ACTIONS } from '../../constants';
import EnrolmentAuthenticationNotification from '../EnrolmentAuthenticationNotification';

configure({ defaultHidden: true });

const renderComponent = (renderOptions?: CustomRenderOptions) =>
  render(
    <EnrolmentAuthenticationNotification
      action={ENROLMENT_ACTIONS.UPDATE}
      registration={registration}
    />,
    renderOptions
  );

test("should show notification if user is signed in but doesn't have any organizations", () => {
  const mockedUserResponse = getMockedUserResponse({
    adminOrganizations: [],
    organizationMemberships: [],
  });
  const mocks = [
    mockedEventResponse,
    mockedOrganizationAncestorsResponse,
    mockedUserResponse,
  ];

  const authContextValue = fakeAuthenticatedAuthContextValue();

  renderComponent({ authContextValue, mocks });

  screen.getByRole('region');
  screen.getByRole('heading', { name: 'Ei oikeuksia muokata osallistujia.' });
});

test('should not show notification if user is signed in and has an admin organization', async () => {
  const mocks = [
    mockedEventResponse,
    mockedOrganizationAncestorsResponse,
    mockedUserResponse,
  ];

  const authContextValue = fakeAuthenticatedAuthContextValue();

  renderComponent({ authContextValue, mocks });

  await waitFor(() =>
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  );
});
