import { useDebounce } from 'use-debounce';

import { UserFieldsFragment, useUserQuery } from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
import getValue from '../../../utils/getValue';
import isTestEnv from '../../../utils/isTestEnv';
import { useAuth } from '../../auth/hooks/useAuth';
import { userPathBuilder } from '../utils';

/* istanbul ignore next */
const LOADING_USER_DEBOUNCE_TIME = isTestEnv ? 0 : 50;

export type UserState = {
  loading: boolean;
  user?: UserFieldsFragment;
};

const useUser = (): UserState => {
  const { apiToken, isLoading: loadingTokens, user } = useAuth();
  const userId = user?.profile.sub;

  const { data: userData, loading: loadingUser } = useUserQuery({
    skip: !apiToken || !user,
    variables: {
      id: getValue(userId, ''),
      createPath: getPathBuilder(userPathBuilder),
    },
  });

  const [loading] = useDebounce(
    loadingUser || loadingTokens,
    LOADING_USER_DEBOUNCE_TIME
  );

  return { loading, user: userData?.user };
};

export default useUser;
