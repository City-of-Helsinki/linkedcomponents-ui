import { useSelector } from 'react-redux';

import { UserFieldsFragment, useUserQuery } from '../../../generated/graphql';
import getPathBuilder from '../../../utils/getPathBuilder';
import {
  apiTokenSelector,
  loadingSelector as loadingTokensSelector,
  userSelector,
} from '../../auth/selectors';
import { userPathBuilder } from '../utils';

type UserState = {
  loading: boolean;
  user?: UserFieldsFragment;
};

const useUser = (): UserState => {
  const apiToken = useSelector(apiTokenSelector);
  const loadingTokens = useSelector(loadingTokensSelector);
  const user = useSelector(userSelector);
  const userId = user?.profile.sub;

  const { data: userData, loading: loadingUser } = useUserQuery({
    skip: !apiToken || !user,
    variables: {
      id: userId as string,
      createPath: getPathBuilder(userPathBuilder),
    },
  });
  return { loading: loadingUser || loadingTokens, user: userData?.user };
};

export default useUser;
