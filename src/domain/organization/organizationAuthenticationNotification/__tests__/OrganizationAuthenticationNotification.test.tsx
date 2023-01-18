import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

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
import {
  mockedUserResponse,
  mockedUserWithoutOrganizationsResponse,
} from '../../../user/__mocks__/user';
import { mockedOrganizationResponse } from '../../__mocks__/organization';
import { ORGANIZATION_ACTIONS, TEST_PUBLISHER_ID } from '../../constants';
import OrganizationAuthenticationNotification, {
  OrganizationAuthenticationNotificationProps,
} from '../OrganizationAuthenticationNotification';

configure({ defaultHidden: true });

const defaultProps: OrganizationAuthenticationNotificationProps = {
  action: ORGANIZATION_ACTIONS.UPDATE,
  id: TEST_PUBLISHER_ID,
};

const renderComponent = (
  renderOptions?: CustomRenderOptions,
  props?: Partial<OrganizationAuthenticationNotificationProps>
) =>
  render(
    <OrganizationAuthenticationNotification {...defaultProps} {...props} />,
    renderOptions
  );

const authContextValue = fakeAuthenticatedAuthContextValue();

test("should show notification if user is signed in but doesn't have any organizations", async () => {
  const mocks = [
    mockedOrganizationResponse,
    mockedUserWithoutOrganizationsResponse,
  ];

  renderComponent({ authContextValue, mocks });

  await screen.findByRole('heading', {
    name: 'Ei oikeuksia muokata organisaatioita.',
  });
});

test('should not show notification if user is signed in and has an admin organization', async () => {
  const mocks = [mockedOrganizationResponse, mockedUserResponse];

  renderComponent({ authContextValue, mocks });

  await waitFor(() =>
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  );
});

test('should show notification if user has an admin organization but the id is different', async () => {
  const organizationId = 'not-publisher';

  const organization = fakeOrganization({ id: organizationId });
  const organizationVariables = { createPath: undefined, id: organizationId };
  const organizationResponse = { data: { organization } };
  const mockedOrganizationResponse: MockedResponse = {
    request: { query: OrganizationDocument, variables: organizationVariables },
    result: organizationResponse,
  };

  const mocks = [mockedOrganizationResponse, mockedUserResponse];

  renderComponent({ authContextValue, mocks }, { id: organizationId });

  await screen.findByRole('heading', { name: 'Organisaatiota ei voi muokata' });
  screen.getByText('Sinulla ei ole oikeuksia muokata tätä organisaatiota.');
});
