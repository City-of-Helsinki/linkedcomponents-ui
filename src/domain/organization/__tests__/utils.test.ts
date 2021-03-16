import { NetworkStatus } from '@apollo/client';

import {
  fakeOrganization,
  fakeOrganizations,
} from '../../../utils/mockDataUtils';
import apolloClient from '../../app/apollo/apolloClient';
import {
  getOrganizationAncestorsQueryResult,
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

describe('getOrganizationAncestorsQueryResult function', () => {
  it('should return empty array if publisher is empty', async () => {
    const organizations = await getOrganizationAncestorsQueryResult(
      '',
      apolloClient
    );
    expect(organizations).toEqual([]);
  });

  it('should return organization ancestors', async () => {
    const organizationsData = fakeOrganizations(2);
    jest.spyOn(apolloClient, 'query').mockResolvedValue({
      data: { organizations: organizationsData },
      loading: false,
      networkStatus: NetworkStatus.ready,
    });
    const organizations = await getOrganizationAncestorsQueryResult(
      'publisher:1',
      apolloClient
    );
    expect(organizations).toEqual(organizationsData.data);
  });

  it('should return empty array if fetching organizations fails', async () => {
    jest.spyOn(apolloClient, 'query').mockRejectedValue(new Error());
    const organizations = await getOrganizationAncestorsQueryResult(
      'publisher:1',
      apolloClient
    );
    expect(organizations).toEqual([]);
  });
});
