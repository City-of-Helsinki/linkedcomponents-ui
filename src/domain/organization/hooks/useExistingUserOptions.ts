import uniqBy from 'lodash/uniqBy';

import {
  OrganizationFieldsFragment,
  UserFieldsFragment,
} from '../../../generated/graphql';
import getValue from '../../../utils/getValue';
import skipFalsyType from '../../../utils/skipFalsyType';
import { getUserOption } from '../../user/utils';

export type UseExistingUserOptionsProps = {
  organization?: OrganizationFieldsFragment;
};
const useExistingUserOptions = ({
  organization,
}: UseExistingUserOptionsProps) => {
  const users: UserFieldsFragment[] = organization
    ? uniqBy(
        [
          ...getValue(organization.adminUsers?.filter(skipFalsyType), []),
          ...getValue(
            organization.financialAdminUsers?.filter(skipFalsyType),
            []
          ),
          ...getValue(
            organization.registrationAdminUsers?.filter(skipFalsyType),
            []
          ),
          ...getValue(organization.regularUsers?.filter(skipFalsyType), []),
        ],
        'username'
      )
    : [];

  return users.map((u) => getUserOption({ user: u }));
};

export default useExistingUserOptions;
