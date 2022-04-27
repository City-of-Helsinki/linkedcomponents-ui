import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { OrganizationDocument } from '../../../../generated/graphql';
import { configure, render, screen } from '../../../../utils/testUtils';
import {
  mockedOrganizationResponse,
  organizationId,
  organizationName,
  organizationVariables,
} from '../../__mocks__/organization';
import OrganizationName from '../OrganizationName';

configure({ defaultHidden: true });

const renderComponent = (mocks: MockedResponse[]) =>
  render(<OrganizationName id={organizationId} />, { mocks });

test('should show organization name correctly', async () => {
  renderComponent([mockedOrganizationResponse]);
  await screen.findByText(organizationName);
});

test('should show default value when organization is not found', async () => {
  renderComponent([
    {
      request: {
        query: OrganizationDocument,
        variables: organizationVariables,
      },
      error: new Error(),
    },
  ]);
  await screen.findByText('-');
});
