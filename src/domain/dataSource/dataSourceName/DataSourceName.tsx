import React from 'react';

import { useDataSourceQuery } from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import { dataSourcePathBuilder } from '../utils';

interface DataSourceNameProps {
  id: string;
}

const DataSourceName: React.FC<DataSourceNameProps> = ({ id }) => {
  const { data: dataSourceData } = useDataSourceQuery({
    skip: !id,
    variables: { id, createPath: getPathBuilder(dataSourcePathBuilder) },
  });

  return <>{getValue(dataSourceData?.dataSource?.name || id, '-')}</>;
};

export default DataSourceName;
