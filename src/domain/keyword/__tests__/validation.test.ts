import { mockString } from '../../../utils/testUtils';
import { KEYWORD_FIELDS, KEYWORD_INITIAL_VALUES } from '../constants';
import { KeywordFormFields } from '../types';
import { getFocusableKeywordFieldId, keywordSchema } from '../validation';

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

describe('getFocusableKeywordFieldId', () => {
  it.each([
    [KEYWORD_FIELDS.ID, { fieldId: 'id', type: 'default' }],
    [KEYWORD_FIELDS.DATA_SOURCE, { fieldId: 'dataSource', type: 'default' }],
    [
      KEYWORD_FIELDS.PUBLISHER,
      { fieldId: 'publisher-input', type: 'combobox' },
    ],
    [
      KEYWORD_FIELDS.REPLACED_BY,
      { fieldId: 'replacedBy-toggle-button', type: 'select' },
    ],
  ])(
    'should return corrent field id and type',
    (fieldName, expectedIdAndType) => {
      expect(getFocusableKeywordFieldId(fieldName)).toEqual(expectedIdAndType);
    }
  );
});
