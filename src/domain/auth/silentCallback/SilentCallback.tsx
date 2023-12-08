import { settings } from '../userManager';
import { createUserManager } from '../utils';

const SilentCallback = (): null => {
  const mgr = createUserManager(settings);
  mgr.signinSilentCallback();

  return null;
};

export default SilentCallback;
