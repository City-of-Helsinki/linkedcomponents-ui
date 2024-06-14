import { renderHook } from '@testing-library/react';

import { OrganizationFieldsFragment } from '../../../../generated/graphql';
import { fakeOrganization, fakeUser } from '../../../../utils/mockDataUtils';
import useExistingUserOptions from '../useExistingUserOptions';

const getHookWrapper = (organization: OrganizationFieldsFragment) =>
  renderHook(() => useExistingUserOptions({ organization }));

test('should return user options of an organization', async () => {
  const { result } = getHookWrapper(
    fakeOrganization({
      adminUsers: [
        fakeUser({
          username: 'admin:1',
          displayName: 'Admin user',
          email: 'admin@email.com',
        }),
      ],
      financialAdminUsers: [
        fakeUser({
          username: 'financialadmin:1',
          displayName: 'Financial admin user',
          email: 'financialadmin@email.com',
        }),
      ],
      registrationAdminUsers: [
        fakeUser({
          username: 'registrationadmin:1',
          displayName: 'Registration admin user',
          email: 'registrationadmin@email.com',
        }),
      ],
      regularUsers: [
        fakeUser({
          username: 'regular:1',
          displayName: 'Regular user',
          email: 'regular@email.com',
        }),
      ],
    })
  );
  // Wait for the results
  expect(result.current).toEqual([
    {
      label: 'Admin user - admin@email.com',
      value: 'admin:1',
    },
    {
      label: 'Financial admin user - financialadmin@email.com',
      value: 'financialadmin:1',
    },
    {
      label: 'Registration admin user - registrationadmin@email.com',
      value: 'registrationadmin:1',
    },
    {
      label: 'Regular user - regular@email.com',
      value: 'regular:1',
    },
  ]);
});
