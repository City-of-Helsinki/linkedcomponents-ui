import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import React from 'react';

import {
  OrganizationFieldsFragment,
  UserFieldsFragment,
} from '../../../generated/graphql';
import useIsMounted from '../../../hooks/useIsMounted';
import getValue from '../../../utils/getValue';
import skipFalsyType from '../../../utils/skipFalsyType';
import { getOrganizationQueryResult } from '../../organization/utils';

type userOrganizationsState = {
  loading: boolean;
  organizations: OrganizationFieldsFragment[];
};

const useUserOrganizations = (
  user?: UserFieldsFragment
): userOrganizationsState => {
  const isMounted = useIsMounted();
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>;
  const [loading, setLoading] = React.useState(false);
  const [organizations, setOrganizations] = React.useState<
    OrganizationFieldsFragment[]
  >([]);

  React.useEffect(() => {
    const organizationIds = uniq([
      user?.organization,
      ...getValue(user?.adminOrganizations, []),
      ...getValue(user?.organizationMemberships, []),
    ]).filter(skipFalsyType);

    const getUserOrganizations = async () => {
      try {
        setLoading(true);

        const userOrganizations = await Promise.all(
          organizationIds.map((id) =>
            getOrganizationQueryResult(getValue(id, ''), apolloClient)
          )
        );

        /* istanbul ignore else */
        if (isMounted.current) {
          setOrganizations(
            sortBy(userOrganizations.filter(skipFalsyType), 'name')
          );
          setLoading(false);
        }
      } catch (e) /* istanbul ignore next */ {
        setLoading(false);
      }
    };

    if (user) {
      getUserOrganizations();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apolloClient, user]);

  return { loading, organizations };
};

export default useUserOrganizations;
