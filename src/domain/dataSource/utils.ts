import { DataSourcesQueryVariables } from '../../generated/graphql';
import { PathBuilderProps } from '../../types';
import queryBuilder from '../../utils/queryBuilder';

export const dataSourcesPathBuilder = ({
  args,
}: PathBuilderProps<DataSourcesQueryVariables>): string => {
  const { page, pageSize } = args;

  const variableToKeyItems = [
    { key: 'page', value: page },
    { key: 'page_size', value: pageSize },
  ];

  const query = queryBuilder(variableToKeyItems);

  return `/data_source/${query}`;
};
