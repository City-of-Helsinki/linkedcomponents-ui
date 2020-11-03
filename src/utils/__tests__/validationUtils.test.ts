import { createStringError, getStringErrorText } from '../validationUtils';

describe('createStringError', () => {
  it('should return error object', () => {
    const error = { value: 10, key: 'errorkey' };
    expect(createStringError({ value: error.value }, error.key)).toEqual(error);
  });
});

describe('getStringErrorText', () => {
  it('should return error text', () => {
    const t = jest.fn();
    const errorKey = 'errorkey';
    const error = { value: 10, key: errorKey };

    getStringErrorText(errorKey, true, t);
    expect(t).toBeCalledWith(errorKey);

    getStringErrorText(error, true, t);
    expect(t).toBeCalledWith(error.key, error);
  });
});
