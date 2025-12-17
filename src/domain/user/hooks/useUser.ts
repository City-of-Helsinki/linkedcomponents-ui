import { useApiTokens } from 'hds-react';
import { useEffect, useRef } from 'react';

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
  const { user, isRenewing } = useAuth();
  const { getStoredApiTokens } = useApiTokens();
  const userId = user?.profile.sub;
  const [, apiTokens] = getStoredApiTokens();

  const lastValidUserRef = useRef<UserFieldsFragment | undefined>();

  const { data: userData, loading: loadingUser } = useUserQuery({
    skip: !apiTokens || !userId,
    variables: {
      id: getValue(userId, ''),
      createPath: getPathBuilder(userPathBuilder),
    },
  });

  useEffect(() => {
    if (userData?.user && !isRenewing) {
      lastValidUserRef.current = userData.user;
    }
  }, [userData?.user, isRenewing]);

  const loading = loadingUser;

  const currentUser =
    isRenewing && lastValidUserRef.current
      ? lastValidUserRef.current
      : userData?.user;

  const isExternalUser = isExternalUserWithoutOrganization({
    user: currentUser,
  });

  return { loading, user: currentUser, externalUser: isExternalUser };
};

export default useUser;
