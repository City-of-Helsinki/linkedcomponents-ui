import { PublicationStatus, SuperEventType } from '../../../generated/graphql';
import { fakeEvent, fakeOffers } from '../../../utils/mockDataUtils';
import {
  EMPTY_MULTI_LANGUAGE_OBJECT,
  EVENT_INITIAL_VALUES,
} from '../constants';
import { EventFormFields } from '../types';
import {
  calculateSuperEventTime,
  eventPathBuilder,
  filterUnselectedLanguages,
  generateEventTimesFromRecurringEvent,
  getEventFields,
  getEventPayload,
  getEventTimes,
  getRecurringEventPayload,
  sortLanguage,
} from '../utils';

const defaultEventPayload = {
  audience: [],
  description: {},
  externalLinks: [],
  images: [],
  inLanguage: [],
  infoUrl: {},
  keywords: [],
  locationExtraInfo: {},
  name: {},
  offers: [
    {
      isFree: true,
    },
  ],
  provider: {},
  publicationStatus: PublicationStatus.Draft,
  shortDescription: {},
};

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
  it('should not return data for unselected languages', () => {
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
        shortDescription: {
          ...EMPTY_MULTI_LANGUAGE_OBJECT,
          fi: 'Short description fi',
          en: 'Short description en',
          sv: '',
        },
        startTime: new Date('2020-01-02T12:15:00.000Z'),
      },
      PublicationStatus.Draft
    );

    expect(payload).toEqual({
      ...defaultEventPayload,
      audience: [{ atId: 'audience:1' }],
      audienceMaxAge: 18,
      audienceMinAge: 12,
      description: {
        fi: 'Description fi',
      },
      endTime: '2020-01-02T15:15:00.000Z',
      externalLinks: [
        {
          language: 'fi',
          link: 'http://facebook.com',
          name: 'extlink_facebook',
        },
        {
          language: 'fi',
          link: 'http://instagram.com',
          name: 'extlink_instagram',
        },
        {
          language: 'fi',
          link: 'http://twitter.com',
          name: 'extlink_twitter',
        },
      ],
      images: [{ atId: 'image:1' }],
      infoUrl: {
        fi: 'http://infourlfi.com',
      },
      inLanguage: [{ atId: 'language:1' }],
      keywords: [{ atId: 'keyword:1' }],
      location: { atId: 'location:1' },
      locationExtraInfo: {
        fi: 'Location extra info fi',
      },
      name: {
        fi: 'Name fi',
      },
      offers: [
        {
          description: {
            fi: 'Description fi',
          },
          infoUrl: {
            fi: 'http://urlfi.com',
          },
          isFree: false,
          price: {
            fi: 'Price fi',
          },
        },
      ],
      provider: {
        fi: 'Provider fi',
      },
      shortDescription: {
        fi: 'Short description fi',
      },
      startTime: '2020-01-02T12:15:00.000Z',
      superEventType: SuperEventType.Umbrella,
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
      imageUrl,
      publisher,
      publicationStatus,
      startTime,
    } = getEventFields(
      fakeEvent({
        endTime: '',
        id: null,
        atId: null,
        images: [],
        publisher: '',
        publicationStatus: null,
        startTime: '',
      }),
      'fi'
    );

    expect(endTime).toBe(null);
    expect(id).toBe('');
    expect(atId).toBe('');
    expect(imageUrl).toBe(null);
    expect(publisher).toBe(null);
    expect(publicationStatus).toBe('public');
    expect(startTime).toBe(null);
  });
});
