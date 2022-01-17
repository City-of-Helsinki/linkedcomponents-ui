import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { TEST_USER_ID } from '../../../../constants';
import { TEST_PUBLISHER_ID } from '../../../../domain/organization/constants';
import {
  OrganizationDocument,
  UserDocument,
} from '../../../../generated/graphql';
import { fakeOrganization, fakeUser } from '../../../../utils/mockDataUtils';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import {
  configure,
  getMockReduxStore,
  render,
  screen,
  userEvent,
} from '../../../../utils/testUtils';
import PublisherSelector, {
  PublisherSelectorProps,
} from '../PublisherSelector';

configure({ defaultHidden: true });

const label = 'Select publisher';

const publisherId = TEST_PUBLISHER_ID;
const publisherName = 'Publisher name';
const publisher = fakeOrganization({
  id: publisherId,
  name: publisherName,
});
const publisherVariables = {
  createPath: undefined,
  id: publisherId,
};
const publisherResponse = { data: { organization: publisher } };
const mockedPublisherResponse: MockedResponse = {
  request: {
    query: OrganizationDocument,
    variables: publisherVariables,
  },
  result: publisherResponse,
};

const organizationId = 'organization:1';
const organizationName = 'Organization name';
const organization = fakeOrganization({
  id: organizationId,
  name: organizationName,
});
const organizationVariables = {
  createPath: undefined,
  id: organizationId,
};
const organizationResponse = { data: { organization } };
const mockedOrganizationResponse: MockedResponse = {
  request: {
    query: OrganizationDocument,
    variables: organizationVariables,
  },
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
const userVariables = {
  createPath: undefined,
  id: TEST_USER_ID,
};
const userResponse = { data: { user } };
const mockedUserResponse: MockedResponse = {
  request: {
    query: UserDocument,
    variables: userVariables,
  },
  result: userResponse,
};

const mocks = [
  mockedAdminOrganizationResponse,
  mockedOrganizationResponse,
  mockedPublisherResponse,
  mockedUserResponse,
];

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const defaultProps: PublisherSelectorProps = {
  label,
  name: 'publisher-selector',
  value: publisherId,
};

const renderComponent = (props?: Partial<PublisherSelectorProps>) =>
  render(<PublisherSelector {...defaultProps} {...props} />, { mocks, store });

const getElement = (key: 'toggleButton') => {
  switch (key) {
    case 'toggleButton':
      return screen.getByRole('button', {
        name: label,
      });
  }
};

test('should show users organizations as menu options', async () => {
  renderComponent();

  await screen.findByText(publisherName);

  const toggleButton = getElement('toggleButton');
  userEvent.click(toggleButton);

  await screen.findByRole('option', { name: organizationName, hidden: true });
  screen.getByRole('option', {
    name: adminOrganizationName,
    hidden: true,
  });
});

test('should show publisher as menu option', async () => {
  renderComponent({ publisher: publisherId });

  await screen.findByText(publisherName);

  const toggleButton = getElement('toggleButton');
  userEvent.click(toggleButton);

  screen.getByRole('option', { name: publisherName, hidden: true });
});
