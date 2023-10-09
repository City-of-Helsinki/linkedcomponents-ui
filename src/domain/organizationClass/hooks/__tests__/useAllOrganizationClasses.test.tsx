/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MockedProvider } from '@apollo/client/testing';
import { renderHook, waitFor } from '@testing-library/react';
import map from 'lodash/map';
import range from 'lodash/range';
import React, { PropsWithChildren } from 'react';

import {
  Meta,
  OrganizationClassesDocument,
} from '../../../../generated/graphql';
import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
import { fakeOrganizationClasses } from '../../../../utils/mockDataUtils';
import { createCache } from '../../../app/apollo/apolloClient';
import { AuthContext } from '../../../auth/AuthContext';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import { MAX_OGRANIZATION_CLASSES_PAGE_SIZE } from '../../constants';
import useAllOrganizationClasses from '../useAllOrganizationClasses';

const PAGE_SIZE = 10;

const organiozationClassNames = range(1, PAGE_SIZE + 1).map(
  (n) => `Organization class name ${n}`
);
const page2OrganizationClassNames = range(1, PAGE_SIZE + 1).map(
  (n) => `Page 2 organization class ${n}`
);
const organizationClasses = fakeOrganizationClasses(
  organiozationClassNames.length,
  organiozationClassNames.map((name) => ({ name }))
);
const count =
  organiozationClassNames.length + page2OrganizationClassNames.length;
const meta: Meta = { ...organizationClasses.meta, count };

const organizationClassesResponse = {
  data: {
    organizationClasses: {
      ...organizationClasses,
      meta: {
        ...meta,
        next: 'http://localhost:8000/v1/organization_class/?page=2',
      },
    },
  },
};
const organizationClassesVariables = {
  createPath: undefined,
  pageSize: MAX_OGRANIZATION_CLASSES_PAGE_SIZE,
};
const mockedOrganizationClassesResponse = {
  request: {
    query: OrganizationClassesDocument,
    variables: organizationClassesVariables,
  },
  result: organizationClassesResponse,
};

const page2OrganizationClasses = fakeOrganizationClasses(
  page2OrganizationClassNames.length,
  page2OrganizationClassNames.map((name) => ({ name }))
);
const page2OrganizationClassesVariables = {
  ...organizationClassesVariables,
  page: 2,
};
const page2OrganizationClassesResponse = {
  data: {
    organizationClasses: {
      ...page2OrganizationClasses,
      meta: {
        ...meta,
        previous: 'http://localhost:8000/v1/organization_class/',
      },
    },
  },
};
const mockedPage2OrganizationClassesResponse = {
  request: {
    query: OrganizationClassesDocument,
    variables: page2OrganizationClassesVariables,
  },
  result: page2OrganizationClassesResponse,
};

const mocks = [
  mockedOrganizationClassesResponse,
  mockedPage2OrganizationClassesResponse,
  mockedUserResponse,
];

const authContextValue = fakeAuthenticatedAuthContextValue();

const getHookWrapper = async () => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <AuthContext.Provider value={authContextValue}>
      <MockedProvider cache={createCache()} mocks={mocks}>
        {children}
      </MockedProvider>
    </AuthContext.Provider>
  );

  const { result } = renderHook(() => useAllOrganizationClasses(), {
    wrapper,
  });
  // Test the initial state of the request
  expect(result.current.organizationClasses).toEqual([]);
  await waitFor(() => expect(result.current.user).toBeDefined());
  return { result };
};

test('should return all organization classes', async () => {
  const { result } = await getHookWrapper();
  // Wait for the results
  await waitFor(() => expect(result.current.loading).toBeFalsy());
  await waitFor(() =>
    expect(map(result.current.organizationClasses, 'name')).toEqual([
      ...organiozationClassNames,
      ...page2OrganizationClassNames,
    ])
  );
});
