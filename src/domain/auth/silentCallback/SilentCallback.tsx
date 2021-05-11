import { processSilentRenew } from 'redux-oidc';

const SilentCallback = (): null => {
  processSilentRenew();

  return null;
};

export default SilentCallback;
