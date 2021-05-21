import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { OrganizationDocument } from '../../../../generated/graphql';
import { fakeOrganization } from '../../../../utils/mockDataUtils';
import { configure, render, screen } from '../../../../utils/testUtils';
import { cache } from '../../../app/apollo/apolloClient';
import PublisherName from '../PublisherName';

configure({ defaultHidden: true });

const organizationId = 'hel:123';
const organizationName = 'Organization name';
const organization = fakeOrganization({
  id: organizationId,
  name: organizationName,
});
const organizationResponse = { data: { organization } };
const variables = { id: organizationId, createPath: undefined };

afterEach(() => cache.reset());

const renderComponent = (mocks: MockedResponse[]) =>
  render(<PublisherName id={organizationId} />, { mocks });

test('should show publisher name correctly', async () => {
  renderComponent([
    {
      request: {
        query: OrganizationDocument,
        variables,
      },
      result: organizationResponse,
    },
  ]);
  await screen.findByText(organizationName);
});

test('should show default value when organization is not found', async () => {
  renderComponent([
    {
      request: {
        query: OrganizationDocument,
        variables,
      },
      error: new Error(),
    },
  ]);
  await screen.findByText('-');
});
