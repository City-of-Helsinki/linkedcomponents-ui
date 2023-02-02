import { MAX_PAGE_SIZE } from '../../../constants';
import {
  OrganizationFieldsFragment,
  useOrganizationsQuery,
} from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import skipFalsyType from '../../../utils/skipFalsyType';
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
    organizationAncestors: getValue(
      data?.organizations.data.filter(skipFalsyType),
      []
    ),
  };
};

export default useOrganizationAncestors;
