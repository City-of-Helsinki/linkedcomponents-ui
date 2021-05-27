import {
  EventsQueryVariables,
  EventTypeId,
  PublicationStatus,
} from '../../../generated/graphql';
import { eventsPathBuilder } from '../utils';

describe('eventsPathBuilder function', () => {
  const cases: [EventsQueryVariables, string][] = [
    [
      { adminUser: true },
      '/event/?admin_user=true&event_type=General,Course,Volunteering',
    ],
    [
      { combinedText: ['text1', 'text2'] },
      '/event/?combined_text=text1,text2&event_type=General,Course,Volunteering',
    ],
    [
      { createdBy: 'me' },
      '/event/?created_by=me&event_type=General,Course,Volunteering',
    ],
    [
      { division: ['division1', 'division2'] },
      '/event/?division=division1,division2&event_type=General,Course,Volunteering',
    ],
    [
      { end: '2020-12-12' },
      '/event/?end=2020-12-12&event_type=General,Course,Volunteering',
    ],
    [
      { endsAfter: '14' },
      '/event/?ends_after=14&event_type=General,Course,Volunteering',
    ],
    [
      { endsBefore: '14' },
      '/event/?ends_before=14&event_type=General,Course,Volunteering',
    ],
    [
      {
        eventType: [EventTypeId.Course, EventTypeId.General],
      },
      '/event/?event_type=Course,General',
    ],
    [
      { include: ['include1', 'include2'] },
      '/event/?event_type=General,Course,Volunteering&include=include1,include2',
    ],
    [
      { inLanguage: 'fi' },
      '/event/?event_type=General,Course,Volunteering&in_language=fi',
    ],
    [
      { isFree: true },
      '/event/?event_type=General,Course,Volunteering&is_free=true',
    ],
    [
      { isFree: false },
      '/event/?event_type=General,Course,Volunteering&is_free=false',
    ],
    [
      { keyword: ['keyword1', 'keyword2'] },
      '/event/?event_type=General,Course,Volunteering&keyword=keyword1,keyword2',
    ],
    [
      { keywordAnd: ['keyword1', 'keyword2'] },
      '/event/?event_type=General,Course,Volunteering&keyword_AND=keyword1,keyword2',
    ],
    [
      { keywordNot: ['keyword1', 'keyword2'] },
      '/event/?event_type=General,Course,Volunteering&keyword!=keyword1,keyword2',
    ],
    [
      { language: 'fi' },
      '/event/?event_type=General,Course,Volunteering&language=fi',
    ],
    [
      { location: ['location1', 'location2'] },
      '/event/?event_type=General,Course,Volunteering&location=location1,location2',
    ],
    [{ page: 2 }, '/event/?event_type=General,Course,Volunteering&page=2'],
    [
      { pageSize: 10 },
      '/event/?event_type=General,Course,Volunteering&page_size=10',
    ],
    [
      { publicationStatus: PublicationStatus.Draft },
      '/event/?event_type=General,Course,Volunteering&publication_status=draft',
    ],
    [
      { publisher: ['publisher1', 'publisher2'] },
      '/event/?event_type=General,Course,Volunteering&publisher=publisher1,publisher2',
    ],
    [
      { showAll: true },
      '/event/?event_type=General,Course,Volunteering&show_all=true',
    ],
    [
      { sort: 'start' },
      '/event/?event_type=General,Course,Volunteering&sort=start',
    ],
    [
      { start: '2020-12-12' },
      '/event/?event_type=General,Course,Volunteering&start=2020-12-12',
    ],
    [
      { startsAfter: '14' },
      '/event/?event_type=General,Course,Volunteering&starts_after=14',
    ],
    [
      { startsBefore: '14' },
      '/event/?event_type=General,Course,Volunteering&starts_before=14',
    ],
    [
      { superEvent: 'hel:123' },
      '/event/?event_type=General,Course,Volunteering&super_event=hel:123',
    ],
    [
      { superEventType: ['type1', 'type2'] },
      '/event/?event_type=General,Course,Volunteering&super_event_type=type1,type2',
    ],
    [
      { text: 'text' },
      '/event/?event_type=General,Course,Volunteering&text=text',
    ],
    [
      { translation: 'fi' },
      '/event/?event_type=General,Course,Volunteering&translation=fi',
    ],
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
