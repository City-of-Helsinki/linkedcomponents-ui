import formatDate from '../formatDate';

test('should format date value', () => {
  expect(formatDate(null)).toBe('');

  expect(formatDate(new Date('2019-11-08T12:27:34+00:00'))).toBe('8.11.2019');

  expect(
    formatDate(new Date('2019-11-08T12:27:34+00:00'), 'dd.MM.yyy hh:mm')
  ).toBe('08.11.2019 12:27');
});
