import { UserFieldsFragment } from '../../generated/graphql';
import {
  hasAdminOrganization,
  hasRegistrationAdminOrganization,
} from '../organization/utils';

export const areAdminRoutesAllowed = (user?: UserFieldsFragment) =>
  hasAdminOrganization(user);

export const areRegistrationRoutesAllowed = (
  user?: UserFieldsFragment
): boolean =>
  Boolean(
    hasAdminOrganization(user) ||
      hasRegistrationAdminOrganization(user) ||
      user?.isSubstituteUser
  );
