import { MockedResponse } from '@apollo/react-testing';
import React from 'react';

import { OrganizationDocument } from '../../../../generated/graphql';
import { fakeOrganization } from '../../../../utils/mockDataUtils';
import { render, screen } from '../../../../utils/testUtils';
import PublisherName from '../PublisherName';

const organizationId = 'hel:123';
const organizationName = 'Organization name';
const organization = fakeOrganization({ name: organizationName });
const organizationResponse = { data: { organization } };
const variables = { id: organizationId, createPath: undefined };

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
