import { advanceTo, clear } from 'jest-date-mock';

import { PublicationStatus } from '../../../../../generated/graphql';
import { fakeEvent } from '../../../../../utils/mockDataUtils';
import { EVENT_EDIT_ACTIONS } from '../../../constants';
import {
  getEventEditAction,
  GetEventEditActionParams,
  getMinBookingDate,
  sortEventTimes,
} from '../utils';

afterEach(() => clear());

describe('getEventEditAction function', () => {
  const testCases: [EVENT_EDIT_ACTIONS, GetEventEditActionParams][] = [
    [EVENT_EDIT_ACTIONS.DELETE, { action: 'delete', event: fakeEvent() }],
    [
      EVENT_EDIT_ACTIONS.UPDATE_DRAFT,
      {
        action: 'update',
        event: fakeEvent({ publicationStatus: PublicationStatus.Draft }),
      },
    ],
    [
      EVENT_EDIT_ACTIONS.UPDATE_PUBLIC,
      {
        action: 'update',
        event: fakeEvent({ publicationStatus: PublicationStatus.Public }),
      },
    ],
  ];
  it.each(testCases)(
    'should get correct action, returns %p',
    (expectedAction, params) =>
      expect(getEventEditAction(params)).toBe(expectedAction)
  );
});

describe('getMinBookingDate function', () => {
  it('should get correct minBooking date when date is string', () => {
    advanceTo('2021-05-11');
    expect(getMinBookingDate('2021-05-12T15:00:00.000Z')).toEqual(
      new Date('2021-05-12T15:00:00.000Z')
    );
  });

  it('should return current date if date is in the past', () => {
    advanceTo('2021-05-11');
    expect(getMinBookingDate('2021-05-10T15:00:00.000Z')).toEqual(
      new Date('2021-05-11')
    );
  });
});

describe('sortEventTimes function', () => {
  it('should sort event times', () => {
    const eventTime1 = {
      endTime: new Date('2021-05-12T15:00:00.000Z'),
      id: '1',
      startTime: new Date('2021-05-02T12:00:00.000Z'),
    };
    const eventTime2 = {
      endTime: null,
      id: '2',
      startTime: null,
    };
    const eventTime3 = {
      endTime: new Date('2021-05-12T15:00:00.000Z'),
      id: '3',
      startTime: new Date('2021-05-03T12:00:00.000Z'),
    };
    const eventTime4 = {
      endTime: new Date('2021-05-13T15:00:00.000Z'),
      id: '4',
      startTime: new Date('2021-05-02T12:00:00.000Z'),
    };
    const eventTime5 = {
      endTime: new Date('2021-05-11T15:00:00.000Z'),
      id: '5',
      startTime: new Date('2021-05-02T12:00:00.000Z'),
    };

    expect(
      [eventTime1, eventTime2, eventTime3, eventTime4, eventTime5].sort(
        sortEventTimes
      )
    ).toEqual([eventTime5, eventTime1, eventTime4, eventTime3, eventTime2]);
  });
});
