import { fakeOrganization } from '../../../utils/mockDataUtils';
import {
  getOrganizationFields,
  organizationPathBuilder,
  organizationsPathBuilder,
} from '../utils';

describe('organizationPathBuilder function', () => {
  it('should create correct path for organization request', () => {
    expect(organizationPathBuilder({ args: { id: '123' } })).toBe(
      '/organization/123/'
    );
  });
});

describe('organizationsPathBuilder function', () => {
  it('should create correct path for organizations request', () => {
    expect(organizationsPathBuilder({ args: { child: '123' } })).toBe(
      '/organization/?child=123'
    );
  });
});

describe('fakeOrganization function', () => {
  it('should return default values if value is not set', () => {
    const { name } = getOrganizationFields(fakeOrganization({ name: null }));

    expect(name).toBe('');
  });
});
