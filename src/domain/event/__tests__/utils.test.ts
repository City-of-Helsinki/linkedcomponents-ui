import { advanceTo, clear } from 'jest-date-mock';

import { EXTLINK } from '../../../constants';
import {
  EventStatus,
  PublicationStatus,
  SuperEventType,
} from '../../../generated/graphql';
import {
  fakeEvent,
  fakeExternalLink,
  fakeImages,
  fakeKeywords,
  fakeLanguages,
  fakeOffers,
  fakeOrganization,
  fakePlace,
  fakeUser,
  fakeVideo,
} from '../../../utils/mockDataUtils';
import {
  EMPTY_MULTI_LANGUAGE_OBJECT,
  EVENT_EDIT_ACTIONS,
  EVENT_INITIAL_VALUES,
  EVENT_TYPE,
} from '../constants';
import { EventFormFields } from '../types';
import {
  calculateSuperEventTime,
  checkCanUserDoAction,
  eventPathBuilder,
  filterUnselectedLanguages,
  generateEventTimesFromRecurringEvent,
  getEditEventWarning,
  getEventFields,
  getEventInfoLanguages,
  getEventInitialValues,
  getEventPayload,
  getEventTimes,
  getRecurringEventPayload,
  sortLanguage,
} from '../utils';

const defaultEventPayload = {
  audience: [],
  description: {
    ar: null,
    en: null,
    fi: '',
    ru: null,
    sv: null,
    zhHans: null,
  },
  externalLinks: [],
  images: [],
  inLanguage: [],
  infoUrl: {
    ar: null,
    en: null,
    fi: '',
    ru: null,
    sv: null,
    zhHans: null,
  },
  keywords: [],
  locationExtraInfo: {
    ar: null,
    en: null,
    fi: '',
    ru: null,
    sv: null,
    zhHans: null,
  },
  name: {
    ar: null,
    en: null,
    fi: '',
    ru: null,
    sv: null,
    zhHans: null,
  },
  offers: [
    {
      isFree: true,
    },
  ],
  provider: {
    ar: null,
    en: null,
    fi: '',
    ru: null,
    sv: null,
    zhHans: null,
  },
  publicationStatus: PublicationStatus.Draft,
  publisher: '',
  shortDescription: {
    ar: null,
    en: null,
    fi: '',
    ru: null,
    sv: null,
    zhHans: null,
  },
  superEvent: undefined,
  superEventType: null,
  videos: [],
};

beforeEach(() => {
  clear();
});

describe('eventPathBuilder function', () => {
  it('should build correct path', () => {
    expect(
      eventPathBuilder({
        args: { id: 'hel:123', include: ['include1', 'include2'] },
      })
    ).toBe('/event/hel:123/?include=include1,include2');
  });
});

describe('sortLanguage function', () => {
  it('should sort languages correctly', () => {
    const en = {
      label: 'Englanti',
      value: 'en',
    };
    const fi = {
      label: 'Suomi',
      value: 'fi',
    };
    const ru = {
      label: 'Venäjä',
      value: 'ru',
    };
    const sv = {
      label: 'Ruotsi',
      value: 'sv',
    };
    expect([ru, en, sv, fi].sort(sortLanguage)).toEqual([fi, sv, en, ru]);
  });
});

describe('generateEventTimesFromRecurringEvent function', () => {
  it('should generate event times from recurring event settings', () => {
    const eventTimes = generateEventTimesFromRecurringEvent({
      startDate: new Date('2020-01-01'),
      startTime: '12:15',
      endDate: new Date('2020-12-31'),
      endTime: '14:15',
      repeatInterval: 2,
      repeatDays: ['mon', 'thu'],
    });
    expect(eventTimes).toHaveLength(53);
    expect(eventTimes[0]).toEqual({
      endTime: new Date('2020-01-02T14:15:00.000Z'),
      startTime: new Date('2020-01-02T12:15:00.000Z'),
    });
    expect(eventTimes[52]).toEqual({
      endTime: new Date('2020-12-20T14:15:00.000Z'),
      startTime: new Date('2020-12-20T12:15:00.000Z'),
    });
  });
});

describe('calculateSuperEventTime function', () => {
  it('should calculate super event time', () => {
    expect(
      calculateSuperEventTime([
        {
          startTime: new Date('2020-01-02T14:15:00.000Z'),
          endTime: new Date('2020-01-02T16:15:00.000Z'),
        },
        {
          startTime: new Date('2020-12-12T14:15:00.000Z'),
          endTime: new Date('2020-12-12T16:15:00.000Z'),
        },
      ])
    ).toEqual({
      startTime: new Date('2020-01-02T14:15:00.000Z'),
      endTime: new Date('2020-12-12T16:15:00.000Z'),
    });
  });

  expect(
    calculateSuperEventTime([
      {
        startTime: new Date('2020-01-02T14:15:00.000Z'),
        endTime: null,
      },
      {
        startTime: new Date('2020-12-12T14:15:00.000Z'),
        endTime: null,
      },
    ])
  ).toEqual({
    startTime: new Date('2020-01-02T14:15:00.000Z'),
    endTime: new Date('2020-12-12T23:59:59.999Z'),
  });

  expect(
    calculateSuperEventTime([
      {
        startTime: null,
        endTime: null,
      },
      {
        startTime: null,
        endTime: null,
      },
    ])
  ).toEqual({
    startTime: null,
    endTime: null,
  });
});

describe('getEventTimes function', () => {
  it('should return all event times event time', () => {
    const values: EventFormFields = {
      ...EVENT_INITIAL_VALUES,
      endTime: null,
      startTime: new Date('2020-01-02T10:00:00.000Z'),
      eventTimes: [
        {
          startTime: new Date('2020-01-02T14:15:00.000Z'),
          endTime: null,
        },
        {
          startTime: null,
          endTime: new Date('2020-12-12T16:15:00.000Z'),
        },
      ],
      recurringEvents: [
        {
          startDate: new Date('2020-01-01'),
          startTime: '12:15',
          endDate: new Date('2020-12-31'),
          endTime: '14:15',
          repeatInterval: 2,
          repeatDays: ['mon', 'thu'],
        },
      ],
    };
    const eventTimes = getEventTimes(values);

    expect(eventTimes).toHaveLength(56);
    expect(eventTimes[0]).toEqual({
      endTime: null,
      startTime: new Date('2020-01-02T10:00:00.000Z'),
    });
    expect(eventTimes[55]).toEqual({
      endTime: new Date('2020-12-12T16:15:00.000Z'),
      startTime: null,
    });
  });
});

describe('filterUnselectedLanguages function', () => {
  it('should set data as null for unselected languages', () => {
    expect(
      filterUnselectedLanguages(
        {
          fi: 'Value 1',
          sv: 'Value 2',
        },
        ['fi']
      )
    ).toEqual({
      fi: 'Value 1',
      sv: null,
    });
  });
});

describe('getEventPayload function', () => {
  it('should return single event as payload', () => {
    expect(
      getEventPayload(EVENT_INITIAL_VALUES, PublicationStatus.Draft)
    ).toEqual(defaultEventPayload);

    const payload = getEventPayload(
      {
        ...EVENT_INITIAL_VALUES,
        audience: ['audience:1'],
        audienceMaxAge: 18,
        audienceMinAge: 12,
        eventInfoLanguages: ['fi', 'sv'],
        description: {
          ...EMPTY_MULTI_LANGUAGE_OBJECT,
          fi: 'Description fi',
          en: 'Description en',
          sv: '',
        },
        endTime: new Date('2020-01-02T15:15:00.000Z'),
        facebookUrl: 'http://facebook.com',
        instagramUrl: 'http://instagram.com',
        twitterUrl: 'http://twitter.com',
        images: ['image:1'],
        infoUrl: {
          ...EMPTY_MULTI_LANGUAGE_OBJECT,
          fi: 'http://infourlfi.com',
          en: 'http://infourlen.com',
          sv: '',
        },
        inLanguage: ['language:1'],
        isUmbrella: true,
        keywords: ['keyword:1'],
        location: 'location:1',
        locationExtraInfo: {
          ...EMPTY_MULTI_LANGUAGE_OBJECT,
          fi: 'Location extra info fi',
          en: 'Location extra info en',
          sv: '',
        },
        name: {
          ...EMPTY_MULTI_LANGUAGE_OBJECT,
          fi: 'Name fi',
          en: 'Name en',
          sv: '',
        },
        hasPrice: true,
        offers: [
          {
            description: {
              ...EMPTY_MULTI_LANGUAGE_OBJECT,
              fi: 'Description fi',
              en: 'Description en',
              sv: '',
            },
            infoUrl: {
              ...EMPTY_MULTI_LANGUAGE_OBJECT,
              fi: 'http://urlfi.com',
              en: 'http://urlen.com',
              sv: '',
            },
            price: {
              ...EMPTY_MULTI_LANGUAGE_OBJECT,
              fi: 'Price fi',
              en: 'Price en',
              sv: '',
            },
          },
        ],
        provider: {
          ...EMPTY_MULTI_LANGUAGE_OBJECT,
          fi: 'Provider fi',
          en: 'Provider en',
          sv: '',
        },
        publisher: 'publisher:1',
        shortDescription: {
          ...EMPTY_MULTI_LANGUAGE_OBJECT,
          fi: 'Short description fi',
          en: 'Short description en',
          sv: '',
        },
        startTime: new Date('2020-01-02T12:15:00.000Z'),
        videos: [
          {
            altText: 'alt text',
            name: 'video name',
            url: 'httl://www.url.com',
          },
        ],
      },
      PublicationStatus.Draft
    );

    expect(payload).toEqual({
      ...defaultEventPayload,
      publicationStatus: 'draft',
      audience: [{ atId: 'audience:1' }],
      audienceMaxAge: 18,
      audienceMinAge: 12,
      externalLinks: [
        {
          name: 'extlink_facebook',
          link: 'http://facebook.com',
          language: 'fi',
        },
        {
          name: 'extlink_instagram',
          link: 'http://instagram.com',
          language: 'fi',
        },
        {
          name: 'extlink_twitter',
          link: 'http://twitter.com',
          language: 'fi',
        },
      ],
      description: {
        ar: null,
        en: null,
        fi: '<p>Description fi</p>',
        ru: null,
        sv: '',
        zhHans: null,
      },
      images: [{ atId: 'image:1' }],
      infoUrl: {
        ar: null,
        en: null,
        fi: 'http://infourlfi.com',
        ru: null,
        sv: '',
        zhHans: null,
      },
      inLanguage: [{ atId: 'language:1' }],
      location: { atId: 'location:1' },
      keywords: [{ atId: 'keyword:1' }],
      locationExtraInfo: {
        ar: null,
        en: null,
        fi: 'Location extra info fi',
        ru: null,
        sv: '',
        zhHans: null,
      },
      name: {
        ar: null,
        en: null,
        fi: 'Name fi',
        ru: null,
        sv: '',
        zhHans: null,
      },
      offers: [
        {
          description: {
            ar: null,
            en: null,
            fi: 'Description fi',
            ru: null,
            sv: '',
            zhHans: null,
          },
          infoUrl: {
            ar: null,
            en: null,
            fi: 'http://urlfi.com',
            ru: null,
            sv: '',
            zhHans: null,
          },
          price: {
            ar: null,
            en: null,
            fi: 'Price fi',
            ru: null,
            sv: '',
            zhHans: null,
          },
          isFree: false,
        },
      ],
      provider: {
        ar: null,
        en: null,
        fi: 'Provider fi',
        ru: null,
        sv: '',
        zhHans: null,
      },
      publisher: 'publisher:1',
      shortDescription: {
        ar: null,
        en: null,
        fi: 'Short description fi',
        ru: null,
        sv: '',
        zhHans: null,
      },
      superEvent: undefined,
      superEventType: SuperEventType.Umbrella,
      endTime: '2020-01-02T15:15:00.000Z',
      startTime: '2020-01-02T12:15:00.000Z',
      videos: [
        { altText: 'alt text', name: 'video name', url: 'httl://www.url.com' },
      ],
    });
  });

  it('should return multiple events as payload', () => {
    const eventTimes = [
      {
        startTime: new Date('2020-01-02T14:15:00.000Z'),
        endTime: null,
      },
      {
        startTime: null,
        endTime: new Date('2020-12-12T16:15:00.000Z'),
      },
    ];
    const payload = getEventPayload(
      {
        ...EVENT_INITIAL_VALUES,
        eventTimes,
        hasUmbrella: true,
        superEvent: 'hel:123',
      },
      PublicationStatus.Draft
    );

    expect(payload).toEqual([
      {
        ...defaultEventPayload,
        startTime: '2020-01-02T14:15:00.000Z',
        superEvent: { atId: 'hel:123' },
      },
      {
        ...defaultEventPayload,
        endTime: '2020-12-12T16:15:00.000Z',
        superEvent: { atId: 'hel:123' },
      },
    ]);
  });

  it('should add link to description if audience is Service Centre Card', () => {
    const payload = getEventPayload(
      {
        ...EVENT_INITIAL_VALUES,
        audience: ['/keyword/helsinki:aflfbat76e/'],
        audienceMaxAge: 18,
        audienceMinAge: 12,
        eventInfoLanguages: ['en', 'fi', 'sv'],
        description: {
          ...EMPTY_MULTI_LANGUAGE_OBJECT,
          fi: 'Description fi',
          en: 'Description en',
          sv: 'Description sv',
        },
      },
      PublicationStatus.Draft
    );

    expect(!Array.isArray(payload) && payload.description).toEqual({
      ar: null,
      en:
        '<p>The event is intended only for retired or unemployed persons with a <a href="https://www.hel.fi/sote/en/services/service-desription?id=3252">Service Centre Card</a>.</p><p>Description en</p>',
      fi:
        '<p>Tapahtuma on tarkoitettu vain eläkeläisille ja työttömille, joilla on <a href="https://www.hel.fi/sote/fi/palvelut/palvelukuvaus?id=3252">palvelukeskuskortti</a>.</p><p>Description fi</p>',
      ru: null,
      sv:
        '<p>Evenemanget är avsett endast för pensionärer eller arbetslösa med <a href="https://www.hel.fi/sote/sv/tjanster/tjanstebeskrivning?id=3252">servicecentralkort</a>.</p><p>Description sv</p>',
      zhHans: null,
    });
  });
});

describe('getRecurringEventPayload function', () => {
  it('should return recurring event payload', () => {
    expect(
      getRecurringEventPayload(
        [
          {
            ...defaultEventPayload,
            startTime: '2020-01-02T14:15:00.000Z',
            endTime: '2020-01-02T16:15:00.000Z',
          },
          {
            ...defaultEventPayload,
            startTime: '2020-02-02T14:15:00.000Z',
            endTime: null,
          },
          {
            ...defaultEventPayload,
            startTime: null,
            endTime: '2020-11-12T16:15:00.000Z',
          },
          {
            ...defaultEventPayload,
            startTime: '2020-12-12T14:15:00.000Z',
            endTime: '2020-12-12T16:15:00.000Z',
          },
        ],
        ['event:1', 'event:2']
      )
    ).toEqual({
      ...defaultEventPayload,
      endTime: '2020-12-12T16:15:00.000Z',
      startTime: '2020-01-02T14:15:00.000Z',
      subEvents: [
        {
          atId: 'event:1',
        },
        {
          atId: 'event:2',
        },
      ],
      superEventType: 'recurring',
    });
  });
});

describe('getEventFields function', () => {
  it('should return default values if value is not set', () => {
    const {
      endTime,
      id,
      atId,
      eventStatus,
      imageUrl,
      lastModifiedTime,
      publisher,
      publicationStatus,
      subEventAtIds,
      superEventAtId,
      startTime,
    } = getEventFields(
      fakeEvent({
        endTime: '',
        eventStatus: null,
        id: null,
        atId: null,
        images: [],
        lastModifiedTime: '',
        publisher: '',
        publicationStatus: null,
        subEvents: null,
        superEvent: null,
        startTime: '',
      }),
      'fi'
    );

    expect(endTime).toBe(null);
    expect(eventStatus).toBe(EventStatus.EventScheduled);
    expect(id).toBe('');
    expect(atId).toBe('');
    expect(imageUrl).toBe(null);
    expect(lastModifiedTime).toBe(null);
    expect(publisher).toBe(null);
    expect(publicationStatus).toBe('public');
    expect(startTime).toBe(null);
    expect(subEventAtIds).toEqual([]);
    expect(superEventAtId).toBe(null);
  });
});

describe('getEventInfoLanguages function', () => {
  it('should return event info languages', () => {
    expect(
      getEventInfoLanguages(
        fakeEvent({
          name: {
            ar: 'Name ar',
            en: 'Name en',
            fi: 'Name fi',
            ru: 'Name ru',
            sv: 'Name sv',
            zhHans: 'Name zh',
          },
        })
      )
    ).toEqual(['ar', 'en', 'fi', 'ru', 'sv', 'zhHans']);
  });
});

describe('getEventInitialValues function', () => {
  it('should return event edit form initial values', () => {
    const audienceAtIds = [
      `https://api.hel.fi/linkedevents-test/v1/keyword/audience:1/`,
      `https://api.hel.fi/linkedevents-test/v1/keyword/audience:2/`,
    ];
    const audienceMaxAge = 18;
    const audienceMinAge = 12;
    const description = {
      ar: 'Description ar',
      en: 'Description en',
      fi: 'Description fi',
      ru: 'Description ru',
      sv: 'Description sv',
      zhHans: 'Description zh',
    };
    const endTime = new Date('2021-07-13T05:51:05.761Z');
    const extensionCourse = {
      enrolmentEndTime: null,
      enrolmentStartTime: null,
      maximumAttendeeCapacity: '',
      minimumAttendeeCapacity: '',
    };
    const facebookUrl = 'http://facebook.com';
    const imageDetails = {
      altText: '',
      license: 'cc_by',
      name: '',
      photographerName: '',
    };
    const imageAtIds = [
      `https://api.hel.fi/linkedevents-test/v1/image/image:1/`,
    ];
    const infoUrl = {
      ar: 'Info url ar',
      en: 'Info url en',
      fi: 'Info url fi',
      ru: 'Info url ru',
      sv: 'Info url sv',
      zhHans: 'Info url zh',
    };
    const inLanguageAtIds = [
      `https://api.hel.fi/linkedevents-test/v1/language/language:1/`,
      `https://api.hel.fi/linkedevents-test/v1/language/language:2/`,
    ];
    const instagramUrl = 'http://instagram.com';
    const keywordAtIds = [
      `https://api.hel.fi/linkedevents-test/v1/keyword/keyword:1/`,
      `https://api.hel.fi/linkedevents-test/v1/keyword/keyword:2/`,
    ];
    const locationAtId =
      'https://api.hel.fi/linkedevents-test/v1/place/location:1/';
    const locationExtraInfo = {
      ar: 'Location extra info ar',
      en: 'Location extra info en',
      fi: 'Location extra info fi',
      ru: 'Location extra info ru',
      sv: 'Location extra info sv',
      zhHans: 'Location extra info zh',
    };
    const name = {
      ar: 'Name ar',
      en: 'Name en',
      fi: 'Name fi',
      ru: 'Name ru',
      sv: 'Name sv',
      zhHans: 'Name zh',
    };
    const offers = [
      {
        description: {
          ar: 'Description ar',
          en: 'Description en',
          fi: 'Description fi',
          ru: 'Description ru',
          sv: 'Description sv',
          zhHans: 'Description zh',
        },
        infoUrl: {
          ar: 'http://infourl.com',
          en: 'http://infourl.com',
          fi: 'http://infourl.com',
          ru: 'http://infourl.com',
          sv: 'http://infourl.com',
          zhHans: 'http://infourl.com',
        },
        price: {
          ar: 'Price ar',
          en: 'Price en',
          fi: 'Price fi',
          ru: 'Price ru',
          sv: 'Price sv',
          zhHans: 'Price zh',
        },
      },
    ];
    const provider = {
      ar: 'Provider ar',
      en: 'Provider en',
      fi: 'Provider fi',
      ru: 'Provider ru',
      sv: 'Provider sv',
      zhHans: 'Provider zh',
    };
    const publisher = 'publisher:123';
    const shortDescription = {
      ar: 'Short description ar',
      en: 'Short description en',
      fi: 'Short description fi',
      ru: 'Short description ru',
      sv: 'Short description sv',
      zhHans: 'Short description zh',
    };
    const startTime = new Date('2020-07-13T05:51:05.761Z');
    const superEventType = null;
    const superEventAtId =
      'https://api.hel.fi/linkedevents-test/v1/event/event:543/';
    const twitterUrl = 'http://twitter.com';
    const videos = [
      { altText: 'alt text', name: 'video name', url: 'httl://www.url.com' },
    ];

    expect(
      getEventInitialValues(
        fakeEvent({
          audience: fakeKeywords(
            audienceAtIds.length,
            audienceAtIds.map((atId) => ({ atId }))
          ).data,
          audienceMaxAge,
          audienceMinAge,
          description,
          endTime: endTime.toISOString(),
          externalLinks: [
            fakeExternalLink({
              name: EXTLINK.EXTLINK_FACEBOOK,
              link: facebookUrl,
            }),
            fakeExternalLink({
              name: EXTLINK.EXTLINK_INSTAGRAM,
              link: instagramUrl,
            }),
            fakeExternalLink({
              name: EXTLINK.EXTLINK_TWITTER,
              link: twitterUrl,
            }),
          ],
          images: fakeImages(
            imageAtIds.length,
            imageAtIds.map((atId) => ({ atId, ...imageDetails }))
          ).data,
          infoUrl,
          inLanguage: fakeLanguages(
            inLanguageAtIds.length,
            inLanguageAtIds.map((atId) => ({ atId }))
          ).data,
          keywords: fakeKeywords(
            keywordAtIds.length,
            keywordAtIds.map((atId) => ({ atId }))
          ).data,
          location: fakePlace({ atId: locationAtId }),
          locationExtraInfo,
          name,
          offers: fakeOffers(
            offers.length,
            offers.map((offer) => ({
              ...offer,
              isFree: false,
            }))
          ),
          provider,
          publisher,
          shortDescription,
          startTime: startTime.toISOString(),
          superEvent: fakeEvent({
            atId: superEventAtId,
            superEventType: SuperEventType.Umbrella,
          }),
          superEventType,
          videos: videos.map((video) => fakeVideo(video)),
        })
      )
    ).toEqual({
      audience: audienceAtIds,
      audienceMaxAge,
      audienceMinAge,
      description,
      endTime,
      extensionCourse,
      eventInfoLanguages: ['ar', 'en', 'fi', 'ru', 'sv', 'zhHans'],
      eventTimes: [],
      facebookUrl,
      hasPrice: true,
      hasUmbrella: true,
      imageDetails,
      images: imageAtIds,
      infoUrl,
      inLanguage: inLanguageAtIds,
      instagramUrl,
      isUmbrella: false,
      isVerified: true,
      keywords: keywordAtIds,
      location: locationAtId,
      locationExtraInfo,
      name,
      offers,
      provider,
      publisher,
      recurringEvents: [],
      shortDescription,
      startTime,
      superEvent: superEventAtId,
      twitterUrl,
      type: EVENT_TYPE.EVENT,
      videos,
    });
  });

  it('should return event edit form default initial values', () => {
    const expectedName = {
      ar: '',
      en: '',
      fi: 'Name fi',
      ru: '',
      sv: '',
      zhHans: '',
    };
    const {
      audienceMaxAge,
      audienceMinAge,
      endTime,
      facebookUrl,
      instagramUrl,
      location,
      name,
      offers,
      startTime,
      superEvent,
      twitterUrl,
    } = getEventInitialValues(
      fakeEvent({
        audienceMaxAge: null,
        audienceMinAge: null,
        endTime: null,
        externalLinks: [],
        location: null,
        name: {
          ar: null,
          en: null,
          fi: 'Name fi',
          ru: null,
          sv: null,
          zhHans: null,
        },
        offers: null,
        startTime: null,
        superEvent: null,
      })
    );

    expect(audienceMaxAge).toEqual('');
    expect(audienceMinAge).toEqual('');
    expect(endTime).toEqual(null);
    expect(facebookUrl).toEqual('');
    expect(instagramUrl).toEqual('');
    expect(location).toEqual('');
    expect(name).toEqual(expectedName);
    expect(offers).toEqual([]);
    expect(startTime).toEqual(null);
    expect(superEvent).toEqual(superEvent);
    expect(twitterUrl).toEqual('');
  });
});

describe('checkCanUserDoAction function', () => {
  it('should allow/deny correct actions if adminArganizations contains event publisher', () => {
    const publisher = 'publisher:1';
    const event = fakeEvent({ publisher });
    const user = fakeUser({ adminOrganizations: [publisher] });

    const allowedActions = [
      EVENT_EDIT_ACTIONS.CANCEL,
      EVENT_EDIT_ACTIONS.COPY,
      EVENT_EDIT_ACTIONS.DELETE,
      EVENT_EDIT_ACTIONS.EDIT,
      EVENT_EDIT_ACTIONS.POSTPONE,
      EVENT_EDIT_ACTIONS.PUBLISH,
      EVENT_EDIT_ACTIONS.UPDATE_DRAFT,
      EVENT_EDIT_ACTIONS.UPDATE_PUBLIC,
    ];

    allowedActions.forEach((action) => {
      expect(
        checkCanUserDoAction({
          action,
          event,
          organizationAncestors: [],
          user,
        })
      ).toBeTruthy();
    });
  });

  it('should allow/deny correct actions if organizationAncestores contains any of the adminArganizations', () => {
    const publisher = 'publisher:1';
    const adminOrganization = 'admin:1';
    const event = fakeEvent({ publisher });
    const user = fakeUser({ adminOrganizations: [adminOrganization] });

    const allowedActions = [
      EVENT_EDIT_ACTIONS.CANCEL,
      EVENT_EDIT_ACTIONS.COPY,
      EVENT_EDIT_ACTIONS.DELETE,
      EVENT_EDIT_ACTIONS.EDIT,
      EVENT_EDIT_ACTIONS.POSTPONE,
      EVENT_EDIT_ACTIONS.PUBLISH,
      EVENT_EDIT_ACTIONS.UPDATE_DRAFT,
      EVENT_EDIT_ACTIONS.UPDATE_PUBLIC,
    ];

    allowedActions.forEach((action) => {
      expect(
        checkCanUserDoAction({
          action,
          event,
          organizationAncestors: [fakeOrganization({ id: adminOrganization })],
          user,
        })
      ).toBeTruthy();
    });
  });

  it('should allow/deny correct actions if organizationMembers contains event publisher and event is draft', () => {
    const publisher = 'publisher:1';
    const event = fakeEvent({
      publisher,
      publicationStatus: PublicationStatus.Draft,
    });
    const user = fakeUser({ organizationMemberships: [publisher] });

    const allowedActions = [
      EVENT_EDIT_ACTIONS.CANCEL,
      EVENT_EDIT_ACTIONS.COPY,
      EVENT_EDIT_ACTIONS.DELETE,
      EVENT_EDIT_ACTIONS.EDIT,
      EVENT_EDIT_ACTIONS.POSTPONE,

      EVENT_EDIT_ACTIONS.UPDATE_DRAFT,
    ];

    allowedActions.forEach((action) => {
      expect(
        checkCanUserDoAction({
          action,
          event,
          organizationAncestors: [],
          user,
        })
      ).toBeTruthy();
    });

    const deniedActions = [
      EVENT_EDIT_ACTIONS.PUBLISH,
      EVENT_EDIT_ACTIONS.UPDATE_PUBLIC,
    ];

    deniedActions.forEach((action) => {
      expect(
        checkCanUserDoAction({
          action,
          event,
          organizationAncestors: [],
          user,
        })
      ).toBeFalsy();
    });
  });

  it('should allow/deny correct actions if organizationMembers contains event publisher and event is public', () => {
    const publisher = 'publisher:1';
    const event = fakeEvent({
      publisher,
      publicationStatus: PublicationStatus.Public,
    });
    const user = fakeUser({ organizationMemberships: [publisher] });

    const allowedActions = [
      EVENT_EDIT_ACTIONS.COPY,
      EVENT_EDIT_ACTIONS.EDIT,
      EVENT_EDIT_ACTIONS.UPDATE_DRAFT,
    ];

    allowedActions.forEach((action) => {
      expect(
        checkCanUserDoAction({
          action,
          event,
          organizationAncestors: [],
          user,
        })
      ).toBeTruthy();
    });

    const deniedActions = [
      EVENT_EDIT_ACTIONS.CANCEL,
      EVENT_EDIT_ACTIONS.DELETE,
      EVENT_EDIT_ACTIONS.POSTPONE,
      EVENT_EDIT_ACTIONS.PUBLISH,
      EVENT_EDIT_ACTIONS.UPDATE_PUBLIC,
    ];

    deniedActions.forEach((action) => {
      expect(
        checkCanUserDoAction({
          action,
          event,
          organizationAncestors: [],
          user,
        })
      ).toBeFalsy();
    });
  });

  it('should allow/deny correct actions if user is not member of any organization', () => {
    const publisher = 'publisher:1';
    const event = fakeEvent({ publisher });
    const user = fakeUser({
      adminOrganizations: [],
      organizationMemberships: [],
    });

    const deniedActions = [
      EVENT_EDIT_ACTIONS.CANCEL,
      EVENT_EDIT_ACTIONS.DELETE,
      EVENT_EDIT_ACTIONS.POSTPONE,
      EVENT_EDIT_ACTIONS.PUBLISH,
      EVENT_EDIT_ACTIONS.UPDATE_DRAFT,
      EVENT_EDIT_ACTIONS.UPDATE_PUBLIC,
    ];

    deniedActions.forEach((action) => {
      expect(
        checkCanUserDoAction({
          action,
          event,
          organizationAncestors: [],
          user,
        })
      ).toBeFalsy();
    });

    const allowedActions = [EVENT_EDIT_ACTIONS.COPY, EVENT_EDIT_ACTIONS.EDIT];

    allowedActions.forEach((action) => {
      expect(
        checkCanUserDoAction({
          action,
          event,
          organizationAncestors: [],
          user,
        })
      ).toBeTruthy();
    });
  });
});

describe('getEditEventWarning function', () => {
  it('should return correct warning if user is not authenticated', () => {
    const event = fakeEvent();

    const allowedActions = [EVENT_EDIT_ACTIONS.COPY, EVENT_EDIT_ACTIONS.EDIT];

    const commonProps = {
      authenticated: false,
      event,
      t: (s) => s,
      userCanDoAction: false,
    };

    allowedActions.forEach((action) => {
      expect(
        getEditEventWarning({
          action,
          ...commonProps,
        })
      ).toBe('');
    });

    const deniedActions = [
      EVENT_EDIT_ACTIONS.CANCEL,
      EVENT_EDIT_ACTIONS.DELETE,
      EVENT_EDIT_ACTIONS.POSTPONE,
      EVENT_EDIT_ACTIONS.PUBLISH,
      EVENT_EDIT_ACTIONS.UPDATE_DRAFT,
      EVENT_EDIT_ACTIONS.UPDATE_PUBLIC,
    ];

    deniedActions.forEach((action) => {
      expect(
        getEditEventWarning({
          action,
          ...commonProps,
        })
      ).toBe('authentication.noRightsUpdateEvent');
    });
  });

  it('should return correct warning if event is cancelled', () => {
    const event = fakeEvent({ eventStatus: EventStatus.EventCancelled });

    const allowedActions = [
      EVENT_EDIT_ACTIONS.COPY,
      EVENT_EDIT_ACTIONS.DELETE,
      EVENT_EDIT_ACTIONS.EDIT,
    ];

    const commonProps = {
      authenticated: true,
      event,
      t: (s) => s,
      userCanDoAction: true,
    };
    allowedActions.forEach((action) => {
      expect(
        getEditEventWarning({
          ...commonProps,
          action,
        })
      ).toBe('');
    });

    const deniedActions = [
      EVENT_EDIT_ACTIONS.CANCEL,
      EVENT_EDIT_ACTIONS.POSTPONE,
      EVENT_EDIT_ACTIONS.PUBLISH,
      EVENT_EDIT_ACTIONS.UPDATE_DRAFT,
      EVENT_EDIT_ACTIONS.UPDATE_PUBLIC,
    ];

    deniedActions.forEach((action) => {
      expect(
        getEditEventWarning({
          ...commonProps,
          action,
        })
      ).toBe('event.form.editButtonPanel.warningCancelledEvent');
    });
  });

  it('should return correct warning if event is cancelled', () => {
    const event = fakeEvent({ deleted: '2021-12-12' });

    const allowedActions = [EVENT_EDIT_ACTIONS.COPY, EVENT_EDIT_ACTIONS.EDIT];

    const commonProps = {
      authenticated: true,
      event,
      t: (s) => s,
      userCanDoAction: true,
    };
    allowedActions.forEach((action) => {
      expect(
        getEditEventWarning({
          ...commonProps,
          action,
        })
      ).toBe('');
    });

    const deniedActions = [
      EVENT_EDIT_ACTIONS.CANCEL,
      EVENT_EDIT_ACTIONS.DELETE,
      EVENT_EDIT_ACTIONS.POSTPONE,
      EVENT_EDIT_ACTIONS.PUBLISH,
      EVENT_EDIT_ACTIONS.UPDATE_DRAFT,
      EVENT_EDIT_ACTIONS.UPDATE_PUBLIC,
    ];

    deniedActions.forEach((action) => {
      expect(
        getEditEventWarning({
          ...commonProps,
          action,
        })
      ).toBe('event.form.editButtonPanel.warningDeletedEvent');
    });
  });

  it('should return correct warning if event is in the past', () => {
    advanceTo('2021-01-01');
    const event = fakeEvent({ endTime: '2020-12-12', startTime: '2020-12-10' });

    const allowedActions = [
      EVENT_EDIT_ACTIONS.COPY,
      EVENT_EDIT_ACTIONS.DELETE,
      EVENT_EDIT_ACTIONS.EDIT,
    ];

    const commonProps = {
      authenticated: true,
      event,
      t: (s) => s,
      userCanDoAction: true,
    };
    allowedActions.forEach((action) => {
      expect(
        getEditEventWarning({
          ...commonProps,
          action,
        })
      ).toBe('');
    });

    const deniedActions = [
      EVENT_EDIT_ACTIONS.CANCEL,
      EVENT_EDIT_ACTIONS.POSTPONE,
      EVENT_EDIT_ACTIONS.PUBLISH,
      EVENT_EDIT_ACTIONS.UPDATE_DRAFT,
      EVENT_EDIT_ACTIONS.UPDATE_PUBLIC,
    ];

    deniedActions.forEach((action) => {
      expect(
        getEditEventWarning({
          ...commonProps,
          action,
        })
      ).toBe('event.form.editButtonPanel.warningEventInPast');
    });
  });

  it('should return correct warning if trying to cancel draft event', () => {
    advanceTo('2020-10-12');
    const event = fakeEvent({
      endTime: '2021-02-01',
      startTime: '2021-01-01',
      publicationStatus: PublicationStatus.Draft,
    });

    expect(
      getEditEventWarning({
        authenticated: true,
        event,
        t: (s) => s,
        userCanDoAction: true,
        action: EVENT_EDIT_ACTIONS.CANCEL,
      })
    ).toBe('event.form.editButtonPanel.warningCannotCancelDraft');
  });

  it('should return correct warning if trying to postpone draft event', () => {
    advanceTo('2020-10-12');
    const event = fakeEvent({
      endTime: '2021-02-01',
      startTime: '2021-01-01',
      publicationStatus: PublicationStatus.Draft,
    });

    expect(
      getEditEventWarning({
        authenticated: true,
        event,
        t: (s) => s,
        userCanDoAction: true,
        action: EVENT_EDIT_ACTIONS.POSTPONE,
      })
    ).toBe('event.form.editButtonPanel.warningCannotPostponeDraft');
  });

  it('should return correct warning if trying to publish sub-event', () => {
    advanceTo('2020-10-12');
    const event = fakeEvent({
      endTime: '2021-02-01',
      startTime: '2021-01-01',
      superEvent: fakeEvent(),
      publicationStatus: PublicationStatus.Draft,
    });

    expect(
      getEditEventWarning({
        authenticated: true,
        event,
        t: (s) => s,
        userCanDoAction: true,
        action: EVENT_EDIT_ACTIONS.PUBLISH,
      })
    ).toBe('event.form.editButtonPanel.warningCannotPublishSubEvent');
  });

  it('should return correct warning if user cannot do action', () => {
    advanceTo('2020-10-12');
    const event = fakeEvent({
      endTime: '2021-02-01',
      startTime: '2021-01-01',
      superEvent: fakeEvent(),
      publicationStatus: PublicationStatus.Draft,
    });

    expect(
      getEditEventWarning({
        authenticated: true,
        event,
        t: (s) => s,
        userCanDoAction: false,
        action: EVENT_EDIT_ACTIONS.UPDATE_DRAFT,
      })
    ).toBe('event.form.editButtonPanel.warningNoRightsToEdit');
  });
});
