import { User, UserProfile } from 'oidc-client-ts';

import getUserDisplayName from '../getUserDisplayName';
import { fakeOidcUserProfileState, fakeOidcUserState } from '../mockLoginHooks';

describe('getUserDisplayName function', () => {
  const defaultNames = {
    name: 'Name',
    given_name: 'given_name',
    family_name: 'family_name',
  };

  const getAuthUserForTest = (profileOverrides: Partial<UserProfile>) =>
    fakeOidcUserState({ profile: fakeOidcUserProfileState(profileOverrides) });

  const cases: [authenticated: boolean, authUser: User | null, string][] = [
    [false, null, ''],
    [true, null, ''],
    [false, getAuthUserForTest(defaultNames), ''],
    [true, getAuthUserForTest(defaultNames), 'Name'],
    [
      true,
      getAuthUserForTest({
        ...defaultNames,
        name: '',
        family_name: '',
      }),
      'given_name',
    ],
    [
      true,
      getAuthUserForTest({
        ...defaultNames,
        name: '',
        given_name: '',
      }),
      'family_name',
    ],
    [
      true,
      getAuthUserForTest({ ...defaultNames, name: '' }),
      'given_name family_name',
    ],
    [
      true,
      getAuthUserForTest({
        name: '',
        given_name: '',
        family_name: '',
      }),
      '',
    ],
  ];

  it.each(cases)(
    'should return correct display name, %o params, returns "%s"',
    (authenticated, authUser, expectedResult) => {
      expect(getUserDisplayName({ authenticated, authUser })).toBe(
        expectedResult
      );
    }
  );
});
