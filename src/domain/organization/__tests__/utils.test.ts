import { NetworkStatus } from '@apollo/client';
import i18n from 'i18next';

import {
  fakeOrganization,
  fakeOrganizations,
} from '../../../utils/mockDataUtils';
import apolloClient from '../../app/apollo/apolloClient';
import { TEST_PUBLISHER_ID } from '../constants';
import {
  getOrganizationAncestorsQueryResult,
  getOrganizationFields,
  getOrganizationName,
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

describe('getOrganizationName', () => {
  const organizationName = 'Organization name';
  it('should return correct name when organization has dissolution data', () => {
    expect(
      getOrganizationName(
        fakeOrganization({
          dissolutionDate: '2021-12-12',
          name: organizationName,
        }),
        i18n.t.bind(i18n)
      )
    ).toBe(`${organizationName} (Lakkautettu)`);
  });

  it('should return correct name when organization is affiliated', () => {
    expect(
      getOrganizationName(
        fakeOrganization({ isAffiliated: true, name: organizationName }),
        i18n.t.bind(i18n)
      )
    ).toBe(`${organizationName} (Liittyvä)`);
  });

  it('should return correct name', () => {
    expect(
      getOrganizationName(
        fakeOrganization({ name: organizationName }),
        i18n.t.bind(i18n)
      )
    ).toBe(organizationName);
  });
});

describe('getOrganizationFields function', () => {
  it('should return default values if value is not set', () => {
    const { classification, dataSource, id, name } = getOrganizationFields(
      fakeOrganization({
        classification: null,
        dataSource: null,
        id: null,
        name: null,
      }),
      'fi',
      i18n.t.bind(i18n)
    );

    expect(classification).toBe('');
    expect(dataSource).toBe('');
    expect(id).toBe('');
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
      TEST_PUBLISHER_ID,
      apolloClient
    );
    expect(organizations).toEqual(organizationsData.data);
  });

  it('should return empty array if fetching organizations fails', async () => {
    jest.spyOn(apolloClient, 'query').mockRejectedValue(new Error());
    const organizations = await getOrganizationAncestorsQueryResult(
      TEST_PUBLISHER_ID,
      apolloClient
    );
    expect(organizations).toEqual([]);
  });
});
