import { ApolloClient, useApolloClient } from '@apollo/client';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import React from 'react';

import {
  OrganizationFieldsFragment,
  UserFieldsFragment,
} from '../../../generated/graphql';
import useIsMounted from '../../../hooks/useIsMounted';
import { getOrganizationQueryResult } from '../../organization/utils';

type userOrganizationsState = {
  loading: boolean;
  organizations: OrganizationFieldsFragment[];
};

const useUserOrganizations = (
  user?: UserFieldsFragment
): userOrganizationsState => {
  const isMounted = useIsMounted();
  const apolloClient = useApolloClient() as ApolloClient<
    Record<string, unknown>
  >;
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
          organizationIds.map((id) =>
            getOrganizationQueryResult(id as string, apolloClient)
          )
        );

        /* istanbul ignore else */
        if (isMounted.current) {
          setOrganizations(
            sortBy(
              userOrganizations.filter(
                (org) => org
              ) as OrganizationFieldsFragment[],
              'name'
            )
          );
          setLoading(false);
        }
      } catch (e) /* istanbul ignore next */ {
        setLoading(false);
      }
    };
    getUserOrganizations();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apolloClient, user]);

  return { loading, organizations };
};

export default useUserOrganizations;
