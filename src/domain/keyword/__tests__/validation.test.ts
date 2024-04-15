import { mockString } from '../../../utils/testUtils';
import { KEYWORD_INITIAL_VALUES } from '../constants';
import { KeywordFormFields } from '../types';
import { keywordSchema } from '../validation';

const testKeywordSchema = async (keyword: KeywordFormFields) => {
  try {
    await keywordSchema.validate(keyword);
    return true;
  } catch (e) {
    return false;
  }
};

describe('keywordSchema', () => {
  const validKeywordValues: KeywordFormFields = {
    ...KEYWORD_INITIAL_VALUES,
    originId: '123',
    name: { ...KEYWORD_INITIAL_VALUES.name, fi: 'Name' },
  };

  it('should return true if keyword is valid', async () => {
    expect(await testKeywordSchema(validKeywordValues)).toBe(true);
  });

  const testCases: [Partial<KeywordFormFields>][] = [
    [{ originId: mockString(101) }],
    [{ name: { ...validKeywordValues.name, fi: '' } }],
    [{ name: { ...validKeywordValues.name, ar: mockString(256) } }],
    [{ name: { ...validKeywordValues.name, en: mockString(256) } }],
    [{ name: { ...validKeywordValues.name, fi: mockString(256) } }],
    [{ name: { ...validKeywordValues.name, ru: mockString(256) } }],
    [{ name: { ...validKeywordValues.name, sv: mockString(256) } }],
    [{ name: { ...validKeywordValues.name, zhHans: mockString(256) } }],
  ];
  it.each(testCases)(
    'should return false if keyword is invalid, %s',
    async (keywordOverrides) => {
      expect(
        await testKeywordSchema({
          ...validKeywordValues,
          ...keywordOverrides,
        })
      ).toBe(false);
    }
  );
});
