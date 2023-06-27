import { filterUnselectedLanguages } from '../filterUnselectedLanguages';

describe('filterUnselectedLanguages function', () => {
  it('should set data as null for unselected languages', () => {
    expect(
      filterUnselectedLanguages(
        {
          fi: 'Value 1',
          sv: 'Value 2',
        },
        ['fi']
      )
    ).toEqual({
      fi: 'Value 1',
      sv: null,
    });
  });
});
