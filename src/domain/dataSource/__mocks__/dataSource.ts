import {
  DataSourceDocument,
  DataSourcesDocument,
} from '../../../generated/graphql';
import { fakeDataSources } from '../../../utils/mockDataUtils';
import { MAX_DATA_SOURCES_PAGE_SIZE, TEST_DATA_SOURCE_ID } from '../constants';

const dataSourceName = 'Data source name';

const dataSources = fakeDataSources(1, [
  { id: TEST_DATA_SOURCE_ID, name: dataSourceName, userEditable: true },
]);
const dataSourcesResponse = { data: { dataSources } };
const dataSourcesVariables = {
  createPath: undefined,
  pageSize: MAX_DATA_SOURCES_PAGE_SIZE,
};
const mockedDataSourcesResponse = {
  request: { query: DataSourcesDocument, variables: dataSourcesVariables },
  result: dataSourcesResponse,
};

const dataSource = dataSources.data[0];
const dataSourceResponse = { data: { dataSource } };
const dataSourceVariables = {
  createPath: undefined,
  id: TEST_DATA_SOURCE_ID,
};
const mockedDataSourceResponse = {
  request: { query: DataSourceDocument, variables: dataSourceVariables },
  result: dataSourceResponse,
};

export { dataSourceName, mockedDataSourceResponse, mockedDataSourcesResponse };
