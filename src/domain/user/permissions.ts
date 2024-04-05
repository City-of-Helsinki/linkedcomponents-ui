import { UserFieldsFragment } from '../../generated/graphql';
import {
  hasAdminOrganization,
  hasFinancialAdminOrganization,
  hasRegistrationAdminOrganization,
} from '../organization/utils';

export const areAdminRoutesAllowed = (user?: UserFieldsFragment): boolean =>
  user?.isSuperuser ||
  hasAdminOrganization(user) ||
  hasFinancialAdminOrganization(user);

export const areRegistrationRoutesAllowed = (
  user?: UserFieldsFragment
): boolean =>
  user?.isSuperuser ||
  user?.isSubstituteUser ||
  hasAdminOrganization(user) ||
  hasRegistrationAdminOrganization(user);
