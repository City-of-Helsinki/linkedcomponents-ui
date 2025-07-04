import {
  OrganizationFieldsFragment,
  useOrganizationsQuery,
} from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import skipFalsyType from '../../../utils/skipFalsyType';
import { MAX_OGRANIZATIONS_PAGE_SIZE } from '../constants';
import { organizationsPathBuilder } from '../utils';
import useDebounceLoadAllQuery from './useDebounceLoadAllQuery';

type UseAllOrganizationsState = {
  loading: boolean;
  organizations: OrganizationFieldsFragment[];
};

const useAllOrganizations = (): UseAllOrganizationsState => {
  const {
    data: organizationsData,
    fetchMore,
    loading,
  } = useOrganizationsQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      createPath: getPathBuilder(organizationsPathBuilder),
      pageSize: MAX_OGRANIZATIONS_PAGE_SIZE,
      dissolved: false,
    },
  });

  const { debouncedLoading } = useDebounceLoadAllQuery({
    meta: organizationsData?.organizations.meta ?? null,
    fetchMore,
    loading,
  });

  return {
    loading: debouncedLoading,
    organizations: getValue(
      organizationsData?.organizations.data.filter(skipFalsyType),
      []
    ),
  };
};

export default useAllOrganizations;
