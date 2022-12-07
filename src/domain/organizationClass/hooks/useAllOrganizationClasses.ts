import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';

import {
  OrganizationClassFieldsFragment,
  useOrganizationClassesQuery,
  UserFieldsFragment,
} from '../../../generated/graphql';
import getNextPage from '../../../utils/getNextPage';
import getPathBuilder from '../../../utils/getPathBuilder';
import useUser from '../../user/hooks/useUser';
import { MAX_OGRANIZATION_CLASSES_PAGE_SIZE } from '../constants';
import { organizationClassesPathBuilder } from '../utils';

type UseAllOrganizationClassesState = {
  loading: boolean;
  organizationClasses: OrganizationClassFieldsFragment[];
  user: UserFieldsFragment | undefined;
};

const useAllOrganizationClasses = (): UseAllOrganizationClassesState => {
  const { t } = useTranslation();
  const { user } = useUser();

  const {
    data: organizationClassesData,
    fetchMore,
    loading,
  } = useOrganizationClassesQuery({
    notifyOnNetworkStatusChange: true,
    skip: !user,
    variables: {
      createPath: getPathBuilder(organizationClassesPathBuilder),
      pageSize: MAX_OGRANIZATION_CLASSES_PAGE_SIZE,
    },
  });

  const [debouncedLoading] = useDebounce(loading, 100, { leading: true });

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
    const page = organizationClassesData?.organizationClasses.meta
      ? getNextPage(organizationClassesData.organizationClasses.meta)
      : null;

    if (page) {
      handleLoadMore(page);
    }
  }, [handleLoadMore, organizationClassesData]);

  return {
    loading: debouncedLoading,
    organizationClasses:
      (organizationClassesData?.organizationClasses
        .data as OrganizationClassFieldsFragment[]) || [],
    user,
  };
};

export default useAllOrganizationClasses;
