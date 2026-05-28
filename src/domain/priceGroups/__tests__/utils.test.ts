import i18n from 'i18next';

import { getBooleanText } from '../utils';

describe('getBooleanText function', () => {
  it.each([
    [false, 'Ei'],
    [true, 'Kyllä'],
  ])('should return correct text, $s ->4s ', (val, expectedText) => {
    expect(getBooleanText(val, i18n.t.bind(i18n))).toBe(expectedText);
  });
});
