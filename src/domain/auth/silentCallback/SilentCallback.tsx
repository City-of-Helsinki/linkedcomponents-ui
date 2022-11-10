import { createUserManager } from '../utils';

const SilentCallback = (): null => {
  const mgr = createUserManager({});
  mgr.signinSilentCallback();

  return null;
};

export default SilentCallback;
