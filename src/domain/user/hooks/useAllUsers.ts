import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';

import { MAX_PAGE_SIZE } from '../../../constants';
import { UserFieldsFragment, useUsersQuery } from '../../../generated/graphql';
import getNextPage from '../../../utils/getNextPage';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import skipFalsyType from '../../../utils/skipFalsyType';
import { useNotificationsContext } from '../../app/notificationsContext/hooks/useNotificationsContext';
import { usersPathBuilder } from '../utils';
import useUser from './useUser';

type UseAllOrganizationsState = {
  loading: boolean;
  user: UserFieldsFragment | undefined;
  users: UserFieldsFragment[];
};

const useAllUsers = (): UseAllOrganizationsState => {
  const { t } = useTranslation();
  const { addNotification } = useNotificationsContext();
  const { user } = useUser();

  const {
    data: usersData,
    fetchMore,
    loading,
  } = useUsersQuery({
    notifyOnNetworkStatusChange: true,
    skip: !user,
    variables: {
      createPath: getPathBuilder(usersPathBuilder),
      pageSize: MAX_PAGE_SIZE,
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
    const page = usersData?.users.meta
      ? getNextPage(usersData.users.meta)
      : null;

    if (page) {
      handleLoadMore(page);
    }
  }, [handleLoadMore, usersData]);

  return {
    loading: debouncedLoading,
    user,
    users: getValue(usersData?.users.data.filter(skipFalsyType), []),
  };
};

export default useAllUsers;
