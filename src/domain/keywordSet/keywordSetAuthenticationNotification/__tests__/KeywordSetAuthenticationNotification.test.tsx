import { MockedResponse } from '@apollo/client/testing';
import { clear } from 'jest-date-mock';
import React from 'react';

import { TEST_USER_ID } from '../../../../constants';
import {
  OrganizationDocument,
  UserDocument,
} from '../../../../generated/graphql';
import { fakeOrganization, fakeUser } from '../../../../utils/mockDataUtils';
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
import { mockedOrganizationResponse } from '../../../organization/__mocks__/organization';
import { TEST_DATA_SOURCE } from '../../../organization/constants';
import {
  mockedUserResponse,
  mockedUserWithoutOrganizationsResponse,
} from '../../../user/__mocks__/user';
import { KEYWORD_SET_ACTIONS } from '../../constants';
import KeywordSetAuthenticationNotification, {
  KeywordSetAuthenticationNotificationProps,
} from '../KeywordSetAuthenticationNotification';

configure({ defaultHidden: true });
beforeEach(() => clear());

const userVariables = { createPath: undefined, id: TEST_USER_ID };

const props: KeywordSetAuthenticationNotificationProps = {
  action: KEYWORD_SET_ACTIONS.UPDATE,
  dataSource: TEST_DATA_SOURCE,
};

const renderComponent = (renderOptions?: CustomRenderOptions) =>
  render(<KeywordSetAuthenticationNotification {...props} />, renderOptions);

const storeState = fakeAuthenticatedStoreState();
const store = getMockReduxStore(storeState);

test("should show notification if user is signed in but doesn't have any organizations", async () => {
  const mocks = [mockedEventResponse, mockedUserWithoutOrganizationsResponse];

  renderComponent({ mocks, store });

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

  renderComponent({ mocks, store });

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

  const user = fakeUser({
    organization: organizationId,
    adminOrganizations: [organizationId],
    organizationMemberships: [],
  });
  const userResponse = { data: { user } };
  const mockedUserResponse: MockedResponse = {
    request: { query: UserDocument, variables: userVariables },
    result: userResponse,
  };

  const mocks = [
    mockedEventResponse,
    mockedOrganizationResponse,
    mockedUserResponse,
  ];

  renderComponent({ mocks, store });

  await screen.findByRole('heading', {
    name: 'Avainsanaryhmää ei voi muokata',
  });
  await screen.findByText(
    'Sinulla ei ole oikeuksia muokata tätä avainsanaryhmää.'
  );
});

test('should start sign in process', async () => {
  const signinRedirect = jest.spyOn(userManager, 'signinRedirect');

  renderComponent();

  const signInButton = screen.getByRole('button', { name: 'kirjautua sisään' });

  userEvent.click(signInButton);
  await waitFor(() => expect(signinRedirect).toBeCalled());
});
