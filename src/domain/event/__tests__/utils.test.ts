/* eslint-disable max-len */
import { advanceTo, clear } from 'jest-date-mock';

import { EXTLINK, WEEK_DAY } from '../../../constants';
import {
  EventQueryVariables,
  EventStatus,
  EventTypeId,
  PublicationStatus,
  SuperEventType,
} from '../../../generated/graphql';
import {
  fakeEvent,
  fakeExternalLink,
  fakeImages,
  fakeKeywords,
  fakeLanguage,
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
import { EventFormFields, RecurringEventSettings } from '../types';
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
  getNewEventTimes,
  getRecurringEventPayload,
  sortLanguage,
  sortWeekDays,
} from '../utils';

const defaultEventPayload = {
  audience: [],
  audienceMaxAge: null,
  audienceMinAge: null,
  description: {
    ar: null,
    en: null,
    fi: '',
    ru: null,
    sv: null,
    zhHans: null,
  },
  endTime: null,
  enrolmentEndTime: null,
  enrolmentStartTime: null,
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
  location: null,
  locationExtraInfo: {
    ar: null,
    en: null,
    fi: '',
    ru: null,
    sv: null,
    zhHans: null,
  },
  maximumAttendeeCapacity: null,
  minimumAttendeeCapacity: null,
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
  startTime: null,
  superEvent: null,
  superEventType: null,
  typeId: EventTypeId.General,
  videos: [],
};

beforeEach(() => {
  clear();
});

describe('eventPathBuilder function', () => {
  const cases: [EventQueryVariables, string][] = [
    [
      { id: 'hel:123', include: ['include1', 'include2'] },
      '/event/hel:123/?include=include1,include2',
    ],
    [{ id: 'hel:123' }, '/event/hel:123/'],
  ];
  it.each(cases)('should build correct path', (variables, expectedPath) =>
    expect(eventPathBuilder({ args: variables })).toBe(expectedPath)
  );
});

describe('sortLanguage function', () => {
  it('should sort languages correctly', () => {
    const en = fakeLanguage({ name: { fi: 'Englanti' }, id: 'en' });
    const fi = fakeLanguage({ name: { fi: 'Suomi' }, id: 'fi' });
    const ru = fakeLanguage({ name: { fi: 'Venäjä' }, id: 'ru' });
    const sv = fakeLanguage({ name: { fi: 'Ruotsi' }, id: 'sv' });

    expect([ru, en, sv, fi].sort(sortLanguage)).toEqual([fi, sv, en, ru]);
  });
});

describe('sortWeekDays function', () => {
  it('should sort week days correctly', () => {
    expect(
      [
        WEEK_DAY.SUN,
        WEEK_DAY.SAT,
        WEEK_DAY.FRI,
        WEEK_DAY.THU,
        WEEK_DAY.WED,
        WEEK_DAY.TUE,
        WEEK_DAY.MON,
      ].sort(sortWeekDays)
    ).toEqual([
      WEEK_DAY.MON,
      WEEK_DAY.TUE,
      WEEK_DAY.WED,
      WEEK_DAY.THU,
      WEEK_DAY.FRI,
      WEEK_DAY.SAT,
      WEEK_DAY.SUN,
    ]);
  });
});

describe('generateEventTimesFromRecurringEvent function', () => {
  it('should generate event times from recurring event settings', () => {
    const eventTimes = generateEventTimesFromRecurringEvent({
      startDate: new Date('2020-01-01'),
      startTime: '12:15',
      endDate: new Date('2020-12-31'),
      endTime: '14:15',
      eventTimes: [],
      repeatInterval: 2,
      repeatDays: ['mon', 'thu'],
    });
    expect(eventTimes).toHaveLength(53);
    expect(eventTimes[0]).toEqual({
      endTime: new Date('2020-01-06T14:15:00.000Z'),
      id: null,
      startTime: new Date('2020-01-06T12:15:00.000Z'),
    });
    expect(eventTimes[52]).toEqual({
      endTime: new Date('2020-12-31T14:15:00.000Z'),
      id: null,
      startTime: new Date('2020-12-31T12:15:00.000Z'),
    });
  });
});

describe('calculateSuperEventTime function', () => {
  it('should calculate super event time', () => {
    expect(
      calculateSuperEventTime([
        {
          startTime: new Date('2020-01-02T14:15:00.000Z'),
          id: null,
          endTime: new Date('2020-01-02T16:15:00.000Z'),
        },
        {
          startTime: new Date('2020-12-12T14:15:00.000Z'),
          id: null,
          endTime: new Date('2020-12-12T16:15:00.000Z'),
        },
      ])
    ).toEqual({
      startTime: new Date('2020-01-02T14:15:00.000Z'),
      id: null,
      endTime: new Date('2020-12-12T16:15:00.000Z'),
    });
  });

  expect(
    calculateSuperEventTime([
      {
        startTime: new Date('2020-01-02T14:15:00.000Z'),
        id: null,
        endTime: null,
      },
      {
        startTime: new Date('2020-12-12T14:15:00.000Z'),
        id: null,
        endTime: null,
      },
    ])
  ).toEqual({
    startTime: new Date('2020-01-02T14:15:00.000Z'),
    id: null,
    endTime: new Date('2020-12-12T23:59:59.999Z'),
  });

  expect(
    calculateSuperEventTime([
      {
        startTime: null,
        id: null,
        endTime: null,
      },
      {
        startTime: null,
        id: null,
        endTime: null,
      },
    ])
  ).toEqual({
    startTime: null,
    id: null,
    endTime: null,
  });
});

describe('getEventTimes function', () => {
  it('should return all event times event time', () => {
    const values: EventFormFields = {
      ...EVENT_INITIAL_VALUES,
      eventTimes: [
        {
          startTime: new Date('2020-01-02T14:15:00.000Z'),
          id: null,
          endTime: null,
        },
        {
          startTime: null,
          id: null,
          endTime: new Date('2020-12-12T16:15:00.000Z'),
        },
      ],
      recurringEvents: [
        {
          startDate: new Date('2020-01-01'),
          startTime: '12:15',
          endDate: new Date('2020-12-31'),
          endTime: '14:15',
          eventTimes: [
            {
              startTime: new Date('2020-01-15T14:15:00.000Z'),
              id: null,
              endTime: new Date('2020-01-15T16:15:00.000Z'),
            },
            {
              startTime: new Date('2020-02-15T14:15:00.000Z'),
              id: null,
              endTime: new Date('2020-02-15T16:15:00.000Z'),
            },
          ],
          repeatInterval: 2,
          repeatDays: ['mon', 'thu'],
        },
      ],
    };
    const eventTimes = getEventTimes(values);

    expect(eventTimes).toHaveLength(4);
    expect(eventTimes[0]).toEqual({
      endTime: null,
      id: null,
      startTime: new Date('2020-01-02T14:15:00.000Z'),
    });
    expect(eventTimes[3]).toEqual({
      endTime: new Date('2020-12-12T16:15:00.000Z'),
      id: null,
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

    const audienceMaxAge = 18,
      audienceMinAge = 12,
      endTime = '2020-01-02T15:15:00.000Z',
      enrolmentEndTime = '2020-01-01T15:15:00.000Z',
      enrolmentStartTime = '2020-01-01T09:15:00.000Z',
      maximumAttendeeCapacity = 10,
      minimumAttendeeCapacity = 5,
      publicationStatus = PublicationStatus.Draft,
      publisher = 'publisher:1',
      startTime = '2020-01-02T12:15:00.000Z',
      videos = [
        {
          altText: 'alt text',
          name: 'video name',
          url: 'httl://www.url.com',
        },
      ];

    const payload = getEventPayload(
      {
        ...EVENT_INITIAL_VALUES,
        audience: ['audience:1'],
        audienceMaxAge,
        audienceMinAge,
        description: {
          ...EMPTY_MULTI_LANGUAGE_OBJECT,
          fi: 'Description fi',
          en: 'Description en',
          sv: '',
        },
        enrolmentEndTime: new Date(enrolmentEndTime),
        enrolmentStartTime: new Date(enrolmentStartTime),
        eventInfoLanguages: ['fi', 'sv'],
        eventTimes: [
          {
            endTime: new Date(endTime),
            id: null,
            startTime: new Date(startTime),
          },
        ],
        externalLinks: [
          {
            name: 'extlink_facebook',
            link: 'http://facebook.com',
          },
        ],
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
        maximumAttendeeCapacity,
        minimumAttendeeCapacity,
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
        publisher,
        shortDescription: {
          ...EMPTY_MULTI_LANGUAGE_OBJECT,
          fi: 'Short description fi',
          en: 'Short description en',
          sv: '',
        },
        videos,
      },
      publicationStatus
    );

    expect(payload).toEqual({
      ...defaultEventPayload,
      audience: [{ atId: 'audience:1' }],
      audienceMaxAge,
      audienceMinAge,
      description: {
        ar: null,
        en: null,
        fi: '<p>Description fi</p>',
        ru: null,
        sv: '',
        zhHans: null,
      },
      endTime,
      enrolmentEndTime,
      enrolmentStartTime,
      externalLinks: [
        {
          name: 'extlink_facebook',
          link: 'http://facebook.com',
          language: 'fi',
        },
      ],
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
      maximumAttendeeCapacity,
      minimumAttendeeCapacity,
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
      publisher,
      publicationStatus,
      shortDescription: {
        ar: null,
        en: null,
        fi: 'Short description fi',
        ru: null,
        sv: '',
        zhHans: null,
      },
      startTime,
      superEvent: null,
      superEventType: SuperEventType.Umbrella,
      videos,
    });
  });

  it('should return multiple events as payload', () => {
    const eventTimes = [
      {
        startTime: new Date('2020-01-02T14:15:00.000Z'),
        id: null,
        endTime: null,
      },
      {
        startTime: null,
        id: null,
        endTime: new Date('2020-12-12T16:15:00.000Z'),
      },
    ];
    const recurringEvents: RecurringEventSettings[] = [
      {
        endDate: new Date('2020-05-15T00:00:00.000Z'),
        endTime: '12.00',
        eventTimes: [
          {
            startTime: new Date('2020-05-14T12:00:00.000Z'),
            id: null,
            endTime: new Date('2020-05-14T14:00:00.000Z'),
          },
          {
            startTime: new Date('2020-05-15T12:00:00.000Z'),
            id: null,
            endTime: new Date('2020-05-15T14:00:00.000Z'),
          },
        ],
        repeatDays: [],
        repeatInterval: 1,
        startDate: new Date('2020-05-14T00:00:00.000Z'),
        startTime: '14.00',
      },
    ];
    const payload = getEventPayload(
      {
        ...EVENT_INITIAL_VALUES,
        eventTimes,
        recurringEvents,
        hasUmbrella: true,
        superEvent: 'hel:123',
      },
      PublicationStatus.Draft
    );

    expect(payload).toEqual([
      {
        ...defaultEventPayload,
        startTime: '2020-01-02T14:15:00.000Z',
        superEvent: null,
      },
      {
        ...defaultEventPayload,
        startTime: '2020-05-14T12:00:00.000Z',
        endTime: '2020-05-14T14:00:00.000Z',
        superEvent: null,
      },
      {
        ...defaultEventPayload,
        startTime: '2020-05-15T12:00:00.000Z',
        endTime: '2020-05-15T14:00:00.000Z',
        superEvent: null,
      },
      {
        ...defaultEventPayload,
        endTime: '2020-12-12T16:15:00.000Z',
        superEvent: null,
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
      en: '<p>The event is intended only for retired or unemployed persons with a <a href="https://www.hel.fi/sote/en/services/service-desription?id=3252">Service Centre Card</a>.</p><p>Description en</p>',
      fi: '<p>Tapahtuma on tarkoitettu vain eläkeläisille ja työttömille, joilla on <a href="https://www.hel.fi/sote/fi/palvelut/palvelukuvaus?id=3252">palvelukeskuskortti</a>.</p><p>Description fi</p>',
      ru: null,
      sv: '<p>Evenemanget är avsett endast för pensionärer eller arbetslösa med <a href="https://www.hel.fi/sote/sv/tjanster/tjanstebeskrivning?id=3252">servicecentralkort</a>.</p><p>Description sv</p>',
      zhHans: null,
    });
  });
});

describe('getNewEventTimes function', () => {
  it('should get new event times', () => {
    const eventTime1 = {
      id: '1',
      startTime: new Date('2020-01-02T14:15:00.000Z'),
      endTime: new Date('2020-01-02T16:15:00.000Z'),
    };
    const eventTime2 = {
      id: '2',
      startTime: new Date('2020-01-03T14:15:00.000Z'),
      endTime: new Date('2020-01-03T16:15:00.000Z'),
    };
    const eventTime3 = {
      id: '3',
      startTime: new Date('2020-01-04T14:15:00.000Z'),
      endTime: new Date('2020-01-04T16:15:00.000Z'),
    };
    const eventTime4 = {
      id: '4',
      startTime: new Date('2020-01-05T14:15:00.000Z'),
      endTime: new Date('2020-01-05T16:15:00.000Z'),
    };
    expect(
      getNewEventTimes(
        [eventTime1, eventTime2],
        [eventTime3, eventTime4].map((eventTime) => ({
          endDate: eventTime.endTime,
          endTime: '16.15',
          eventTimes: [eventTime],
          repeatDays: ['mon'],
          repeatInterval: 1,
          startDate: eventTime.startTime,
          startTime: '16.15',
        }))
      )
    ).toEqual([eventTime1, eventTime2, eventTime3, eventTime4]);
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
        ['event:1', 'event:2'],
        EVENT_INITIAL_VALUES
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
    const enrolmentEndTime = new Date('2021-06-15T05:51:05.761Z');
    const enrolmentStartTime = new Date('2021-05-05T05:51:05.761Z');
    const facebookUrl = 'http://facebook.com';
    const id = 'event:1';
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
    const maximumAttendeeCapacity = '';
    const minimumAttendeeCapacity = '';
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
    const type = EVENT_TYPE.Course;
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
          enrolmentEndTime: enrolmentEndTime.toISOString(),
          enrolmentStartTime: enrolmentStartTime.toISOString(),
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
          id,
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
          typeId: EventTypeId.Course,
          videos: videos.map((video) => fakeVideo(video)),
        })
      )
    ).toEqual({
      audience: audienceAtIds,
      audienceMaxAge,
      audienceMinAge,
      description,
      enrolmentEndTime,
      enrolmentStartTime,
      eventInfoLanguages: ['ar', 'en', 'fi', 'ru', 'sv', 'zhHans'],
      eventTimes: [],
      events: [
        {
          endTime,
          id,
          startTime,
        },
      ],
      externalLinks: [
        {
          name: EXTLINK.EXTLINK_FACEBOOK,
          link: facebookUrl,
        },
        {
          name: EXTLINK.EXTLINK_INSTAGRAM,
          link: instagramUrl,
        },
        {
          name: EXTLINK.EXTLINK_TWITTER,
          link: twitterUrl,
        },
      ],
      hasPrice: true,
      hasUmbrella: true,
      imageDetails,
      images: imageAtIds,
      infoUrl,
      inLanguage: inLanguageAtIds,
      isImageEditable: false,
      isUmbrella: false,
      isVerified: true,
      keywords: keywordAtIds,
      location: locationAtId,
      locationExtraInfo,
      mainCategories: [],
      maximumAttendeeCapacity,
      minimumAttendeeCapacity,
      name,
      offers,
      provider,
      publisher,
      recurringEvents: [],
      recurringEventEndTime: null,
      recurringEventStartTime: null,
      shortDescription,
      superEvent: superEventAtId,
      type,
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
      enrolmentEndTime,
      enrolmentStartTime,
      externalLinks,
      location,
      name,
      offers,
      publisher,
      superEvent,
      type,
      videos,
    } = getEventInitialValues(
      fakeEvent({
        audienceMaxAge: null,
        audienceMinAge: null,
        endTime: null,
        enrolmentEndTime: null,
        enrolmentStartTime: null,
        externalLinks: [{}],
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
        publisher: null,
        startTime: null,
        superEvent: null,
        typeId: null,
        videos: [],
      })
    );

    expect(audienceMaxAge).toEqual('');
    expect(audienceMinAge).toEqual('');
    expect(enrolmentEndTime).toEqual(null);
    expect(enrolmentStartTime).toEqual(null);
    expect(externalLinks).toEqual([{ link: '', name: '' }]);
    expect(location).toEqual('');
    expect(name).toEqual(expectedName);
    expect(offers).toEqual([]);
    expect(publisher).toEqual('');
    expect(superEvent).toEqual(superEvent);
    expect(type).toEqual(EVENT_TYPE.General);
    expect(videos).toEqual([{ altText: '', name: '', url: '' }]);
  });

  it('should return event edit form default initial values for recurring event', () => {
    const { events, recurringEventEndTime, recurringEventStartTime, videos } =
      getEventInitialValues(
        fakeEvent({
          endTime: null,
          subEvents: [fakeEvent({ id: '', startTime: '', endTime: '' })],
          startTime: null,

          superEventType: SuperEventType.Recurring,
          videos: [{ altText: null, name: null, url: null }],
        })
      );

    expect(events).toEqual([{ id: null, startTime: null, endTime: null }]);
    expect(recurringEventEndTime).toBe(null);
    expect(recurringEventStartTime).toBe(null);
    expect(videos).toEqual([{ altText: '', name: '', url: '' }]);
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
      ).toBe(true);
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
      ).toBe(true);
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
      ).toBe(true);
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
      ).toBe(false);
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
      ).toBe(true);
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
      ).toBe(false);
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
      ).toBe(false);
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
      ).toBe(true);
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
