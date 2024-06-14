import { mockString } from '../../../utils/testUtils';
import {
  KEYWORD_SET_FIELDS,
  KEYWORD_SET_INITIAL_VALUES,
  TEST_KEYWORD_SET_ID,
} from '../constants';
import { KeywordSetFormFields } from '../types';
import { getFocusableKeywordSetFieldId, keywordSetSchema } from '../validation';

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

  it('should return true if originId is missing but there is id', async () => {
    expect(
      await testKeywordSetSchema({
        ...validKeywordSetValues,
        id: TEST_KEYWORD_SET_ID,
        originId: '',
      })
    ).toBe(true);
  });

  const testCases: [Partial<KeywordSetFormFields>][] = [
    [{ originId: '' }],
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

describe('getFocusableKeywordSetFieldId', () => {
  it.each([
    [
      KEYWORD_SET_FIELDS.DATA_SOURCE,
      { fieldId: 'dataSource', type: 'default' },
    ],
    [KEYWORD_SET_FIELDS.ID, { fieldId: 'id', type: 'default' }],
    [
      KEYWORD_SET_FIELDS.KEYWORDS,
      { fieldId: 'keywords-toggle-button', type: 'select' },
    ],
    [KEYWORD_SET_FIELDS.NAME, { fieldId: 'name', type: 'default' }],
    [
      KEYWORD_SET_FIELDS.ORGANIZATION,
      { fieldId: 'organization-toggle-button', type: 'select' },
    ],
    [KEYWORD_SET_FIELDS.ORIGIN_ID, { fieldId: 'originId', type: 'default' }],
    [
      KEYWORD_SET_FIELDS.USAGE,
      { fieldId: 'usage-toggle-button', type: 'select' },
    ],
  ])('should return corrent field id', (fieldName, expectedId) => {
    expect(getFocusableKeywordSetFieldId(fieldName)).toEqual(expectedId);
  });
});
