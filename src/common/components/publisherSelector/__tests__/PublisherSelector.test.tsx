import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { TEST_PUBLISHER_ID } from '../../../../domain/organization/constants';
import { userVariables } from '../../../../domain/user/__mocks__/user';
import {
  OrganizationDocument,
  UserDocument,
} from '../../../../generated/graphql';
import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
import { fakeOrganization, fakeUser } from '../../../../utils/mockDataUtils';
import {
  act,
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../utils/testUtils';
import PublisherSelector, {
  PublisherSelectorProps,
} from '../PublisherSelector';
configure({ defaultHidden: true });

const label = 'Select publisher';

const publisherId = TEST_PUBLISHER_ID;
const publisherName = 'Publisher name';
const publisher = fakeOrganization({ id: publisherId, name: publisherName });
const publisherVariables = { createPath: undefined, id: publisherId };
const publisherResponse = { data: { organization: publisher } };
const mockedPublisherResponse: MockedResponse = {
  request: { query: OrganizationDocument, variables: publisherVariables },
  result: publisherResponse,
};

const organizationId = 'organization:1';
const organizationName = 'Organization name';
const organization = fakeOrganization({
  id: organizationId,
  name: organizationName,
});
const organizationVariables = { createPath: undefined, id: organizationId };
const organizationResponse = { data: { organization } };
const mockedOrganizationResponse: MockedResponse = {
  request: { query: OrganizationDocument, variables: organizationVariables },
  result: organizationResponse,
};

const adminOrganizationId = 'admin:1';
const adminOrganizationName = 'Admin organization';
const adminOrganization = fakeOrganization({
  id: adminOrganizationId,
  name: adminOrganizationName,
});
const adminOrganizationVariables = {
  createPath: undefined,
  id: adminOrganizationId,
};
const adminOrganizationResponse = { data: { organization: adminOrganization } };
const mockedAdminOrganizationResponse: MockedResponse = {
  request: {
    query: OrganizationDocument,
    variables: adminOrganizationVariables,
  },
  result: adminOrganizationResponse,
};

const user = fakeUser({
  organization: adminOrganizationId,
  adminOrganizations: [adminOrganizationId],
  organizationMemberships: [organizationId],
});
const userResponse = { data: { user } };
const mockedUserResponse: MockedResponse = {
  request: { query: UserDocument, variables: userVariables },
  result: userResponse,
};

const authContextValue = fakeAuthenticatedAuthContextValue();

const mocks = [
  mockedAdminOrganizationResponse,
  mockedOrganizationResponse,
  mockedPublisherResponse,
  mockedUserResponse,
];

const defaultProps: PublisherSelectorProps = {
  label,
  name: 'publisher-selector',
  value: publisherId,
};

const renderComponent = (props?: Partial<PublisherSelectorProps>) =>
  render(<PublisherSelector {...defaultProps} {...props} />, {
    authContextValue,
    mocks,
  });

const getElement = (key: 'searchInput' | 'toggleButton') => {
  switch (key) {
    case 'searchInput':
      return screen.getByRole('combobox', { name: label });
    case 'toggleButton':
      return screen.getByRole('button', { name: `${label}: Valikko` });
  }
};

test('should show users organizations as menu options', async () => {
  const user = userEvent.setup();
  renderComponent({ publisher: null, value: null });

  getElement('searchInput');

  const toggleButton = getElement('toggleButton');
  await act(async () => await user.click(toggleButton));

  await screen.findByRole('option', { name: organizationName });
  screen.getByRole('option', { name: adminOrganizationName });
});

test('should show publisher as menu option', async () => {
  const user = userEvent.setup();
  renderComponent({ publisher: publisherId });

  const searchinput = getElement('searchInput');
  await waitFor(() => expect(searchinput).toHaveValue(publisherName));

  const toggleButton = getElement('toggleButton');
  await act(async () => await user.click(toggleButton));

  await screen.findByRole('option', { name: publisherName });
});
