import { advanceTo, clear } from 'jest-date-mock';
import React from 'react';

import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
import { fakeEvent } from '../../../../utils/mockDataUtils';
import {
  configure,
  CustomRenderOptions,
  render,
  screen,
  waitFor,
} from '../../../../utils/testUtils';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { TEST_PUBLISHER_ID } from '../../../organization/constants';
import { getMockedUserResponse } from '../../../user/__mocks__/user';
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
  const mockedUserResponse = getMockedUserResponse({
    adminOrganizations: [TEST_PUBLISHER_ID],
    organizationMemberships: [],
  });
  const mocks = [mockedOrganizationAncestorsResponse, mockedUserResponse];

  renderComponent({ authContextValue, mocks });

  await waitFor(() =>
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  );
});

test("should show notification if user is signed in but doesn't have any organizations", () => {
  const mockedUserResponse = getMockedUserResponse({
    adminOrganizations: [],
    organizationMemberships: [],
  });
  const mocks = [mockedOrganizationAncestorsResponse, mockedUserResponse];

  renderComponent({ authContextValue, mocks });

  screen.getByRole('region');
  screen.getByRole('heading', { name: 'Ei oikeuksia muokata tapahtumia.' });
});

test('should show notification if event is in the past', async () => {
  advanceTo('2021-07-09');
  const publisher = TEST_PUBLISHER_ID;
  const event = fakeEvent({
    publisher,
    startTime: '2019-11-08T12:27:34+00:00',
  });

  const mockedUserResponse = getMockedUserResponse({
    adminOrganizations: [publisher],
    organization: publisher,
    organizationMemberships: [],
  });
  const mocks = [mockedOrganizationAncestorsResponse, mockedUserResponse];

  renderComponent({ authContextValue, mocks }, { event });

  screen.getByRole('region');
  await screen.findByRole('heading', { name: 'Tapahtumaa ei voi muokata' });
  screen.getByText('Menneisyydessä olevia tapahtumia ei voi muokata.');
});
