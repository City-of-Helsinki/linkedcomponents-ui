/* eslint-disable max-len */
/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';

import { LINKED_EVENTS_SYSTEM_DATA_SOURCE } from '../../../envVariables';
import {
  OrganizationFieldsFragment,
  UserFieldsFragment,
} from '../../../generated/graphql';
import {
  fakeKeyword,
  fakeKeywordSet,
  fakeOrganization,
  fakeUser,
} from '../../../utils/mockDataUtils';
import { TEST_KEYWORD_ID } from '../../keyword/constants';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import { KEYWORD_SET_ACTIONS, KEYWORD_SET_INITIAL_VALUES } from '../constants';
import {
  checkCanUserDoAction,
  getEditKeywordSetWarning,
  getKeywordOption,
  getKeywordSetFields,
  getKeywordSetInitialValues,
  getKeywordSetPayload,
  keywordSetPathBuilder,
  keywordSetsPathBuilder,
} from '../utils';

describe('getKeywordOption function', () => {
  it('should return correct option', () => {
    const keyword = fakeKeyword({
      id: 'keyword:1',
      name: { fi: 'Keyword name' },
    });
    expect(
      getKeywordOption({
        keyword,
        locale: 'fi',
      })
    ).toEqual({
      label: 'Keyword name',
      value: keyword.atId,
    });
  });

  it('should return empty option if keyword is null', () => {
    expect(getKeywordOption({ keyword: null, locale: 'fi' })).toEqual({
      label: '',
      value: '',
    });
  });
});

describe('keywordSetPathBuilder function', () => {
  it('should build correct path', () => {
    expect(
      keywordSetPathBuilder({
        args: { id: 'hel:123', include: ['include1', 'include2'] },
      })
    ).toBe('/keyword_set/hel:123/?include=include1,include2');
  });
});

describe('keywordSetsPathBuilder function', () => {
  it('should build correct path', () => {
    expect(
      keywordSetsPathBuilder({
        args: { include: ['include1', 'include2'] },
      })
    ).toBe('/keyword_set/?include=include1,include2');
  });
});

describe('getKeywordSetFields function', () => {
  it('should return default values if value is not set', () => {
    const { dataSource, id, organization, usage } = getKeywordSetFields(
      fakeKeywordSet({
        dataSource: null,
        id: null,
        organization: null,
        usage: null,
      }),
      'fi'
    );

    expect(dataSource).toBe('');
    expect(id).toBe('');
    expect(organization).toBe('');
    expect(usage).toBe('');
  });
});

describe('checkCanUserDoAction function', () => {
  const allowedActions = [KEYWORD_SET_ACTIONS.EDIT];
  const deniedActions = [
    KEYWORD_SET_ACTIONS.CREATE,
    KEYWORD_SET_ACTIONS.DELETE,
    KEYWORD_SET_ACTIONS.UPDATE,
  ];

  const shouldAllowOnlyEditAction = ({
    organization = TEST_KEYWORD_ID,
    organizationAncestors = [],
    user,
  }: {
    organization?: string;
    organizationAncestors?: OrganizationFieldsFragment[];
    user: UserFieldsFragment;
  }) => {
    allowedActions.forEach((action) => {
      expect(
        checkCanUserDoAction({
          action,
          organizationAncestors,
          organization,
          user,
        })
      ).toBe(true);
    });

    deniedActions.forEach((action) => {
      expect(
        checkCanUserDoAction({
          action,
          organizationAncestors,
          organization,
          user,
        })
      ).toBe(false);
    });
  };

  it('should allow only edit action if adminArganizations contains publisher', () => {
    const user = fakeUser({ adminOrganizations: [TEST_PUBLISHER_ID] });

    shouldAllowOnlyEditAction({ user });
  });

  it('should allow only edit action if organizationAncestors contains any of the adminArganizations', () => {
    const adminOrganization = 'admin:1';
    const user = fakeUser({ adminOrganizations: [adminOrganization] });

    shouldAllowOnlyEditAction({
      organizationAncestors: [fakeOrganization({ id: adminOrganization })],
      user,
    });
  });

  it('should allow only edit action if organization is not defined and user has at least one admin organization', () => {
    const adminOrganization = 'admin:1';
    const user = fakeUser({ adminOrganizations: [adminOrganization] });

    shouldAllowOnlyEditAction({
      organization: '',
      user,
    });
  });

  it('should allow only edit action for superuser', () => {
    const user = fakeUser({ isSuperuser: true });

    shouldAllowOnlyEditAction({
      user,
    });
  });
});

describe('getEditKeywordSetWarning function', () => {
  it('should return correct warning if user is not authenticated', () => {
    const allowedActions = [KEYWORD_SET_ACTIONS.EDIT];

    const commonProps = {
      authenticated: false,
      t: i18n.t.bind(i18n),
      userCanDoAction: false,
    };

    allowedActions.forEach((action) => {
      expect(getEditKeywordSetWarning({ action, ...commonProps })).toBe('');
    });

    const deniedActions = [
      KEYWORD_SET_ACTIONS.CREATE,
      KEYWORD_SET_ACTIONS.DELETE,
      KEYWORD_SET_ACTIONS.UPDATE,
    ];

    deniedActions.forEach((action) => {
      expect(getEditKeywordSetWarning({ action, ...commonProps })).toBe(
        'Avainsanaryhmiä ei voi muokata palvelun kautta.'
      );
    });
  });

  it('should return correct warning if user cannot do action', () => {
    expect(
      getEditKeywordSetWarning({
        authenticated: true,
        t: i18n.t.bind(i18n),
        userCanDoAction: false,
        action: KEYWORD_SET_ACTIONS.CREATE,
      })
    ).toBe('Avainsanaryhmiä ei voi muokata palvelun kautta.');

    expect(
      getEditKeywordSetWarning({
        authenticated: true,
        t: i18n.t.bind(i18n),
        userCanDoAction: false,
        action: KEYWORD_SET_ACTIONS.UPDATE,
      })
    ).toBe('Avainsanaryhmiä ei voi muokata palvelun kautta.');
  });
});

describe('getKeywordInitialValues function', () => {
  it('should return default values if value is not set', () => {
    expect(
      getKeywordSetInitialValues(
        fakeKeywordSet({
          dataSource: null,
          id: null,
          keywords: null,
          name: null,
          organization: null,
          usage: null,
        })
      )
    ).toEqual({
      dataSource: '',
      id: '',
      keywords: [],
      name: {
        ar: '',
        en: '',
        fi: '',
        ru: '',
        sv: '',
        zhHans: '',
      },
      originId: '',
      organization: '',
      usage: '',
    });
  });

  it('should return correct initial values', () => {
    expect(
      getKeywordSetInitialValues(
        fakeKeywordSet({
          dataSource: 'helsinki',
          id: TEST_KEYWORD_ID,
          keywords: [{ atId: TEST_KEYWORD_ID }],
          name: {
            ar: 'Keyword (ar)',
            en: 'Keyword (en)',
            fi: 'Keyword (fi)',
            ru: 'Keyword (ru)',
            sv: 'Keyword (sv)',
            zhHans: 'Keyword (zhHans)',
          },
          organization: TEST_PUBLISHER_ID,
          usage: 'any',
        })
      )
    ).toEqual({
      dataSource: 'helsinki',
      id: 'keyword:1',
      keywords: [TEST_KEYWORD_ID],
      name: {
        ar: 'Keyword (ar)',
        en: 'Keyword (en)',
        fi: 'Keyword (fi)',
        ru: 'Keyword (ru)',
        sv: 'Keyword (sv)',
        zhHans: 'Keyword (zhHans)',
      },
      originId: '1',
      organization: 'publisher:1',
      usage: 'any',
    });
  });
});

describe('getKeywordSetPayload function', () => {
  it('should return keyword set payload', () => {
    expect(getKeywordSetPayload(KEYWORD_SET_INITIAL_VALUES)).toEqual({
      dataSource: LINKED_EVENTS_SYSTEM_DATA_SOURCE,
      id: undefined,
      keywords: [],
      name: {
        ar: '',
        en: '',
        fi: '',
        ru: '',
        sv: '',
        zhHans: '',
      },
      organization: '',
      usage: '',
    });

    expect(
      getKeywordSetPayload({
        dataSource: 'helsinki',
        id: '',
        keywords: [TEST_KEYWORD_ID],
        name: {
          ar: 'ar',
          en: 'en',
          fi: 'fi',
          ru: 'ru',
          sv: 'sv',
          zhHans: 'zhHans',
        },
        originId: '123',
        organization: TEST_PUBLISHER_ID,
        usage: 'any',
      })
    ).toEqual({
      dataSource: 'helsinki',
      id: 'helsinki:123',
      keywords: [{ atId: 'keyword:1' }],
      name: {
        ar: 'ar',
        en: 'en',
        fi: 'fi',
        ru: 'ru',
        sv: 'sv',
        zhHans: 'zhHans',
      },
      organization: 'publisher:1',
      usage: 'any',
    });
  });
});
