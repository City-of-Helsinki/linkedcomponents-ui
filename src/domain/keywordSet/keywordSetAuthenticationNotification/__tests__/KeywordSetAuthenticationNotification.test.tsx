import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import {
  getMockedUserResponse,
  mockedUserResponse,
  mockedUserWithoutOrganizationsResponse,
} from '../../../../domain/user/__mocks__/user';
import { OrganizationDocument } from '../../../../generated/graphql';
import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
import { fakeOrganization } from '../../../../utils/mockDataUtils';
import {
  configure,
  CustomRenderOptions,
  render,
  screen,
  waitFor,
} from '../../../../utils/testUtils';
import { TEST_DATA_SOURCE_ID } from '../../../dataSource/constants';
import { mockedEventResponse } from '../../../event/__mocks__/event';
import { mockedOrganizationResponse } from '../../../organization/__mocks__/organization';
import { KEYWORD_SET_ACTIONS } from '../../constants';
import KeywordSetAuthenticationNotification, {
  KeywordSetAuthenticationNotificationProps,
} from '../KeywordSetAuthenticationNotification';

configure({ defaultHidden: true });

const props: KeywordSetAuthenticationNotificationProps = {
  action: KEYWORD_SET_ACTIONS.UPDATE,
  dataSource: TEST_DATA_SOURCE_ID,
};

const renderComponent = (renderOptions?: CustomRenderOptions) =>
  render(<KeywordSetAuthenticationNotification {...props} />, renderOptions);

const authContextValue = fakeAuthenticatedAuthContextValue();

test("should show notification if user is signed in but doesn't have any organizations", async () => {
  const mocks = [mockedEventResponse, mockedUserWithoutOrganizationsResponse];

  renderComponent({ authContextValue, mocks });

  await screen.findByRole('heading', {
    name: 'Ei oikeuksia muokata avainsanaryhmiä.',
  });
});

test('should not show notification if user is signed in and has an admin organization', async () => {
  const mocks = [
    mockedEventResponse,
    mockedOrganizationResponse,
    mockedUserResponse,
  ];

  renderComponent({ authContextValue, mocks });

  await waitFor(() =>
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  );
});

test('should show notification if user has an admin organization but the data source is different', async () => {
  const dataSource = 'not-publisher';
  const organizationId = 'not-publisher';

  const organization = fakeOrganization({ dataSource });
  const organizationVariables = { createPath: undefined, id: organizationId };
  const organizationResponse = { data: { organization } };
  const mockedOrganizationResponse: MockedResponse = {
    request: { query: OrganizationDocument, variables: organizationVariables },
    result: organizationResponse,
  };

  const mockedUserResponse = getMockedUserResponse({
    organization: organizationId,
    adminOrganizations: [organizationId],
    organizationMemberships: [],
  });

  const mocks = [
    mockedEventResponse,
    mockedOrganizationResponse,
    mockedUserResponse,
  ];

  renderComponent({ authContextValue, mocks });

  await screen.findByRole('heading', {
    name: 'Avainsanaryhmää ei voi muokata',
  });
  await screen.findByText(
    'Sinulla ei ole oikeuksia muokata tätä avainsanaryhmää.'
  );
});
