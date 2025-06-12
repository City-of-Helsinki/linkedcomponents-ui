import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';

import { Meta } from '../../../generated/graphql';
import getNextPage from '../../../utils/getNextPage';
import { useNotificationsContext } from '../../app/notificationsContext/hooks/useNotificationsContext';

type UseDebounceLoadAllQueryProps = {
  meta: Meta | null;
  fetchMore: (options: { variables: { page: number } }) => Promise<unknown>;
  loading: boolean;
};

type DebounceLoadingState = { debouncedLoading: boolean };

const useDebounceLoadAllQuery = ({
  meta,
  fetchMore,
  loading,
}: UseDebounceLoadAllQueryProps): DebounceLoadingState => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationsContext();
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
    const page = meta ? getNextPage(meta) : null;

    if (page) {
      handleLoadMore(page);
    }
  }, [handleLoadMore, meta]);

  return {
    debouncedLoading,
  };
};

export default useDebounceLoadAllQuery;
