import { normalizeKey } from '../apolloUtils';

describe('normalizeKey function', () => {
  it('should normalize key', () => {
    expect(normalizeKey('@event_type')).toBe('internalEventType');
    expect(normalizeKey('event_end_date')).toBe('eventEndDate');
  });
});
