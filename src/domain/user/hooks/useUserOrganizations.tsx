import { useApolloClient } from '@apollo/client';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import React from 'react';

import {
  OrganizationFieldsFragment,
  UserFieldsFragment,
} from '../../../generated/graphql';
import { getOrganizationQueryResult } from '../../organization/utils';

type userOrganizationsState = {
  loading: boolean;
  organizations: OrganizationFieldsFragment[];
};

const useUserOrganizations = (
  user?: UserFieldsFragment
): userOrganizationsState => {
  const apolloClient = useApolloClient();
  const [loading, setLoading] = React.useState(false);
  const [organizations, setOrganizations] = React.useState<
    OrganizationFieldsFragment[]
  >([]);

  React.useEffect(() => {
    const organizationIds = uniq([
      user?.organization,
      ...(user?.adminOrganizations ?? []),
      ...(user?.organizationMemberships ?? []),
    ]).filter((id) => id);

    const getUserOrganizations = async () => {
      try {
        setLoading(true);

        const userOrganizations = await Promise.all(
          organizationIds.map(async (id) => {
            const userOrganization = await getOrganizationQueryResult(
              id as string,
              apolloClient
            );
            return userOrganization;
          })
        );

        setOrganizations(
          sortBy(
            userOrganizations.filter(
              (org) => org
            ) as OrganizationFieldsFragment[],
            'name'
          )
        );
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    };
    getUserOrganizations();
  }, [apolloClient, user]);

  return { loading, organizations };
};

export default useUserOrganizations;
