/* eslint-disable import/no-named-as-default-member */
import { NetworkStatus } from '@apollo/client';
import i18n from 'i18next';

import { LINKED_EVENTS_SYSTEM_DATA_SOURCE } from '../../../envVariables';
import { CreateOrganizationMutationInput } from '../../../generated/graphql';
import {
  fakeOrganization,
  fakeOrganizations,
  fakeUser,
  fakeUsers,
} from '../../../utils/mockDataUtils';
import { createApolloClient } from '../../app/apollo/apolloClient';
import { TEST_DATA_SOURCE_ID } from '../../dataSource/constants';
import {
  ORGANIZATION_ACTIONS,
  ORGANIZATION_INITIAL_VALUES,
  ORGANIZATION_INTERNAL_TYPE,
  ORGANIZATION_MERCHANT_ACTIONS,
  TEST_PUBLISHER_ID,
} from '../constants';
import {
  checkCanUserDoMerchantAction,
  checkCanUserDoOrganizationAction,
  getEditOrganizationWarning,
  getOrganizationAncestorsQueryResult,
  getOrganizationFields,
  getOrganizationFullName,
  getOrganizationInitialValues,
  getOrganizationPayload,
  omitSensitiveDataFromOrganizationPayload,
  organizationPathBuilder,
  organizationsPathBuilder,
} from '../utils';

const apolloClient = createApolloClient({ addNotification: vi.fn() });

const merchant = {
  active: true,
  businessId: 'business:1',
  city: 'Helsinki',
  email: 'test@email.com',
  id: 1,
  merchantId: 'merchant:1',
  name: 'Merchant',
  paytrailMerchantId: 'paytrail:1',
  phoneNumber: '0441234567',
  streetAddress: 'Osoite',
  termsOfServiceUrl: 'https://test.com',
  url: 'https://test2.com',
  zipcode: '00100',
};

describe('organizationPathBuilder function', () => {
  it('should create correct path for organization class request', () => {
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

describe('checkCanUserDoMerchantAction function', () => {
  const publisher = TEST_PUBLISHER_ID;

  it('should deny all actions if from event admins', () => {
    const user = fakeUser({ adminOrganizations: [publisher] });

    const deniedActions = [
      ORGANIZATION_MERCHANT_ACTIONS.MANAGE_IN_CREATE,
      ORGANIZATION_MERCHANT_ACTIONS.MANAGE_IN_UPDATE,
    ];

    deniedActions.forEach((action) => {
      expect(
        checkCanUserDoMerchantAction({
          action,
          organizationId: publisher,
          user,
        })
      ).toBe(false);
    });
  });

  it('should allow financial admin and admin to create merchant', () => {
    const user = fakeUser({
      adminOrganizations: [publisher],
      financialAdminOrganizations: [publisher],
    });

    expect(
      checkCanUserDoMerchantAction({
        action: ORGANIZATION_MERCHANT_ACTIONS.MANAGE_IN_CREATE,
        organizationId: publisher,
        user,
      })
    ).toBe(true);
  });

  it('should allow financial admin and admin to update merchant', () => {
    const user = fakeUser({
      financialAdminOrganizations: [publisher],
    });

    expect(
      checkCanUserDoMerchantAction({
        action: ORGANIZATION_MERCHANT_ACTIONS.MANAGE_IN_UPDATE,
        organizationId: publisher,
        user,
      })
    ).toBe(true);
  });

  it('should allow superuser to do any action', () => {
    const user = fakeUser({ isSuperuser: true });

    const allowedActions = Object.values(ORGANIZATION_ACTIONS);

    allowedActions.forEach((action) => {
      expect(
        checkCanUserDoOrganizationAction({
          action,
          id: '',
          user,
        })
      ).toBe(true);
    });
  });
});

describe('checkCanUserDoOrganizationAction function', () => {
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
        checkCanUserDoOrganizationAction({
          action,
          id: publisher,
          user,
        })
      ).toBe(true);
    });
  });

  it('should allow/deny correct actions if financialArganizations contains publisher', () => {
    const user = fakeUser({ financialAdminOrganizations: [publisher] });

    const deniedActions = [
      ORGANIZATION_ACTIONS.CREATE,
      ORGANIZATION_ACTIONS.DELETE,
      ORGANIZATION_ACTIONS.UPDATE,
    ];

    deniedActions.forEach((action) => {
      expect(
        checkCanUserDoOrganizationAction({
          action,
          id: publisher,
          user,
        })
      ).toBe(false);
    });

    const allowedActions = [ORGANIZATION_ACTIONS.EDIT];

    allowedActions.forEach((action) => {
      expect(
        checkCanUserDoOrganizationAction({
          action,
          id: publisher,
          user,
        })
      ).toBe(true);
    });
  });

  it('should allow superuser to do any action', () => {
    const user = fakeUser({ isSuperuser: true });

    const allowedActions = Object.values(ORGANIZATION_ACTIONS);

    allowedActions.forEach((action) => {
      expect(
        checkCanUserDoOrganizationAction({
          action,
          id: '',
          user,
        })
      ).toBe(true);
    });
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
      checkCanUserDoOrganizationAction({
        action,
        id: '',
        user,
      })
    ).toBe(true);
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          atId: null as any,
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
    vi.spyOn(apolloClient, 'query').mockResolvedValue({
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
    vi.spyOn(apolloClient, 'query').mockRejectedValue(new Error());
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
          adminUsers: null,
          affiliatedOrganizations: null,
          classification: null,
          dataSource: null,
          dissolutionDate: null,
          financialAdminUsers: null,
          foundingDate: null,
          id: null,
          isAffiliated: true,
          name: null,
          parentOrganization: null,
          registrationAdminUsers: null,
          regularUsers: null,
          subOrganizations: null,
          webStoreMerchants: null,
        })
      )
    ).toEqual({
      adminUsers: [],
      affiliatedOrganizations: [],
      classification: '',
      dataSource: '',
      dissolutionDate: null,
      financialAdminUsers: [],
      foundingDate: null,
      id: '',
      internalType: 'affiliated',
      name: '',
      originId: '',
      parentOrganization: '',
      registrationAdminUsers: [],
      regularUsers: [],
      replacedBy: '',
      subOrganizations: [],
      webStoreMerchants: [],
    });
  });

  it('should return correct initial values', () => {
    expect(
      getOrganizationInitialValues(
        fakeOrganization({
          adminUsers: fakeUsers(1, [{ username: 'admin:1' }]).data,
          affiliatedOrganizations: ['organization:affiliated'],
          classification: 'ahjo:123',
          dataSource: 'helsinki',
          dissolutionDate: '2021-01-01',
          financialAdminUsers: fakeUsers(1, [{ username: 'financialAdmin:1' }])
            .data,
          foundingDate: '2021-01-01',
          id: 'helsinki:1',
          isAffiliated: false,
          name: 'name',
          parentOrganization: 'organization:parent',
          registrationAdminUsers: fakeUsers(1, [
            { username: 'registrationAdmin:1' },
          ]).data,
          regularUsers: fakeUsers(1, [{ username: 'regular:1' }]).data,
          subOrganizations: ['organization:sub'],
          webStoreMerchants: [merchant],
        })
      )
    ).toEqual({
      adminUsers: ['admin:1'],
      affiliatedOrganizations: ['organization:affiliated'],
      classification: 'ahjo:123',
      dataSource: 'helsinki',
      dissolutionDate: new Date('2021-01-01'),
      financialAdminUsers: ['financialAdmin:1'],
      foundingDate: new Date('2021-01-01'),
      id: 'helsinki:1',
      internalType: 'normal',
      name: 'name',
      originId: '1',
      parentOrganization: 'organization:parent',
      registrationAdminUsers: ['registrationAdmin:1'],
      regularUsers: ['regular:1'],
      replacedBy: '',
      subOrganizations: ['organization:sub'],
      webStoreMerchants: [merchant],
    });
  });
});

describe('getOrganizationPayload function', () => {
  it('should return organization payload', () => {
    expect(
      getOrganizationPayload(
        ORGANIZATION_INITIAL_VALUES,
        fakeUser({ isSuperuser: true })
      )
    ).toEqual({
      adminUsers: [],
      affiliatedOrganizations: [],
      classification: '',
      dataSource: LINKED_EVENTS_SYSTEM_DATA_SOURCE,
      dissolutionDate: null,
      financialAdminUsers: [],
      foundingDate: null,
      id: undefined,
      internalType: ORGANIZATION_INTERNAL_TYPE.NORMAL,
      name: '',
      originId: '',
      parentOrganization: undefined,
      registrationAdminUsers: [],
      regularUsers: [],
      replacedBy: '',
      subOrganizations: [],
      webStoreMerchants: [],
    });

    expect(
      getOrganizationPayload(
        {
          adminUsers: ['admin:1'],
          affiliatedOrganizations: ['organization:affiliated'],
          classification: 'ahjo:1',
          dataSource: 'helsinki',
          dissolutionDate: new Date('2021-12-12'),
          financialAdminUsers: ['financialAdmin:1'],
          foundingDate: new Date('2021-12-12'),
          id: '',
          internalType: 'normal',
          name: 'name',
          originId: '123',
          parentOrganization: 'organization:parent',
          registrationAdminUsers: ['registrationAdmin:1'],
          regularUsers: ['regular:1'],
          replacedBy: 'organization:replaced',
          subOrganizations: ['organization:sub'],
          webStoreMerchants: [merchant, { ...merchant, id: null }],
        },
        fakeUser({ isSuperuser: true })
      )
    ).toEqual({
      adminUsers: ['admin:1'],
      affiliatedOrganizations: ['organization:affiliated'],
      classification: 'ahjo:1',
      dataSource: 'helsinki',
      dissolutionDate: '2021-12-12',
      financialAdminUsers: ['financialAdmin:1'],
      foundingDate: '2021-12-12',
      id: 'helsinki:123',
      internalType: 'normal',
      name: 'name',
      originId: '123',
      parentOrganization: 'organization:parent',
      registrationAdminUsers: ['registrationAdmin:1'],
      regularUsers: ['regular:1'],
      replacedBy: 'organization:replaced',
      subOrganizations: ['organization:sub'],
      webStoreMerchants: [merchant, { ...merchant, id: undefined }],
    });
  });
});

describe('omitSensitiveDataFromOrganizationPayload', () => {
  it('should omit sensitive data from payload', () => {
    const payload: CreateOrganizationMutationInput = {
      adminUsers: ['admin'],
      affiliatedOrganizations: ['affiliatedOrganization'],
      classification: 'classification',
      dataSource: TEST_DATA_SOURCE_ID,
      dissolutionDate: '2021-10-10',
      foundingDate: '2011-10-10',
      id: TEST_PUBLISHER_ID,
      internalType: 'internalType',
      name: 'name',
      originId: `${TEST_DATA_SOURCE_ID}:${TEST_PUBLISHER_ID}`,
      parentOrganization: 'parent',
      registrationAdminUsers: ['registrationAdmin'],
      regularUsers: ['regularUser'],
      replacedBy: 'replacedBy',
      subOrganizations: ['subOrganization'],
    };

    const filteredPayload = omitSensitiveDataFromOrganizationPayload(
      payload
    ) as CreateOrganizationMutationInput;
    expect(filteredPayload).toEqual({
      affiliatedOrganizations: ['affiliatedOrganization'],
      classification: 'classification',
      dataSource: TEST_DATA_SOURCE_ID,
      dissolutionDate: '2021-10-10',
      foundingDate: '2011-10-10',
      id: TEST_PUBLISHER_ID,
      internalType: 'internalType',
      name: 'name',
      originId: `${TEST_DATA_SOURCE_ID}:${TEST_PUBLISHER_ID}`,
      parentOrganization: 'parent',
      replacedBy: 'replacedBy',
      subOrganizations: ['subOrganization'],
    });
    expect(filteredPayload.adminUsers).toBeUndefined();
    expect(filteredPayload.registrationAdminUsers).toBeUndefined();
    expect(filteredPayload.regularUsers).toBeUndefined();
  });
});
