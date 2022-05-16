import { EMPTY_MULTI_LANGUAGE_OBJECT } from '../../../constants';
import { ImageFieldsFragment } from '../../../generated/graphql';
import {
  fakeImage,
  fakeOrganization,
  fakeUser,
} from '../../../utils/mockDataUtils';
import i18 from '../../app/i18n/i18nInit';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import { DEFAULT_LICENSE_TYPE, IMAGE_ACTIONS } from '../constants';
import {
  checkCanUserDoAction,
  getImageActionWarning,
  getImageFields,
  getImageInitialValues,
  imagePathBuilder,
  imagesPathBuilder,
} from '../utils';

describe('imagePathBuilder function', () => {
  it('should build correct path', () => {
    expect(
      imagePathBuilder({
        args: { id: 'hel:123' },
      })
    ).toBe('/image/hel:123/');
  });
});

describe('imagesPathBuilder function', () => {
  it('should build correct path', () => {
    expect(
      imagesPathBuilder({
        args: { dataSource: 'data-source' },
      })
    ).toBe('/image/?data_source=data-source');

    expect(
      imagesPathBuilder({
        args: { page: 3 },
      })
    ).toBe('/image/?page=3');

    expect(
      imagesPathBuilder({
        args: { pageSize: 3 },
      })
    ).toBe('/image/?page_size=3');

    expect(
      imagesPathBuilder({
        args: { publisher: 'hel:123' },
      })
    ).toBe('/image/?publisher=hel:123');

    expect(
      imagesPathBuilder({
        args: { sort: 'name' },
      })
    ).toBe('/image/?sort=name');

    expect(
      imagesPathBuilder({
        args: { text: 'test' },
      })
    ).toBe('/image/?text=test');
  });
});

describe('getImageFields function', () => {
  it('should return default values if field value is not defined', () => {
    const image = fakeImage({
      altText: null,
      id: null,
      license: null,
      name: null,
      photographerName: null,
      publisher: null,
      url: null,
    }) as ImageFieldsFragment;
    const { altText, id, license, name, photographerName, publisher, url } =
      getImageFields(image, 'fi');

    expect(altText).toEqual(EMPTY_MULTI_LANGUAGE_OBJECT);
    expect(id).toBe('');
    expect(license).toBe(DEFAULT_LICENSE_TYPE);
    expect(name).toBe('');
    expect(photographerName).toBe('');
    expect(publisher).toBe('');
    expect(url).toBe('');
  });

  it('should return correct last modified time', () => {
    const image = fakeImage({
      lastModifiedTime: '2021-12-12',
    }) as ImageFieldsFragment;
    const { lastModifiedTime } = getImageFields(image, 'fi');

    expect(lastModifiedTime).toEqual(new Date('2021-12-12'));
  });
});

describe('getImageInitialValues function', () => {
  it('should return default values if value is not set', () => {
    expect(
      getImageInitialValues(
        fakeImage({
          altText: null,
          id: null,
          license: null,
          name: null,
          photographerName: null,
          publisher: null,
          url: null,
        })
      )
    ).toEqual({
      altText: EMPTY_MULTI_LANGUAGE_OBJECT,
      id: '',
      license: '',
      name: '',
      photographerName: '',
      publisher: '',
      url: '',
    });
  });
});

describe('checkCanUserDoAction function', () => {
  const publisher = TEST_PUBLISHER_ID;

  it('should allow correct actions if adminArganizations contains publisher', () => {
    const user = fakeUser({ adminOrganizations: [publisher] });

    const allowedActions = [
      IMAGE_ACTIONS.CREATE,
      IMAGE_ACTIONS.DELETE,
      IMAGE_ACTIONS.EDIT,
      IMAGE_ACTIONS.UPDATE,
      IMAGE_ACTIONS.UPLOAD,
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
      IMAGE_ACTIONS.CREATE,
      IMAGE_ACTIONS.DELETE,
      IMAGE_ACTIONS.EDIT,
      IMAGE_ACTIONS.UPDATE,
      IMAGE_ACTIONS.UPLOAD,
    ];

    allowedActions.forEach((action) => {
      expect(
        checkCanUserDoAction({
          action,
          organizationAncestors: [fakeOrganization({ id: adminOrganization })],
          publisher: publisher,
          user,
        })
      ).toBe(true);
    });
  });

  it('should allow correct actions if organizationMembers contains publisher', () => {
    const user = fakeUser({ organizationMemberships: [publisher] });

    const allowedActions = [
      IMAGE_ACTIONS.CREATE,
      IMAGE_ACTIONS.DELETE,
      IMAGE_ACTIONS.EDIT,
      IMAGE_ACTIONS.UPDATE,
      IMAGE_ACTIONS.UPLOAD,
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
});

describe('getImageActionWarning function', () => {
  const publisher = TEST_PUBLISHER_ID;

  it('should return correct warning if user is not authenticates', () => {
    const actions = [
      {
        action: IMAGE_ACTIONS.CREATE,
        warning: 'Kirjaudu sisään lisätäksesi kuvia.',
      },
      {
        action: IMAGE_ACTIONS.DELETE,
        warning: 'Sinulla ei ole oikeuksia muokata kuvia.',
      },
      {
        action: IMAGE_ACTIONS.EDIT,
        warning: '',
      },
      {
        action: IMAGE_ACTIONS.UPDATE,
        warning: 'Kirjaudu sisään muokataksesi kuvaa.',
      },
      {
        action: IMAGE_ACTIONS.UPLOAD,
        warning: 'Kirjaudu sisään lisätäksesi kuvia.',
      },
    ];
    actions.forEach(({ action, warning }) => {
      expect(
        getImageActionWarning({
          action,
          authenticated: false,
          publisher,
          t: (s) => i18.t(s),
          userCanDoAction: false,
        })
      ).toBe(warning);
    });
  });

  it('should return correct warning if user is not allowed to do action', () => {
    const actions = [
      {
        action: IMAGE_ACTIONS.CREATE,
        warning: 'Sinulla ei ole oikeuksia lisätä kuvia.',
      },
      {
        action: IMAGE_ACTIONS.DELETE,
        warning: 'Sinulla ei ole oikeuksia muokata tätä kuvaa.',
      },
      {
        action: IMAGE_ACTIONS.EDIT,
        warning: '',
      },
      {
        action: IMAGE_ACTIONS.UPDATE,
        warning: 'Sinulla ei ole oikeuksia muokata tätä kuvaa.',
      },
      {
        action: IMAGE_ACTIONS.UPLOAD,
        warning: 'Sinulla ei ole oikeuksia lisätä kuvia.',
      },
    ];
    actions.forEach(({ action, warning }) => {
      expect(
        getImageActionWarning({
          action,
          authenticated: true,
          publisher,
          t: (s) => i18.t(s),
          userCanDoAction: false,
        })
      ).toBe(warning);
    });
  });
});
