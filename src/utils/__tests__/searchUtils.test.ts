import { getSearchQuery } from '../searchUtils';

describe('getSearchQuery', () => {
  it('should get correct search query', () => {
    const query = getSearchQuery({
      array: ['text2', 'text3'],
      boolValue: true,
      number: 1,
      numberArray: [2, 3],
      value: 'text1',
    });

    expect(query).toBe(
      'array=text2&array=text3&boolValue=true&number=1&numberArray=2&numberArray=3&value=text1'
    );
  });
});
