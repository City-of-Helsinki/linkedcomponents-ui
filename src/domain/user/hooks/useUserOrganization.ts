import {
  OrganizationFieldsFragment,
  UserFieldsFragment,
} from '../../../generated/graphql';
import getValue from '../../../utils/getValue';
import useUserOrganizations from './useUserOrganizations';

type userOrganizationState = {
  loading: boolean;
  organization: OrganizationFieldsFragment | null;
};

const useUserOrganization = (
  user?: UserFieldsFragment
): userOrganizationState => {
  const { loading, organizations } = useUserOrganizations(user);

  return {
    loading,
    organization: getValue(
      organizations.find((o) => o.id === user?.organization),
      null
    ),
  };
};

export default useUserOrganization;
