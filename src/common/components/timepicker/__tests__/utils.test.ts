import { getTimeObject } from '../utils';

describe('getTimeObject', () => {
  it('should return time object', () => {
    expect(getTimeObject('')).toEqual({ hours: 0, minutes: 0 });
    expect(getTimeObject('12:15')).toEqual({ hours: 12, minutes: 15 });
    expect(getTimeObject('12.15')).toEqual({ hours: 12, minutes: 15 });
    expect(getTimeObject('24.61')).toEqual({ hours: 0, minutes: 0 });
  });
});
