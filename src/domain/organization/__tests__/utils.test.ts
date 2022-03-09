import { NetworkStatus } from '@apollo/client';
import i18n from 'i18next';

import {
  fakeOrganization,
  fakeOrganizations,
  fakeUser,
} from '../../../utils/mockDataUtils';
import apolloClient from '../../app/apollo/apolloClient';
import { ORGANIZATION_ACTIONS, TEST_PUBLISHER_ID } from '../constants';
import {
  checkCanUserDoAction,
  getEditOrganizationWarning,
  getOrganizationAncestorsQueryResult,
  getOrganizationFields,
  getOrganizationFullName,
  getOrganizationInitialValues,
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

describe('checkCanUserDoAction function', () => {
  const publisher = TEST_PUBLISHER_ID;

  it('should allow correct actions if adminArganizations contains publisher', () => {
    const user = fakeUser({ adminOrganizations: [publisher] });

    const allowedActions = [
      ORGANIZATION_ACTIONS.CREATE,
      ORGANIZATION_ACTIONS.DELETE,
      ORGANIZATION_ACTIONS.EDIT,
      ORGANIZATION_ACTIONS.UPDATE,
    ];

    allowedActions.forEach((action) => {
      expect(
        checkCanUserDoAction({
          action,
          id: publisher,
          organizationAncestors: [],
          user,
        })
      ).toBe(true);
    });
  });

  it('should allow correct actions if organizationAncestores contains any of the adminArganizations', () => {
    const adminOrganization = 'admin:1';
    const user = fakeUser({ adminOrganizations: [adminOrganization] });

    const allowedActions = [
      ORGANIZATION_ACTIONS.CREATE,
      ORGANIZATION_ACTIONS.DELETE,
      ORGANIZATION_ACTIONS.EDIT,
      ORGANIZATION_ACTIONS.UPDATE,
    ];

    allowedActions.forEach((action) => {
      expect(
        checkCanUserDoAction({
          action,
          id: publisher,
          organizationAncestors: [fakeOrganization({ id: adminOrganization })],
          user,
        })
      ).toBe(true);
    });
  });

  it('should allow correct actions if publisher is not defined and user has at least one admin organization', () => {
    const adminOrganization = 'admin:1';
    const user = fakeUser({ adminOrganizations: [adminOrganization] });

    const allowedActions = [
      ORGANIZATION_ACTIONS.CREATE,
      ORGANIZATION_ACTIONS.EDIT,
    ];

    allowedActions.forEach((action) => {
      expect(
        checkCanUserDoAction({
          action,
          id: '',
          organizationAncestors: [],
          user,
        })
      ).toBe(true);
    });
  });
});

describe('getEditOrganizationWarning function', () => {
  it('should return correct warning if user is not authenticated', () => {
    const allowedActions = [ORGANIZATION_ACTIONS.EDIT];

    const commonProps = {
      authenticated: false,
      t: i18n.t.bind(i18n),
      userCanDoAction: false,
    };

    allowedActions.forEach((action) => {
      expect(getEditOrganizationWarning({ action, ...commonProps })).toBe('');
    });

    const deniedActions = [
      ORGANIZATION_ACTIONS.CREATE,
      ORGANIZATION_ACTIONS.DELETE,
      ORGANIZATION_ACTIONS.UPDATE,
    ];

    deniedActions.forEach((action) => {
      expect(getEditOrganizationWarning({ action, ...commonProps })).toBe(
        'Sinulla ei ole oikeuksia muokata organisaatioita.'
      );
    });
  });

  it('should return correct warning if user cannot do action', () => {
    expect(
      getEditOrganizationWarning({
        authenticated: true,
        t: i18n.t.bind(i18n),
        userCanDoAction: false,
        action: ORGANIZATION_ACTIONS.UPDATE,
      })
    ).toBe('Sinulla ei ole oikeuksia muokata tätä organisaatiota.');
  });
});

describe('getOrganizationFullName', () => {
  const organizationName = 'Organization name';
  it('should return correct name when organization has dissolution data', () => {
    expect(
      getOrganizationFullName(
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
      getOrganizationFullName(
        fakeOrganization({ isAffiliated: true, name: organizationName }),
        i18n.t.bind(i18n)
      )
    ).toBe(`${organizationName} (Liittyvä)`);
  });

  it('should return correct name', () => {
    expect(
      getOrganizationFullName(
        fakeOrganization({ name: organizationName }),
        i18n.t.bind(i18n)
      )
    ).toBe(organizationName);
  });
});

describe('getOrganizationFields function', () => {
  it('should return default values if value is not set', () => {
    const { atId, classification, dataSource, foundingDate, id, name } =
      getOrganizationFields(
        fakeOrganization({
          atId: null,
          classification: null,
          dataSource: null,
          foundingDate: '',
          id: null,
          name: null,
        }),
        'fi',
        i18n.t.bind(i18n)
      );

    expect(atId).toBe('');
    expect(classification).toBe('');
    expect(dataSource).toBe('');
    expect(foundingDate).toBe(null);
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

describe('getOrganizationInitialValues function', () => {
  it('should return default values if value is not set', () => {
    expect(
      getOrganizationInitialValues(
        fakeOrganization({
          affiliatedOrganizations: null,
          classification: null,
          dataSource: null,
          dissolutionDate: null,
          foundingDate: null,
          id: null,
          isAffiliated: true,
          name: null,
          parentOrganization: null,
          subOrganizations: null,
        })
      )
    ).toEqual({
      adminUsers: [],
      affiliatedOrganizations: [],
      classification: '',
      dataSource: '',
      dissolutionDate: null,
      foundingDate: null,
      id: '',
      internalType: 'affiliated',
      name: '',
      originId: '',
      parentOrganization: '',
      regularUsers: [],
      replacedBy: '',
      subOrganizations: [],
    });
  });

  it('should return correct initial values', () => {
    expect(
      getOrganizationInitialValues(
        fakeOrganization({
          affiliatedOrganizations: ['organization:affiliated'],
          classification: 'ahjo:123',
          dataSource: 'helsinki',
          dissolutionDate: '2021-01-01',
          foundingDate: '2021-01-01',
          id: 'helsinki:1',
          isAffiliated: false,
          name: 'name',
          parentOrganization: 'organization:parent',
          subOrganizations: ['organization:sub'],
        })
      )
    ).toEqual({
      adminUsers: [],
      affiliatedOrganizations: ['organization:affiliated'],
      classification: 'ahjo:123',
      dataSource: 'helsinki',
      dissolutionDate: new Date('2021-01-01'),
      foundingDate: new Date('2021-01-01'),
      id: 'helsinki:1',
      internalType: 'normal',
      name: 'name',
      originId: '1',
      parentOrganization: 'organization:parent',
      regularUsers: [],
      replacedBy: '',
      subOrganizations: ['organization:sub'],
    });
  });
});
