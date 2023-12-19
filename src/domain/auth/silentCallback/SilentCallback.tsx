import { loginProviderProps } from '../constants';
import { createUserManager } from '../utils';

const SilentCallback = (): null => {
  const mgr = createUserManager(loginProviderProps.userManagerSettings);
  mgr.signinSilentCallback();

  return null;
};

export default SilentCallback;
