import {
  EventsQueryVariables,
  EventTypeId,
  PublicationStatus,
} from '../../../generated/graphql';
import { eventsPathBuilder } from '../utils';

describe('eventsPathBuilder function', () => {
  const cases: [EventsQueryVariables, string][] = [
    [{ adminUser: true }, '/event/?admin_user=true'],
    [{ combinedText: ['text1', 'text2'] }, '/event/?combined_text=text1,text2'],
    [{ createdBy: 'me' }, '/event/?created_by=me'],
    [
      { division: ['division1', 'division2'] },
      '/event/?division=division1,division2',
    ],
    [{ end: '2020-12-12' }, '/event/?end=2020-12-12'],
    [{ endsAfter: '14' }, '/event/?ends_after=14'],
    [{ endsBefore: '14' }, '/event/?ends_before=14'],
    [
      {
        eventType: [
          EventTypeId.Course,
          EventTypeId.General,
          EventTypeId.Volunteering,
        ],
      },
      '/event/?event_type=Course,General,Volunteering',
    ],
    [
      { include: ['include1', 'include2'] },
      '/event/?include=include1,include2',
    ],
    [{ inLanguage: 'fi' }, '/event/?in_language=fi'],
    [{ isFree: true }, '/event/?is_free=true'],
    [{ isFree: false }, '/event/?is_free=false'],
    [
      { keyword: ['keyword1', 'keyword2'] },
      '/event/?keyword=keyword1,keyword2',
    ],
    [
      { keywordAnd: ['keyword1', 'keyword2'] },
      '/event/?keyword_AND=keyword1,keyword2',
    ],
    [
      { keywordNot: ['keyword1', 'keyword2'] },
      '/event/?keyword!=keyword1,keyword2',
    ],
    [{ language: 'fi' }, '/event/?language=fi'],
    [
      { location: ['location1', 'location2'] },
      '/event/?location=location1,location2',
    ],
    [{ page: 2 }, '/event/?page=2'],
    [{ pageSize: 10 }, '/event/?page_size=10'],
    [
      { publicationStatus: PublicationStatus.Draft },
      '/event/?publication_status=draft',
    ],
    [
      { publisher: ['publisher1', 'publisher2'] },
      '/event/?publisher=publisher1,publisher2',
    ],
    [{ showAll: true }, '/event/?show_all=true'],
    [{ sort: 'start' }, '/event/?sort=start'],
    [{ start: '2020-12-12' }, '/event/?start=2020-12-12'],
    [{ startsAfter: '14' }, '/event/?starts_after=14'],
    [{ startsBefore: '14' }, '/event/?starts_before=14'],
    [{ superEvent: 'hel:123' }, '/event/?super_event=hel:123'],
    [
      { superEventType: ['type1', 'type2'] },
      '/event/?super_event_type=type1,type2',
    ],
    [{ text: 'text' }, '/event/?text=text'],
    [{ translation: 'fi' }, '/event/?translation=fi'],
  ];

  it.each(cases)(
    'should create events request path with args %p, result %p',
    (variables, expectedPath) =>
      expect(eventsPathBuilder({ args: variables })).toBe(expectedPath)
  );

  it('should create correct path for events request', () => {
    const items = [];

    items.forEach(({ args, expectedPath }) => {
      const path = eventsPathBuilder({
        args,
      });
      expect(path).toBe(expectedPath);
    });
  });
});
