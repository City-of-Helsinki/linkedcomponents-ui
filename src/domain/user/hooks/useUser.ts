import { useDebounce } from 'use-debounce';

import { UserFieldsFragment, useUserQuery } from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
import { useAuth } from '../../auth/hooks/useAuth';
import { userPathBuilder } from '../utils';

const LOADING_USER_DEBOUNCE_TIME = 100;

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
      id: userId as string,
      createPath: getPathBuilder(userPathBuilder),
    },
  });

  const [loading] = useDebounce(
    loadingUser || loadingTokens,
    LOADING_USER_DEBOUNCE_TIME,
    { leading: true }
  );

  return { loading, user: userData?.user };
};

export default useUser;
