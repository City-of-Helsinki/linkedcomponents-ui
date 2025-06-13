import {
  OrganizationFieldsFragment,
  useOrganizationsQuery,
} from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import skipFalsyType from '../../../utils/skipFalsyType';
import { organizationsPathBuilder } from '../../organization/utils';
import { MAX_OGRANIZATIONS_PAGE_SIZE } from '../constants';
import useDebounceLoadAllQuery from './useDebounceLoadAllQuery';

type OrganizationState = {
  loading: boolean;
  organizationDecendants: OrganizationFieldsFragment[];
};

const useOrganizationDecendants = (id: string): OrganizationState => {
  const {
    data: organizationsData,
    loading,
    fetchMore,
  } = useOrganizationsQuery({
    skip: !id,
    variables: {
      createPath: getPathBuilder(organizationsPathBuilder),
      pageSize: MAX_OGRANIZATIONS_PAGE_SIZE,
      parent: id,
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
    organizationDecendants: getValue(
      organizationsData?.organizations.data.filter(skipFalsyType),
      []
    ),
  };
};

export default useOrganizationDecendants;
