import { fakeUser } from '../../../utils/mockDataUtils';
import { getUserFields, userPathBuilder, usersPathBuilder } from '../utils';

describe('userPathBuilder function', () => {
  it('should create correct path for user request', () => {
    expect(userPathBuilder({ args: { id: '123' } })).toBe('/user/123/');
  });
});

describe('usersPathBuilder function', () => {
  it('should create correct path for users request', () => {
    expect(usersPathBuilder({ args: { page: 2 } })).toBe('/user/?page=2');
    expect(usersPathBuilder({ args: { pageSize: 2 } })).toBe(
      '/user/?page_size=2'
    );
  });
});

describe('getUserFields function', () => {
  it('should return default values if value is not set', () => {
    const { displayName, email, isStaff, username } = getUserFields(
      fakeUser({
        displayName: null,
        email: null,
        isStaff: null,
        username: null,
      })
    );

    expect(displayName).toBe('');
    expect(email).toBe('');
    expect(isStaff).toBe(false);
    expect(username).toBe('');
  });
});
