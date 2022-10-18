/* eslint-disable max-len */
import { getErrorText, isValidDateText, isValidUrl } from '../validationUtils';

describe('getErrorText', () => {
  it('should return error text', () => {
    const t = jest.fn();
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
