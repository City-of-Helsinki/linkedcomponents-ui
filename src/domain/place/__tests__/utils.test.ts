import { fakePlace } from '../../../utils/mockDataUtils';
import { getPlaceFields, placePathBuilder, placesPathBuilder } from '../utils';

describe('getPlaceFields function', () => {
  it('should return default values if value is not set', () => {
    const { atId, dataSource, id, nEvents } = getPlaceFields(
      fakePlace({ atId: null, dataSource: null, id: null, nEvents: null }),
      'fi'
    );
    expect(atId).toBe('');
    expect(dataSource).toBe('');
    expect(id).toBe('');
    expect(nEvents).toBe(0);
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
