import { normalizeKey } from '../apolloUtils';

describe('normalizeKey function (broken)', () => {
  it('should normalize key', () => {
    expect(normalizeKey('@event_type')).toBe('atEventType');
    expect(normalizeKey('event_end_date')).toBe('eventEndDate');
  });
});
