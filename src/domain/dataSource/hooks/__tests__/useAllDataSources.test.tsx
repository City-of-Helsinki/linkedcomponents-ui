/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MockedProvider } from '@apollo/client/testing';
import { renderHook, waitFor } from '@testing-library/react';
import map from 'lodash/map';
import range from 'lodash/range';
import React, { PropsWithChildren } from 'react';

import { DataSourcesDocument, Meta } from '../../../../generated/graphql';
import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
import { fakeDataSources } from '../../../../utils/mockDataUtils';
import { createCache } from '../../../app/apollo/apolloClient';
import { NotificationsProvider } from '../../../app/notificationsContext/NotificationsContext';
import { AuthContext } from '../../../auth/AuthContext';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import { MAX_DATA_SOURCES_PAGE_SIZE } from '../../constants';
import useAllDataSources from '../useAllDataSources';

const PAGE_SIZE = 10;

const dataSourceNames = range(1, PAGE_SIZE + 1).map(
  (n) => `Data source name ${n}`
);
const page2DataSourceNames = range(1, PAGE_SIZE + 1).map(
  (n) => `Page 2 data source ${n}`
);
const dataSources = fakeDataSources(
  dataSourceNames.length,
  dataSourceNames.map((name) => ({ name }))
);
const count = dataSourceNames.length + page2DataSourceNames.length;
const meta: Meta = { ...dataSources.meta, count };

const dataSourcesResponse = {
  data: {
    dataSources: {
      ...dataSources,
      meta: { ...meta, next: 'http://localhost:8000/v1/data_source/?page=2' },
    },
  },
};
const dataSourcesVariables = {
  createPath: undefined,
  pageSize: MAX_DATA_SOURCES_PAGE_SIZE,
};
const mockedDataSourcesResponse = {
  request: { query: DataSourcesDocument, variables: dataSourcesVariables },
  result: dataSourcesResponse,
};

const page2DataSources = fakeDataSources(
  page2DataSourceNames.length,
  page2DataSourceNames.map((name) => ({ name }))
);
const page2DataSourcesVariables = { ...dataSourcesVariables, page: 2 };
const page2DataSourcesResponse = {
  data: {
    dataSources: {
      ...page2DataSources,
      meta: { ...meta, previous: 'http://localhost:8000/v1/data_source/' },
    },
  },
};
const mockedPage2DataSourcesResponse = {
  request: {
    query: DataSourcesDocument,
    variables: page2DataSourcesVariables,
  },
  result: page2DataSourcesResponse,
};

const authContextValue = fakeAuthenticatedAuthContextValue();

const mocks = [
  mockedDataSourcesResponse,
  mockedPage2DataSourcesResponse,
  mockedUserResponse,
];

const getHookWrapper = async () => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <NotificationsProvider>
      <AuthContext.Provider value={authContextValue}>
        <MockedProvider cache={createCache()} mocks={mocks}>
          {children}
        </MockedProvider>
      </AuthContext.Provider>
    </NotificationsProvider>
  );

  const { result } = renderHook(() => useAllDataSources(), {
    wrapper,
  });
  // Test the initial state of the request
  expect(result.current.dataSources).toEqual([]);
  await waitFor(() => expect(result.current.user).toBeDefined());
  return { result, waitFor };
};

test('should return all data sources', async () => {
  const { result, waitFor } = await getHookWrapper();
  // Wait for the results
  await waitFor(() => expect(result.current.loading).toBeFalsy());
  await waitFor(() =>
    expect(map(result.current.dataSources, 'name')).toEqual([
      ...dataSourceNames,
      ...page2DataSourceNames,
    ])
  );
});
