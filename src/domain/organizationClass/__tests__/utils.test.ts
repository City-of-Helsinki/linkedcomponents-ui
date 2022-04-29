import { OrganizationClassesQueryVariables } from '../../../generated/graphql';
import { fakeOrganizationClass } from '../../../utils/mockDataUtils';
import {
  getOrganizationClassFields,
  organizationClassesPathBuilder,
  organizationClassPathBuilder,
} from '../utils';

describe('organizationClassPathBuilder function', () => {
  it('should create correct path for organization request', () => {
    expect(organizationClassPathBuilder({ args: { id: '123' } })).toBe(
      '/organization_class/123/'
    );
  });
});

describe('organizationClassesPathBuilder function', () => {
  const cases: [OrganizationClassesQueryVariables, string][] = [
    [{ page: 2 }, '/organization_class/?page=2'],
    [{ pageSize: 2 }, '/organization_class/?page_size=2'],
  ];

  it.each(cases)('should build correct path', (variables, expectedPath) =>
    expect(organizationClassesPathBuilder({ args: variables })).toBe(
      expectedPath
    )
  );
});

describe('getOrganizationClassFields function', () => {
  it('should return default values if value is not set', () => {
    const { id, name } = getOrganizationClassFields(
      fakeOrganizationClass({
        id: null,
        name: null,
      })
    );

    expect(id).toBe('');
    expect(name).toBe('');
  });
});
