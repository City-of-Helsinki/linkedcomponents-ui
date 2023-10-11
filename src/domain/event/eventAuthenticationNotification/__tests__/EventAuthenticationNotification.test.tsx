import React from 'react';

import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
import { fakeEvent } from '../../../../utils/mockDataUtils';
import {
  configure,
  CustomRenderOptions,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  waitFor,
} from '../../../../utils/testUtils';
import { mockedOrganizationAncestorsResponse } from '../../../organization/__mocks__/organizationAncestors';
import { TEST_PUBLISHER_ID } from '../../../organization/constants';
import {
  mockedUserResponse,
  mockedUserWithoutOrganizationsResponse,
} from '../../../user/__mocks__/user';
import EventAuthenticationNotification, {
  EventAuthenticationNotificationProps,
} from '../EventAuthenticationNotification';

configure({ defaultHidden: true });
beforeEach(() => {
  vi.useRealTimers();
});

const authContextValue = fakeAuthenticatedAuthContextValue();

const renderComponent = (
  renderOptions?: CustomRenderOptions,
  props?: EventAuthenticationNotificationProps
) => {
  render(<EventAuthenticationNotification {...props} />, renderOptions);
};

test('should not show notification if user is signed in', async () => {
  const originalEnv = process.env;

  process.env = {
    ...originalEnv,
    REACT_APP_ENABLE_EXTERNAL_USER_EVENTS: 'false',
  };

  const mocks = [
    mockedOrganizationAncestorsResponse,
    mockedUserWithoutOrganizationsResponse,
  ];

  renderComponent({ authContextValue, mocks });

  await waitFor(() =>
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  );

  process.env = originalEnv;
});

test('should show notification if event is in the past', async () => {
  vi.setSystemTime('2021-07-09');
  const publisher = TEST_PUBLISHER_ID;
  const event = fakeEvent({
    publisher,
    startTime: '2019-11-08T12:27:34+00:00',
  });

  const mocks = [mockedOrganizationAncestorsResponse, mockedUserResponse];

  renderComponent({ authContextValue, mocks }, { event });

  await loadingSpinnerIsNotInDocument();

  screen.getByRole('region');
  await screen.findByRole('heading', { name: 'Tapahtumaa ei voi muokata' });
  screen.getByText('Menneisyydessä olevia tapahtumia ei voi muokata.');
});
