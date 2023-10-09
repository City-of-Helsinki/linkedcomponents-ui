import addMinutes from 'date-fns/addMinutes';
import { vi } from 'vitest';

import { SeatsReservation } from '../../../generated/graphql';
import { fakeSeatsReservation } from '../../../utils/mockDataUtils';
import { getRegistrationTimeLeft, isSeatsReservationExpired } from '../utils';

afterEach(() => {
  vi.useRealTimers();
});

describe('isSeatsReservationExpired function', () => {
  it('should return true if expiration is not defined', () => {
    expect(
      isSeatsReservationExpired({ expiration: '' } as SeatsReservation)
    ).toEqual(true);
  });

  it('should return true is expiration is in the pase', () => {
    vi.setSystemTime('2022-10-10');

    const timestamp = new Date('2022-10-09').toISOString();
    expect(
      isSeatsReservationExpired(
        fakeSeatsReservation({
          expiration: addMinutes(new Date(timestamp), 30).toISOString(),
          timestamp,
        })
      )
    ).toEqual(true);
  });

  it('should return false is expiration is in the future', () => {
    vi.setSystemTime('2022-10-10');

    const timestamp = new Date('2022-10-10').toISOString();
    expect(
      isSeatsReservationExpired(
        fakeSeatsReservation({
          expiration: addMinutes(new Date(timestamp), 30).toISOString(),
          timestamp,
        })
      )
    ).toEqual(false);
  });
});

describe('getRegistrationTimeLeft function', () => {
  it('should return 0 if data is null', () => {
    expect(getRegistrationTimeLeft(null)).toEqual(0);
  });

  it('should return correct registration time left value', () => {
    vi.setSystemTime('2022-10-10');

    const timestamp = new Date('2022-10-10').toISOString();
    expect(
      getRegistrationTimeLeft(
        fakeSeatsReservation({
          expiration: addMinutes(new Date(timestamp), 30).toISOString(),
          timestamp,
        })
      )
    ).toEqual(1800);
  });
});
