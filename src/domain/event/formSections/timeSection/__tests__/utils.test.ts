import { sortEventTimes } from '../utils';

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
