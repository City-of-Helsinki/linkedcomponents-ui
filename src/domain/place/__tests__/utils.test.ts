import i18n from 'i18next';

import {
  fakeOrganization,
  fakePlace,
  fakeUser,
} from '../../../utils/mockDataUtils';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import { PLACE_ACTIONS } from '../constants';
import {
  checkCanUserDoAction,
  getEditPlaceWarning,
  getPlaceFields,
  getPlaceInitialValues,
  placePathBuilder,
  placesPathBuilder,
} from '../utils';

describe('getPlaceFields function', () => {
  it('should return default values if value is not set', () => {
    const { atId, dataSource, id, nEvents, publisher } = getPlaceFields(
      fakePlace({
        atId: null,
        dataSource: null,
        id: null,
        nEvents: null,
        publisher: null,
      }),
      'fi'
    );
    expect(atId).toBe('');
    expect(dataSource).toBe('');
    expect(id).toBe('');
    expect(nEvents).toBe(0);
    expect(publisher).toBe('');
  });
});

describe('getPlaceInitialValues function', () => {
  it('should return default values if value is not set', () => {
    expect(
      getPlaceInitialValues(
        fakePlace({
          addressLocality: null,
          addressRegion: null,
          contactType: null,
          dataSource: null,
          description: null,
          email: null,
          id: null,
          infoUrl: null,
          name: null,
          postOfficeBoxNum: null,
          postalCode: null,
          publisher: null,
          streetAddress: null,
          telephone: null,
        })
      )
    ).toEqual({
      addressLocality: {
        ar: '',
        en: '',
        fi: '',
        ru: '',
        sv: '',
        zhHans: '',
      },
      addressRegion: '',
      contactType: '',
      dataSource: '',
      description: {
        ar: '',
        en: '',
        fi: '',
        ru: '',
        sv: '',
        zhHans: '',
      },
      email: '',
      id: '',
      infoUrl: {
        ar: '',
        en: '',
        fi: '',
        ru: '',
        sv: '',
        zhHans: '',
      },
      name: {
        ar: '',
        en: '',
        fi: '',
        ru: '',
        sv: '',
        zhHans: '',
      },
      originId: '',
      postOfficeBoxNum: '',
      postalCode: '',
      publisher: '',
      streetAddress: {
        ar: '',
        en: '',
        fi: '',
        ru: '',
        sv: '',
        zhHans: '',
      },
      telephone: {
        ar: '',
        en: '',
        fi: '',
        ru: '',
        sv: '',
        zhHans: '',
      },
    });
  });
});

describe('checkCanUserDoAction function', () => {
  const publisher = TEST_PUBLISHER_ID;

  it('should allow correct actions if adminArganizations contains publisher', () => {
    const user = fakeUser({ adminOrganizations: [publisher] });

    const allowedActions = [
      PLACE_ACTIONS.CREATE,
      PLACE_ACTIONS.DELETE,
      PLACE_ACTIONS.EDIT,
      PLACE_ACTIONS.UPDATE,
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
      PLACE_ACTIONS.CREATE,
      PLACE_ACTIONS.DELETE,
      PLACE_ACTIONS.EDIT,
      PLACE_ACTIONS.UPDATE,
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

    const allowedActions = [PLACE_ACTIONS.CREATE, PLACE_ACTIONS.EDIT];

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

describe('getEditPlaceWarning function', () => {
  it('should return correct warning if user is not authenticated', () => {
    const allowedActions = [PLACE_ACTIONS.EDIT];

    const commonProps = {
      authenticated: false,
      t: i18n.t.bind(i18n),
      userCanDoAction: false,
    };

    allowedActions.forEach((action) => {
      expect(getEditPlaceWarning({ action, ...commonProps })).toBe('');
    });

    const deniedActions = [
      PLACE_ACTIONS.CREATE,
      PLACE_ACTIONS.DELETE,
      PLACE_ACTIONS.UPDATE,
    ];

    deniedActions.forEach((action) => {
      expect(getEditPlaceWarning({ action, ...commonProps })).toBe(
        'Sinulla ei ole oikeuksia muokata paikkoja.'
      );
    });
  });

  it('should return correct warning if user cannot do action', () => {
    expect(
      getEditPlaceWarning({
        authenticated: true,
        t: i18n.t.bind(i18n),
        userCanDoAction: false,
        action: PLACE_ACTIONS.CREATE,
      })
    ).toBe('Sinulla ei ole oikeuksia luoda paikkoja.');

    expect(
      getEditPlaceWarning({
        authenticated: true,
        t: i18n.t.bind(i18n),
        userCanDoAction: false,
        action: PLACE_ACTIONS.UPDATE,
      })
    ).toBe('Sinulla ei ole oikeuksia muokata tätä paikkaa.');
  });
});

describe('placePathBuilder function', () => {
  it('should create correct path for place request', () => {
    const path = placePathBuilder({ args: { id: '123' } });
    expect(path).toBe('/place/123/');
  });
});

describe('placesPathBuilder function', () => {
  it('should create correct path for places request', () => {
    const items = [
      {
        args: { dataSource: 'datasource1' },
        expectedPath: '/place/?data_source=datasource1',
      },
      {
        args: { division: ['division1', 'division2'] },
        expectedPath: '/place/?division=division1,division2',
      },
      {
        args: { hasUpcomingEvents: true },
        expectedPath: '/place/?has_upcoming_events=true',
      },
      {
        args: { page: 2 },
        expectedPath: '/place/?page=2',
      },
      {
        args: { pageSize: 10 },
        expectedPath: '/place/?page_size=10',
      },
      {
        args: { showAllPlaces: true },
        expectedPath: '/place/?show_all_places=true',
      },
      {
        args: { sort: 'start' },
        expectedPath: '/place/?sort=start',
      },
      {
        args: { text: 'text' },
        expectedPath: '/place/?text=text',
      },
    ];

    items.forEach(({ args, expectedPath }) => {
      const path = placesPathBuilder({
        args,
      });
      expect(path).toBe(expectedPath);
    });
  });
});
