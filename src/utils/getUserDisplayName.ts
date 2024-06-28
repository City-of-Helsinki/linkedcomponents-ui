import { User } from 'oidc-client-ts';

import skipFalsyType from './skipFalsyType';

const getUserDisplayName = ({
  authUser,
  authenticated,
}: {
  authUser: User | null;
  authenticated: boolean;
}) => {
  if (authenticated && authUser?.profile) {
    const { name, family_name, given_name } = authUser.profile;
    return name || [given_name, family_name].filter(skipFalsyType).join(' ');
  }
  return '';
};

export default getUserDisplayName;
