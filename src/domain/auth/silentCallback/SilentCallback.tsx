import { UserManagerSettings } from 'oidc-client-ts';

import { loginProviderProps } from '../constants';
import { createUserManager } from '../utils';

const SilentCallback = (): null => {
  const mgr = createUserManager(
    loginProviderProps.userManagerSettings as UserManagerSettings
  );
  mgr.signinSilentCallback();

  return null;
};

export default SilentCallback;
