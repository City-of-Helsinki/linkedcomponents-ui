import { mockString } from '../../../utils/testUtils';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import { IMAGE_INITIAL_VALUES } from '../constants';
import { ImageFormFields } from '../types';
import { imageSchema } from '../validation';

const testImageSchema = async (image: ImageFormFields) => {
  try {
    await imageSchema.validate(image);
    return true;
  } catch (e) {
    return false;
  }
};

describe('imageSchema', () => {
  const validImageValues: ImageFormFields = {
    ...IMAGE_INITIAL_VALUES,
    altText: { ...IMAGE_INITIAL_VALUES.altText, fi: 'Alt text' },
    name: 'Image name',
    publisher: TEST_PUBLISHER_ID,
  };

  it('should return true if image is valid', async () => {
    expect(await testImageSchema(validImageValues)).toBe(true);
  });

  const testCases: [Partial<ImageFormFields>][] = [
    [{ altText: { ...validImageValues.altText, fi: '' } }],
    [{ altText: { ...validImageValues.altText, ar: mockString(321) } }],
    [{ altText: { ...validImageValues.altText, ar: mockString(5) } }],
    [{ altText: { ...validImageValues.altText, en: mockString(321) } }],
    [{ altText: { ...validImageValues.altText, en: mockString(5) } }],
    [{ altText: { ...validImageValues.altText, fi: mockString(321) } }],
    [{ altText: { ...validImageValues.altText, fi: mockString(5) } }],
    [{ altText: { ...validImageValues.altText, ru: mockString(321) } }],
    [{ altText: { ...validImageValues.altText, ru: mockString(5) } }],
    [{ altText: { ...validImageValues.altText, sv: mockString(321) } }],
    [{ altText: { ...validImageValues.altText, sv: mockString(5) } }],
    [{ altText: { ...validImageValues.altText, zhHans: mockString(321) } }],
    [{ altText: { ...validImageValues.altText, zhHans: mockString(5) } }],
    [{ name: mockString(256) }],
    [{ photographerName: mockString(256) }],
    [{ publisher: '' }],
  ];
  it.each(testCases)(
    'should return false if image is invalid, %s',
    async (imageOverrides) => {
      expect(
        await testImageSchema({
          ...validImageValues,
          ...imageOverrides,
        })
      ).toBe(false);
    }
  );
});
