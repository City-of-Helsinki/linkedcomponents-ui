import { mockString } from '../../../utils/testUtils';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import { PLACE_INITIAL_VALUES } from '../constants';
import { PlaceFormFields } from '../types';
import { placeSchema } from '../validation';

const testPlaceSchema = async (image: PlaceFormFields) => {
  try {
    await placeSchema.validate(image);
    return true;
  } catch (e) {
    return false;
  }
};

describe('placeSchema', () => {
  const validPlaceValues: PlaceFormFields = {
    ...PLACE_INITIAL_VALUES,
    name: { ...PLACE_INITIAL_VALUES.name, fi: 'Name' },
    originId: '123',
    publisher: TEST_PUBLISHER_ID,
  };

  it('should return true if place is valid', async () => {
    expect(await testPlaceSchema(validPlaceValues)).toBe(true);
  });

  const testCases: [Partial<PlaceFormFields>][] = [
    [{ originId: '' }],
    [{ originId: mockString(101) }],
    [{ publisher: '' }],
    [{ name: { ...validPlaceValues.name, fi: '' } }],
    [{ name: { ...validPlaceValues.name, ar: mockString(256) } }],
    [{ name: { ...validPlaceValues.name, en: mockString(256) } }],
    [{ name: { ...validPlaceValues.name, fi: mockString(256) } }],
    [{ name: { ...validPlaceValues.name, ru: mockString(256) } }],
    [{ name: { ...validPlaceValues.name, sv: mockString(256) } }],
    [{ name: { ...validPlaceValues.name, zhHans: mockString(256) } }],
    [{ infoUrl: { ...validPlaceValues.infoUrl, ar: 'invalid-url' } }],
    [{ infoUrl: { ...validPlaceValues.infoUrl, en: 'invalid-url' } }],
    [{ infoUrl: { ...validPlaceValues.infoUrl, fi: 'invalid-url' } }],
    [{ infoUrl: { ...validPlaceValues.infoUrl, ru: 'invalid-url' } }],
    [{ infoUrl: { ...validPlaceValues.infoUrl, sv: 'invalid-url' } }],
    [{ infoUrl: { ...validPlaceValues.infoUrl, zhHans: 'invalid-url' } }],
    [{ email: 'invalid-email' }],
    [{ telephone: { ...validPlaceValues.telephone, ar: 'invalid-phone' } }],
    [{ telephone: { ...validPlaceValues.telephone, en: 'invalid-phone' } }],
    [{ telephone: { ...validPlaceValues.telephone, fi: 'invalid-phone' } }],
    [{ telephone: { ...validPlaceValues.telephone, ru: 'invalid-phone' } }],
    [{ telephone: { ...validPlaceValues.telephone, sv: 'invalid-phone' } }],
    [{ telephone: { ...validPlaceValues.telephone, zhHans: 'invalid-phone' } }],
    [{ contactType: mockString(256) }],
    [
      {
        streetAddress: {
          ...validPlaceValues.streetAddress,
          ar: mockString(256),
        },
      },
    ],
    [
      {
        streetAddress: {
          ...validPlaceValues.streetAddress,
          en: mockString(256),
        },
      },
    ],
    [
      {
        streetAddress: {
          ...validPlaceValues.streetAddress,
          fi: mockString(256),
        },
      },
    ],
    [
      {
        streetAddress: {
          ...validPlaceValues.streetAddress,
          ru: mockString(256),
        },
      },
    ],
    [
      {
        streetAddress: {
          ...validPlaceValues.streetAddress,
          sv: mockString(256),
        },
      },
    ],
    [
      {
        streetAddress: {
          ...validPlaceValues.streetAddress,
          zhHans: mockString(256),
        },
      },
    ],

    [
      {
        addressLocality: {
          ...validPlaceValues.addressLocality,
          ar: mockString(256),
        },
      },
    ],
    [
      {
        addressLocality: {
          ...validPlaceValues.addressLocality,
          en: mockString(256),
        },
      },
    ],
    [
      {
        addressLocality: {
          ...validPlaceValues.addressLocality,
          fi: mockString(256),
        },
      },
    ],
    [
      {
        addressLocality: {
          ...validPlaceValues.addressLocality,
          ru: mockString(256),
        },
      },
    ],
    [
      {
        addressLocality: {
          ...validPlaceValues.addressLocality,
          sv: mockString(256),
        },
      },
    ],
    [
      {
        addressLocality: {
          ...validPlaceValues.addressLocality,
          zhHans: mockString(256),
        },
      },
    ],
    [{ addressRegion: mockString(256) }],
    [{ postalCode: mockString(129) }],
    [{ postOfficeBoxNum: mockString(256) }],
  ];
  it.each(testCases)(
    'should return false if place is invalid, %s',
    async (placeOverrides) => {
      expect(
        await testPlaceSchema({
          ...validPlaceValues,
          ...placeOverrides,
        })
      ).toBe(false);
    }
  );
});
