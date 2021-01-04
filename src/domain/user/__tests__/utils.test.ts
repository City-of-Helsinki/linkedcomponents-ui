import { fakeUser } from '../../../utils/mockDataUtils';
import { getUserFields, userPathBuilder } from '../utils';

describe('userPathBuilder function', () => {
  it('should create correct path for user request', () => {
    expect(userPathBuilder({ args: { id: '123' } })).toBe('/user/123/');
  });
});

describe('getUserFields function', () => {
  it('should return default values if value is not set', () => {
    const { isStaff } = getUserFields(fakeUser({ isStaff: null }));

    expect(isStaff).toBe(false);
  });
});
