import React from 'react';

import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
import {
  configure,
  CustomRenderOptions,
  render,
  screen,
  waitFor,
} from '../../../../utils/testUtils';
import { TEST_PUBLISHER_ID } from '../../../organization/constants';
import { getMockedUserResponse } from '../../../user/__mocks__/user';
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
  const mockedUserResponse = getMockedUserResponse({
    adminOrganizations: [],
    organizationMemberships: [],
  });
  const mocks = [mockedUserResponse];

  renderComponent({ authContextValue, mocks });

  screen.getByRole('heading', { name: 'Ei oikeuksia muokata paikkoja.' });
});

test('should not show notification if user is signed in and has an admin organization', async () => {
  const mockedUserResponse = getMockedUserResponse({
    adminOrganizations: [TEST_PUBLISHER_ID],
    organizationMemberships: [],
  });
  const mocks = [mockedUserResponse];

  renderComponent({ authContextValue, mocks });

  await waitFor(() =>
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  );
});

test('should show notification if user has an admin organization but it is different than publisher', async () => {
  const mockedUserResponse = getMockedUserResponse({
    adminOrganizations: ['not-publisher'],
    organizationMemberships: [],
  });
  const mocks = [mockedUserResponse];

  renderComponent({ authContextValue, mocks });

  await screen.findByRole('heading', { name: 'Paikkaa ei voi muokata' });
  screen.getByText('Sinulla ei ole oikeuksia muokata tätä paikkaa.');
});
