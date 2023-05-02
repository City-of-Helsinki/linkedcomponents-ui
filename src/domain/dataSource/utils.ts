import {
  DataSourceFieldsFragment,
  DataSourceQueryVariables,
  DataSourcesQueryVariables,
} from '../../generated/graphql';
import { PathBuilderProps } from '../../types';
import getValue from '../../utils/getValue';
import queryBuilder from '../../utils/queryBuilder';
import { DataSourceFields } from './types';

export const dataSourcePathBuilder = ({
  args,
}: PathBuilderProps<DataSourceQueryVariables>): string => {
  const { id } = args;

  return `/data_source/${id}/`;
};

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

export const getDataSourceFields = (
  dataSource: DataSourceFieldsFragment
): DataSourceFields => {
  const id = getValue(dataSource.id, '');

  return {
    id,
    name: getValue(dataSource.name, ''),
  };
};
