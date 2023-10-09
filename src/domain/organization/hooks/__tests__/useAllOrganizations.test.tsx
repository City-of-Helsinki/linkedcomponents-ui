import { MockedProvider } from '@apollo/client/testing';
import { renderHook, waitFor } from '@testing-library/react';
import map from 'lodash/map';
import range from 'lodash/range';
import React, { PropsWithChildren } from 'react';

import { Meta, OrganizationsDocument } from '../../../../generated/graphql';
import { fakeOrganizations } from '../../../../utils/mockDataUtils';
import { createCache } from '../../../app/apollo/apolloClient';
import { MAX_OGRANIZATIONS_PAGE_SIZE } from '../../constants';
import useAllOrganizations from '../useAllOrganizations';

const PAGE_SIZE = 10;

const organizationNames = range(1, PAGE_SIZE + 1).map(
  (n) => `Organization name ${n}`
);
const page2OrganizationNames = range(1, PAGE_SIZE + 1).map(
  (n) => `Page 2 organization ${n}`
);
const organizations = fakeOrganizations(
  organizationNames.length,
  organizationNames.map((name) => ({ name }))
);
const count = organizationNames.length + page2OrganizationNames.length;
const meta: Meta = { ...organizations.meta, count };

const organizationsResponse = {
  data: {
    organizations: {
      ...organizations,
      meta: { ...meta, next: 'http://localhost:8000/v1/organization/?page=2' },
    },
  },
};
const organizationsVariables = {
  createPath: undefined,
  pageSize: MAX_OGRANIZATIONS_PAGE_SIZE,
};
const mockedOrganizationsResponse = {
  request: { query: OrganizationsDocument, variables: organizationsVariables },
  result: organizationsResponse,
};

const page2Organizations = fakeOrganizations(
  page2OrganizationNames.length,
  page2OrganizationNames.map((name) => ({ name }))
);
const page2OrganizationsVariables = { ...organizationsVariables, page: 2 };
const page2OrganizationsResponse = {
  data: {
    organizations: {
      ...page2Organizations,
      meta: { ...meta, previous: 'http://localhost:8000/v1/organization/' },
    },
  },
};
const mockedPage2OrganizationsResponse = {
  request: {
    query: OrganizationsDocument,
    variables: page2OrganizationsVariables,
  },
  result: page2OrganizationsResponse,
};

const mocks = [mockedOrganizationsResponse, mockedPage2OrganizationsResponse];

const getHookWrapper = () => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <MockedProvider cache={createCache()} mocks={mocks}>
      {children}
    </MockedProvider>
  );

  const { result } = renderHook(() => useAllOrganizations(), {
    wrapper,
  });
  // Test the initial state of the request
  expect(result.current.loading).toBe(true);
  expect(result.current.organizations).toEqual([]);
  return { result };
};

test('should return all organizations', async () => {
  const { result } = getHookWrapper();
  // Wait for the results
  await waitFor(() => expect(result.current.loading).toBeFalsy());
  await waitFor(() =>
    expect(map(result.current.organizations, 'name')).toEqual([
      ...organizationNames,
      ...page2OrganizationNames,
    ])
  );
});
