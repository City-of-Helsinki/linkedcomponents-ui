import formatDateAndTimeForApi from '../formatDateAndTimeForApi';

test('should return date with time', () => {
  expect(formatDateAndTimeForApi('', '')).toBe(null);
  expect(formatDateAndTimeForApi('invalid-date', '')).toBe(null);

  expect(formatDateAndTimeForApi('2019-11-08T12:27:34+00:00', '')).toBe(
    '2019-11-08T00:00:00.000Z'
  );
  expect(
    formatDateAndTimeForApi(new Date('2019-11-08T12:27:34+00:00'), '')
  ).toBe('2019-11-08T00:00:00.000Z');

  expect(
    formatDateAndTimeForApi(new Date('2019-11-08T12:27:34+00:00'), '12:12')
  ).toBe('2019-11-08T12:12:00.000Z');
});
