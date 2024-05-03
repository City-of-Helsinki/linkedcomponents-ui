import { UserManager, UserManagerSettings } from 'oidc-client-ts';

/* istanbul ignore next */
export const createUserManager = (config: UserManagerSettings) => {
  return new UserManager(config);
};
