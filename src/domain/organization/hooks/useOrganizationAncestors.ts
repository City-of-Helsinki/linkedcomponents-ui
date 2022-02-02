import { MAX_PAGE_SIZE } from '../../../constants';
import {
  OrganizationFieldsFragment,
  useOrganizationsQuery,
} from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
import { organizationsPathBuilder } from '../../organization/utils';

type OrganizationState = {
  loading: boolean;
  organizationAncestors: OrganizationFieldsFragment[];
};

const useOrganizationAncestors = (publisher: string): OrganizationState => {
  const { data, loading } = useOrganizationsQuery({
    skip: !publisher,
    variables: {
      child: publisher,
      createPath: getPathBuilder(organizationsPathBuilder),
      pageSize: MAX_PAGE_SIZE,
    },
  });

  return {
    loading,
    organizationAncestors:
      (data?.organizations.data as OrganizationFieldsFragment[]) || [],
  };
};

export default useOrganizationAncestors;
