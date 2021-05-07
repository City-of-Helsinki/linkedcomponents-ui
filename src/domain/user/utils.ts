import {
  UserFieldsFragment,
  UserQueryVariables,
} from '../../generated/graphql';
import { PathBuilderProps } from '../../types';
import { UserFields } from './types';

export const userPathBuilder = ({
  args,
}: PathBuilderProps<UserQueryVariables>): string => {
  const { id } = args;

  return `/user/${id}/`;
};

export const getUserFields = (user: UserFieldsFragment): UserFields => ({
  adminOrganizations: user.adminOrganizations,
  isStaff: user.isStaff || false,
  organizationMemberships: user.organizationMemberships,
});
