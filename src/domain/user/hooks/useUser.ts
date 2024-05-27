import { useApiTokens } from 'hds-react';

import { UserFieldsFragment, useUserQuery } from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import useAuth from '../../auth/hooks/useAuth';
import { isExternalUserWithoutOrganization } from '../../organization/utils';
import { userPathBuilder } from '../utils';

/* istanbul ignore next */

export type UserState = {
  loading: boolean;
  user?: UserFieldsFragment;
  externalUser: boolean;
};

const useUser = (): UserState => {
  const { user } = useAuth();
  const { getStoredApiTokens } = useApiTokens();
  const userId = user?.profile.sub;
  const [, apiTokens] = getStoredApiTokens();

  const { data: userData, loading: loadingUser } = useUserQuery({
    skip: !apiTokens || !userId,
    variables: {
      id: getValue(userId, ''),
      createPath: getPathBuilder(userPathBuilder),
    },
  });

  const loading = loadingUser;

  const isExternalUser = isExternalUserWithoutOrganization({
    user: userData?.user,
  });

  return { loading, user: userData?.user, externalUser: isExternalUser };
};

export default useUser;
