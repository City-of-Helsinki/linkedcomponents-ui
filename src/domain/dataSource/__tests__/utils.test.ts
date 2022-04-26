import { DataSourcesQueryVariables } from '../../../generated/graphql';
import { fakeDataSource } from '../../../utils/mockDataUtils';
import {
  dataSourcePathBuilder,
  dataSourcesPathBuilder,
  getDataSourceFields,
} from '../utils';

describe('dataSourcePathBuilder function', () => {
  it('should create correct path for data source request', () => {
    expect(dataSourcePathBuilder({ args: { id: '123' } })).toBe(
      '/data_source/123/'
    );
  });
});

describe('dataSourcesPathBuilder function', () => {
  const cases: [DataSourcesQueryVariables, string][] = [
    [{ page: 2 }, '/data_source/?page=2'],
    [{ pageSize: 2 }, '/data_source/?page_size=2'],
  ];

  it.each(cases)('should build correct path', (variables, expectedPath) =>
    expect(dataSourcesPathBuilder({ args: variables })).toBe(expectedPath)
  );
});

describe('getDataSourceFields function', () => {
  it('should return default values if value is not set', () => {
    const { id, name } = getDataSourceFields(
      fakeDataSource({
        id: null,
        name: null,
      })
    );

    expect(id).toBe('');
    expect(name).toBe('');
  });
});
