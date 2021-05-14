import { EventTypeId, PublicationStatus } from '../../../generated/graphql';
import { eventsPathBuilder } from '../utils';

describe('eventsPathBuilder function', () => {
  it('should create correct path for events request', () => {
    const items = [
      {
        args: { adminUser: true },
        expectedPath: '/event/?admin_user=true',
      },
      {
        args: { combinedText: ['text1', 'text2'] },
        expectedPath: '/event/?combined_text=text1,text2',
      },
      {
        args: { createdBy: 'me' },
        expectedPath: '/event/?created_by=me',
      },
      {
        args: { division: ['division1', 'division2'] },
        expectedPath: '/event/?division=division1,division2',
      },
      {
        args: { end: '2020-12-12' },
        expectedPath: '/event/?end=2020-12-12',
      },
      {
        args: { endsAfter: '14' },
        expectedPath: '/event/?ends_after=14',
      },
      {
        args: { endsBefore: '14' },
        expectedPath: '/event/?ends_before=14',
      },
      {
        args: {
          eventType: [
            EventTypeId.Course,
            EventTypeId.General,
            EventTypeId.Volunteering,
          ],
        },
        expectedPath: '/event/?event_type=Course,General,Volunteering',
      },
      {
        args: { include: ['include1', 'include2'] },
        expectedPath: '/event/?include=include1,include2',
      },
      {
        args: { inLanguage: 'fi' },
        expectedPath: '/event/?in_language=fi',
      },
      {
        args: { isFree: true },
        expectedPath: '/event/?is_free=true',
      },
      {
        args: { isFree: false },
        expectedPath: '/event/?is_free=false',
      },
      {
        args: { keyword: ['keyword1', 'keyword2'] },
        expectedPath: '/event/?keyword=keyword1,keyword2',
      },
      {
        args: { keywordAnd: ['keyword1', 'keyword2'] },
        expectedPath: '/event/?keyword_AND=keyword1,keyword2',
      },
      {
        args: { keywordNot: ['keyword1', 'keyword2'] },
        expectedPath: '/event/?keyword!=keyword1,keyword2',
      },
      {
        args: { language: 'fi' },
        expectedPath: '/event/?language=fi',
      },
      {
        args: { location: ['location1', 'location2'] },
        expectedPath: '/event/?location=location1,location2',
      },
      {
        args: { page: 2 },
        expectedPath: '/event/?page=2',
      },
      {
        args: { pageSize: 10 },
        expectedPath: '/event/?page_size=10',
      },
      {
        args: { publicationStatus: PublicationStatus.Draft },
        expectedPath: '/event/?publication_status=draft',
      },
      {
        args: { publisher: ['publisher1', 'publisher2'] },
        expectedPath: '/event/?publisher=publisher1,publisher2',
      },
      {
        args: { showAll: true },
        expectedPath: '/event/?show_all=true',
      },
      {
        args: { sort: 'start' },
        expectedPath: '/event/?sort=start',
      },
      {
        args: { start: '2020-12-12' },
        expectedPath: '/event/?start=2020-12-12',
      },
      {
        args: { startsAfter: '14' },
        expectedPath: '/event/?starts_after=14',
      },
      {
        args: { startsBefore: '14' },
        expectedPath: '/event/?starts_before=14',
      },
      {
        args: { superEvent: 'hel:123' },
        expectedPath: '/event/?super_event=hel:123',
      },
      {
        args: { superEventType: ['type1', 'type2'] },
        expectedPath: '/event/?super_event_type=type1,type2',
      },
      {
        args: { text: 'text' },
        expectedPath: '/event/?text=text',
      },
      {
        args: { translation: 'fi' },
        expectedPath: '/event/?translation=fi',
      },
    ];

    items.forEach(({ args, expectedPath }) => {
      const path = eventsPathBuilder({
        args,
      });
      expect(path).toBe(expectedPath);
    });
  });
});
