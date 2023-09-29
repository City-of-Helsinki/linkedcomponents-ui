import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';

import {
  DataSourceFieldsFragment,
  useDataSourcesQuery,
  UserFieldsFragment,
} from '../../../generated/graphql';
import getNextPage from '../../../utils/getNextPage';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import skipFalsyType from '../../../utils/skipFalsyType';
import { useNotificationsContext } from '../../app/notificationsContext/hooks/useNotificationsContext';
import useUser from '../../user/hooks/useUser';
import { MAX_DATA_SOURCES_PAGE_SIZE } from '../constants';
import { dataSourcesPathBuilder } from '../utils';

type UseAllDataSourcesState = {
  dataSources: DataSourceFieldsFragment[];
  loading: boolean;
  user: UserFieldsFragment | undefined;
};

const useAllDataSources = (): UseAllDataSourcesState => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationsContext();
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

  const [debouncedLoading] = useDebounce(loading, 100);

  const handleLoadMore = React.useCallback(
    async (page: number) => {
      try {
        await fetchMore({ variables: { page } });
      } catch (e) /* istanbul ignore next */ {
        addNotification({ label: t('common.errorLoadMore'), type: 'error' });
      }
    },
    [addNotification, fetchMore, t]
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
    dataSources: getValue(
      dataSourcesData?.dataSources.data.filter(skipFalsyType),
      []
    ),
    loading: debouncedLoading,
    user,
  };
};

export default useAllDataSources;
