import i18n from 'i18next';

import {
  fakeKeyword,
  fakeOrganization,
  fakeUser,
} from '../../../utils/mockDataUtils';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import {
  KEYWORD_ACTIONS,
  KEYWORD_INITIAL_VALUES,
  TEST_KEYWORD_ID,
} from '../constants';
import {
  checkCanUserDoAction,
  getEditKeywordWarning,
  getKeywordFields,
  getKeywordInitialValues,
  getKeywordPayload,
  keywordPathBuilder,
  keywordsPathBuilder,
} from '../utils';

describe('keywordSetPathBuilder function', () => {
  it('should build correct path', () => {
    expect(
      keywordPathBuilder({
        args: { id: 'hel:123' },
      })
    ).toBe('/keyword/hel:123/');
  });
});

describe('keywordSetsPathBuilder function', () => {
  it('should build correct path', () => {
    const items = [
      {
        args: { dataSource: 'source' },
        expectedPath: '/keyword/?data_source=source',
      },
      {
        args: { freeText: 'text' },
        expectedPath: '/keyword/?free_text=text',
      },
      {
        args: { hasUpcomingEvents: true },
        expectedPath: '/keyword/?has_upcoming_events=true',
      },
      {
        args: { page: 2 },
        expectedPath: '/keyword/?page=2',
      },
      {
        args: { pageSize: 10 },
        expectedPath: '/keyword/?page_size=10',
      },
      {
        args: { showAllKeywords: true },
        expectedPath: '/keyword/?show_all_keywords=true',
      },
      {
        args: { sort: 'name' },
        expectedPath: '/keyword/?sort=name',
      },
      {
        args: { text: 'text' },
        expectedPath: '/keyword/?text=text',
      },
    ];

    items.forEach(({ args, expectedPath }) => {
      const path = keywordsPathBuilder({
        args,
      });
      expect(path).toBe(expectedPath);
    });
  });
});

describe('getKeywordFields function', () => {
  it('should return default values if value is not set', () => {
    const { atId, id, name, nEvents, publisher } = getKeywordFields(
      fakeKeyword({
        atId: null,
        id: null,
        name: null,
        nEvents: null,
        publisher: null,
      }),
      'fi'
    );

    expect(atId).toBe('');
    expect(id).toBe('');
    expect(name).toBe('');
    expect(nEvents).toBe(0);
    expect(publisher).toBe('');
  });
});

describe('getKeywordInitialValues function', () => {
  it('should return default values if value is not set', () => {
    expect(
      getKeywordInitialValues(
        fakeKeyword({
          dataSource: null,
          deprecated: false,
          id: null,
          name: null,
          publisher: null,
          replacedBy: null,
        })
      )
    ).toEqual({
      dataSource: '',
      deprecated: false,
      id: '',
      name: {
        ar: '',
        en: '',
        fi: '',
        ru: '',
        sv: '',
        zhHans: '',
      },
      originId: '',
      publisher: '',
      replacedBy: '',
    });
  });

  it('should return correct initial values', () => {
    expect(
      getKeywordInitialValues(
        fakeKeyword({
          dataSource: 'helsinki',
          deprecated: true,
          id: TEST_KEYWORD_ID,
          name: {
            ar: 'Keyword (ar)',
            en: 'Keyword (en)',
            fi: 'Keyword (fi)',
            ru: 'Keyword (ru)',
            sv: 'Keyword (sv)',
            zhHans: 'Keyword (zhHans)',
          },
          publisher: TEST_PUBLISHER_ID,
          replacedBy: 'keyword:2',
        })
      )
    ).toEqual({
      dataSource: 'helsinki',
      deprecated: true,
      id: 'keyword:1',
      name: {
        ar: 'Keyword (ar)',
        en: 'Keyword (en)',
        fi: 'Keyword (fi)',
        ru: 'Keyword (ru)',
        sv: 'Keyword (sv)',
        zhHans: 'Keyword (zhHans)',
      },
      originId: '1',
      publisher: 'publisher:1',
      replacedBy: 'keyword:2',
    });
  });
});

describe('getKeywordPayload function', () => {
  it('should return keyword payload', () => {
    expect(getKeywordPayload(KEYWORD_INITIAL_VALUES)).toEqual({
      dataSource: 'helsinki',
      deprecated: false,
      id: undefined,
      name: {
        ar: '',
        en: '',
        fi: '',
        ru: '',
        sv: '',
        zhHans: '',
      },
      publisher: '',
      replacedBy: '',
    });

    expect(
      getKeywordPayload({
        dataSource: 'helsinki',
        deprecated: true,
        id: '',
        name: {
          ar: 'ar',
          en: 'en',
          fi: 'fi',
          ru: 'ru',
          sv: 'sv',
          zhHans: 'zhHans',
        },
        originId: '123',
        publisher: TEST_PUBLISHER_ID,
        replacedBy: 'keyword:1',
      })
    ).toEqual({
      dataSource: 'helsinki',
      deprecated: true,
      id: 'helsinki:123',
      name: {
        ar: 'ar',
        en: 'en',
        fi: 'fi',
        ru: 'ru',
        sv: 'sv',
        zhHans: 'zhHans',
      },
      publisher: TEST_PUBLISHER_ID,
      replacedBy: 'keyword:1',
    });
  });
});

describe('checkCanUserDoAction function', () => {
  const publisher = TEST_PUBLISHER_ID;

  it('should allow correct actions if adminArganizations contains publisher', () => {
    const user = fakeUser({ adminOrganizations: [publisher] });

    const allowedActions = [
      KEYWORD_ACTIONS.CREATE,
      KEYWORD_ACTIONS.DELETE,
      KEYWORD_ACTIONS.EDIT,
      KEYWORD_ACTIONS.UPDATE,
    ];

    allowedActions.forEach((action) => {
      expect(
        checkCanUserDoAction({
          action,
          organizationAncestors: [],
          publisher,
          user,
        })
      ).toBe(true);
    });
  });

  it('should allow correct actions if organizationAncestores contains any of the adminArganizations', () => {
    const adminOrganization = 'admin:1';
    const user = fakeUser({ adminOrganizations: [adminOrganization] });

    const allowedActions = [
      KEYWORD_ACTIONS.CREATE,
      KEYWORD_ACTIONS.DELETE,
      KEYWORD_ACTIONS.EDIT,
      KEYWORD_ACTIONS.UPDATE,
    ];

    allowedActions.forEach((action) => {
      expect(
        checkCanUserDoAction({
          action,
          organizationAncestors: [fakeOrganization({ id: adminOrganization })],
          publisher,
          user,
        })
      ).toBe(true);
    });
  });

  it('should allow correct actions if publisher is not defined and user has at least one admin organization', () => {
    const adminOrganization = 'admin:1';
    const user = fakeUser({ adminOrganizations: [adminOrganization] });

    const allowedActions = [KEYWORD_ACTIONS.CREATE, KEYWORD_ACTIONS.EDIT];

    allowedActions.forEach((action) => {
      expect(
        checkCanUserDoAction({
          action,
          organizationAncestors: [],
          publisher: '',
          user,
        })
      ).toBe(true);
    });
  });
});

describe('getEditKeywordWarning function', () => {
  it('should return correct warning if user is not authenticated', () => {
    const allowedActions = [KEYWORD_ACTIONS.EDIT];

    const commonProps = {
      authenticated: false,
      t: i18n.t.bind(i18n),
      userCanDoAction: false,
    };

    allowedActions.forEach((action) => {
      expect(getEditKeywordWarning({ action, ...commonProps })).toBe('');
    });

    const deniedActions = [
      KEYWORD_ACTIONS.CREATE,
      KEYWORD_ACTIONS.DELETE,
      KEYWORD_ACTIONS.UPDATE,
    ];

    deniedActions.forEach((action) => {
      expect(getEditKeywordWarning({ action, ...commonProps })).toBe(
        'Sinulla ei ole oikeuksia muokata avainsanoja.'
      );
    });
  });

  it('should return correct warning if user cannot do action', () => {
    expect(
      getEditKeywordWarning({
        authenticated: true,
        t: i18n.t.bind(i18n),
        userCanDoAction: false,
        action: KEYWORD_ACTIONS.CREATE,
      })
    ).toBe('Sinulla ei ole oikeuksia luoda avainsanoja.');

    expect(
      getEditKeywordWarning({
        authenticated: true,
        t: i18n.t.bind(i18n),
        userCanDoAction: false,
        action: KEYWORD_ACTIONS.UPDATE,
      })
    ).toBe('Sinulla ei ole oikeuksia muokata tätä avainsanaa.');
  });
});
