import React from 'react';

import { useDataSourceQuery } from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
import { dataSourcePathBuilder } from '../utils';

interface DataSourceNameProps {
  id: string;
}

const DataSourceName: React.FC<DataSourceNameProps> = ({ id }) => {
  const { data: dataSourceData } = useDataSourceQuery({
    variables: { id, createPath: getPathBuilder(dataSourcePathBuilder) },
  });

  return (
    <>
      {
        /* istanbul ignore next */
        dataSourceData?.dataSource?.name || id || '-'
      }
    </>
  );
};

export default DataSourceName;
