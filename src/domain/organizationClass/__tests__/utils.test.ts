import { OrganizationClassesQueryVariables } from '../../../generated/graphql';
import { organizationClassesPathBuilder } from '../utils';

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
