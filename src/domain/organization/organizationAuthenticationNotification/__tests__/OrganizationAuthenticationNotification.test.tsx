import { MockedResponse } from '@apollo/client/testing';

import { OrganizationDocument } from '../../../../generated/graphql';
import { fakeOrganization } from '../../../../utils/mockDataUtils';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import {
  CustomRenderOptions,
  getMockReduxStore,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import { hiddenStyles } from '../../../app/authenticationNotification/AuthenticationNotification';
import userManager from '../../../auth/userManager';
import {
  mockedUserResponse,
  mockedUserWithoutOrganizationsResponse,
} from '../../../user/__mocks__/user';
import { mockedOrganizationResponse } from '../../__mocks__/organization';
import { ORGANIZATION_ACTIONS, TEST_PUBLISHER_ID } from '../../constants';
import OrganizationAuthenticationNotification, {
  OrganizationAuthenticationNotificationProps,
} from '../OrganizationAuthenticationNotification';

const defaultProps: OrganizationAuthenticationNotificationProps = {
  action: ORGANIZATION_ACTIONS.UPDATE,
  id: TEST_PUBLISHER_ID,
};

const renderComponent = (
  props?: Partial<OrganizationAuthenticationNotificationProps>,
  renderOptions?: CustomRenderOptions
) =>
  render(
    <OrganizationAuthenticationNotification {...defaultProps} {...props} />,
    renderOptions
  );

const storeState = fakeAuthenticatedStoreState();
const store = getMockReduxStore(storeState);

test("should show notification if user is signed in but doesn't have any organizations", async () => {
  const mocks = [
    mockedOrganizationResponse,
    mockedUserWithoutOrganizationsResponse,
  ];

  renderComponent(undefined, { mocks, store });

  await screen.findByRole('heading', {
    name: 'Ei oikeuksia muokata organisaatioita.',
  });
});

test('should not show notification if user is signed in and has an admin organization', async () => {
  const mocks = [mockedOrganizationResponse, mockedUserResponse];

  renderComponent(undefined, { mocks, store });

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

  renderComponent({ id: organizationId }, { mocks, store });

  await screen.findByRole('heading', { name: 'Organisaatiota ei voi muokata' });
  screen.getByText('Sinulla ei ole oikeuksia muokata tätä organisaatiota.');
});

test('should start sign in process', async () => {
  const signinRedirect = jest.spyOn(userManager, 'signinRedirect');

  renderComponent();

  const signInButton = screen.getByRole('button', { name: 'kirjautua sisään' });

  userEvent.click(signInButton);
  await waitFor(() => expect(signinRedirect).toBeCalled());
});

test('should hide notification when clicking close button', async () => {
  renderComponent();

  const notification = screen.getByRole('region');
  const closeButton = screen.getByRole('button', { name: 'Sulje' });

  userEvent.click(closeButton);
  await waitFor(() => expect(notification).toHaveStyle(hiddenStyles));
});
