import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import {
  DataSourceFieldsFragment,
  useDataSourcesQuery,
  UserFieldsFragment,
} from '../../../generated/graphql';
import useDebounce from '../../../hooks/useDebounce';
import getNextPage from '../../../utils/getNextPage';
import getPathBuilder from '../../../utils/getPathBuilder';
import useUser from '../../user/hooks/useUser';
import { MAX_DATA_SOURCES_PAGE_SIZE } from '../constants';
import { dataSourcesPathBuilder } from '../utils';

type UseAllDataSourcesState = {
  dataSources: DataSourceFieldsFragment[];
  loading: boolean;
  user: UserFieldsFragment | undefined;
};

const useAllDataSources = (
  showOnlyUserEditable?: boolean
): UseAllDataSourcesState => {
  const { t } = useTranslation();
  const { user } = useUser();

  const {
    data: dataSourcesData,
    fetchMore,
    loading,
  } = useDataSourcesQuery({
    notifyOnNetworkStatusChange: true,
    skip: !user,
    variables: {
      createPath: getPathBuilder(dataSourcesPathBuilder),
      pageSize: MAX_DATA_SOURCES_PAGE_SIZE,
    },
  });

  const debouncedLoading = useDebounce(loading, 20);

  const handleLoadMore = React.useCallback(
    async (page: number) => {
      try {
        await fetchMore({ variables: { page } });
      } catch (e) /* istanbul ignore next */ {
        toast.error(t('common.errorLoadMore'));
      }
    },
    [fetchMore, t]
  );

  React.useEffect(() => {
    const page = dataSourcesData?.dataSources.meta
      ? getNextPage(dataSourcesData.dataSources.meta)
      : null;

    if (page) {
      handleLoadMore(page);
    }
  }, [handleLoadMore, dataSourcesData]);

  return {
    dataSources:
      (dataSourcesData?.dataSources.data.filter(
        (ds) => !showOnlyUserEditable || ds?.userEditable
      ) as DataSourceFieldsFragment[]) || [],
    loading: debouncedLoading,
    user,
  };
};

export default useAllDataSources;
