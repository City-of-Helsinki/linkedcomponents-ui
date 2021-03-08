import { MAX_PAGE_SIZE } from '../../../constants';
import {
  EventFieldsFragment,
  OrganizationFieldsFragment,
  useOrganizationsQuery,
} from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
import { organizationsPathBuilder } from '../../organization/utils';

type EventOrganizationState = {
  loading: boolean;
  organizationAncestors: OrganizationFieldsFragment[];
};

const useEventOrganization = (
  event: EventFieldsFragment
): EventOrganizationState => {
  const publisher = event.publisher;

  const { data, loading } = useOrganizationsQuery({
    skip: !publisher,
    variables: {
      child: publisher as string,
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

export default useEventOrganization;
