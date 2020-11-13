import { keywordPathBuilder, keywordsPathBuilder } from '../utils';

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
