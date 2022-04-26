import { DataSourcesQueryVariables } from '../../../generated/graphql';
import { dataSourcesPathBuilder } from '../utils';

describe('dataSourcesPathBuilder function', () => {
  const cases: [DataSourcesQueryVariables, string][] = [
    [{ page: 2 }, '/data_source/?page=2'],
    [{ pageSize: 2 }, '/data_source/?page_size=2'],
  ];

  it.each(cases)('should build correct path', (variables, expectedPath) =>
    expect(dataSourcesPathBuilder({ args: variables })).toBe(expectedPath)
  );
});
