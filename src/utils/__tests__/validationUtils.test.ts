import { getErrorText } from '../validationUtils';

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
