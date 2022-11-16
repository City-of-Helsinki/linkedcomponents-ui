import addMinutes from 'date-fns/addMinutes';
import { advanceTo, clear } from 'jest-date-mock';

import { fakeSeatsReservation } from '../../../utils/mockDataUtils';
import { getRegistrationTimeLeft, isSeatsReservationExpired } from '../utils';

afterEach(() => {
  clear();
});

describe('isSeatsReservationExpired function', () => {
  it('should return true if expiration is not defined', () => {
    expect(isSeatsReservationExpired({ expiration: '' })).toEqual(true);
  });

  it('should return true is expiration is in the pase', () => {
    advanceTo('2022-10-10');

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
    advanceTo('2022-10-10');

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
    advanceTo('2022-10-10');

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
