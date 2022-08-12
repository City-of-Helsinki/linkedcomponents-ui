import { getErrorText, isValidDateText } from '../validationUtils';

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
