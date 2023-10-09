/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import { vi } from 'vitest';

import {
  getErrorText,
  isValidDateText,
  isValidPhoneNumber,
  isValidUrl,
} from '../validationUtils';

describe('getErrorText', () => {
  it('should return error text', () => {
    const t = vi.fn() as any;
    const errorKey = 'errorkey';
    const error = { value: 10, key: errorKey };

    getErrorText(errorKey, true, t);
    expect(t).toBeCalledWith(errorKey);

    getErrorText(error, true, t);
    expect(t).toBeCalledWith(error.key, error);
  });
});

describe('isValidDateText', () => {
  it('should return false if date text is invalid', () => {
    expect(isValidDateText('12.13.2021')).toBe(false);
    expect(isValidDateText('32.12.2021')).toBe(false);
    expect(isValidDateText('12.12.20')).toBe(false);
  });

  it('should return true if date text is valid or empty', () => {
    expect(isValidDateText('')).toBe(true);
    expect(isValidDateText('12.12.2021')).toBe(true);
  });
});

describe('isValidUrl', () => {
  it('should return false if url is invalid', () => {
    expect(isValidUrl('google.com')).toBe(false);
    expect(isValidUrl('www.google.com')).toBe(false);
  });

  it('should return true if url is valid or empty', () => {
    expect(isValidUrl('')).toBe(true);
    expect(isValidUrl('http://google.com')).toBe(true);
    expect(isValidUrl('https://google.com')).toBe(true);
    expect(
      isValidUrl(
        'https://teams.microsoft.com/l/meetup-join/19%3Ameeting_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx%40thread.v2/0?context={"Tid"%3A"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"%2C"Oid"%3A"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"%2C"IsBroadcastMeeting"%3Atrue%2C"role"%3A"a"}&btype=a&role=a'
      )
    ).toBe(true);
  });
});

describe('isValidPhoneNumber function', () => {
  const validCases: string[][] = [
    ['0441234567'],
    ['044 1234 567'],
    ['044 123 4567'],
    ['044 1234567'],
    ['+358441234567'],
    ['+358 44 123 4567'],
    ['+358 44 1234 567'],
    ['+358 441234567'],
  ];
  test.each(validCases)(
    'should return true value if phone number is valid, %p',
    async (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(true);
    }
  );

  const invalidCases: string[][] = [
    ['044  1234 56x'],
    ['044  123x 567'],
    ['04x  1234 567'],
    ['044  1234 567'],
    ['044 123  4567'],
    ['044  1234567'],
    ['+358  44 123 4567'],
    ['+358 44  123 4567'],
    ['+358 44 1234  567'],
    ['+358  441234567'],
  ];
  test.each(invalidCases)(
    'should return false value if phone number is invalid, %p',
    async (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(false);
    }
  );
});
