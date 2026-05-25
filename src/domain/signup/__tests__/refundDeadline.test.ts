import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';
import { describe, expect, it } from 'vitest';

import { isWithinRefundDeadline } from '../refundDeadline';

describe('isWithinRefundDeadline', () => {
  it('should return false if eventStartTime is null', () => {
    expect(isWithinRefundDeadline(null)).toBe(false);
  });

  it('should return false if eventStartTime is undefined', () => {
    expect(isWithinRefundDeadline(undefined)).toBe(false);
  });

  it('should return false if eventStartTime is invalid', () => {
    expect(isWithinRefundDeadline('invalid-date')).toBe(false);
  });

  it('should return true if current time is within the refund deadline (7 days before event)', () => {
    const futureEventDate = addDays(new Date(), 10);
    expect(isWithinRefundDeadline(futureEventDate.toISOString())).toBe(true);
  });

  it('should return false if current time is past the refund deadline (7 days before event)', () => {
    const nearEventDate = addDays(new Date(), 3);
    expect(isWithinRefundDeadline(nearEventDate.toISOString())).toBe(false);
  });

  it('should return false if event has already started', () => {
    const pastEventDate = subDays(new Date(), 1);
    expect(isWithinRefundDeadline(pastEventDate.toISOString())).toBe(false);
  });

  it('should return true on the boundary (exactly at midnight after deadline)', () => {
    // Event is 8 days from now, deadline is 7 days before event
    // So we're at exactly 1 day after deadline starts, should still be within
    const futureEventDate = addDays(new Date(), 8);
    expect(isWithinRefundDeadline(futureEventDate.toISOString())).toBe(true);
  });

  it('should handle edge case at exactly the deadline boundary', () => {
    // Event is exactly 7 days from now
    const exactDeadlineDate = addDays(new Date(), 7);
    // At this point, we're at the deadline, but not past it yet
    expect(isWithinRefundDeadline(exactDeadlineDate.toISOString())).toBe(true);
  });
});
