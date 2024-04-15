import { mockString } from '../../../utils/testUtils';
import { KEYWORD_SET_INITIAL_VALUES } from '../constants';
import { KeywordSetFormFields } from '../types';
import { keywordSetSchema } from '../validation';

const testKeywordSetSchema = async (keywordSet: KeywordSetFormFields) => {
  try {
    await keywordSetSchema.validate(keywordSet);
    return true;
  } catch (e) {
    return false;
  }
};

describe('keywordSetSchema', () => {
  const validKeywordSetValues: KeywordSetFormFields = {
    ...KEYWORD_SET_INITIAL_VALUES,
    originId: '123',
    name: { ...KEYWORD_SET_INITIAL_VALUES.name, fi: 'Name' },
    keywords: ['keyword'],
    usage: 'any',
  };

  it('should return true if keyword set is valid', async () => {
    expect(await testKeywordSetSchema(validKeywordSetValues)).toBe(true);
  });

  const testCases: [Partial<KeywordSetFormFields>][] = [
    [{ originId: mockString(101) }],
    [{ name: { ...validKeywordSetValues.name, fi: '' } }],
    [{ name: { ...validKeywordSetValues.name, ar: mockString(256) } }],
    [{ name: { ...validKeywordSetValues.name, en: mockString(256) } }],
    [{ name: { ...validKeywordSetValues.name, fi: mockString(256) } }],
    [{ name: { ...validKeywordSetValues.name, ru: mockString(256) } }],
    [{ name: { ...validKeywordSetValues.name, sv: mockString(256) } }],
    [{ name: { ...validKeywordSetValues.name, zhHans: mockString(256) } }],
    [{ keywords: [] }],
    [{ usage: '' }],
  ];
  it.each(testCases)(
    'should return false if keyword set is invalid, %s',
    async (keywordSetOverrides) => {
      expect(
        await testKeywordSetSchema({
          ...validKeywordSetValues,
          ...keywordSetOverrides,
        })
      ).toBe(false);
    }
  );
});
