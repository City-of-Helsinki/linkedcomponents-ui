import { yupToFormErrors } from 'formik';

import { EMPTY_MULTI_LANGUAGE_OBJECT } from '../../../constants';
import { VALIDATION_MESSAGE_KEYS } from '../../app/i18n/constants';
import { TEST_KEYWORD_ID } from '../../keyword/constants';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import { TEST_PLACE_ID } from '../../place/constants';
import { EVENT_INITIAL_VALUES } from '../constants';
import { EventFormFields, EventTimeFormFields, OfferFields } from '../types';
import { getEmptyOffer } from '../utils';
import { eventTimeSchema, publicEventSchema } from '../validation';

const testEventTimeSchema = async (eventTime: EventTimeFormFields) => {
  try {
    await eventTimeSchema.validate(eventTime);
    return true;
  } catch (e) {
    return false;
  }
};

const testPublicEventSchema = async (event: EventFormFields) => {
  try {
    await publicEventSchema.validate(event);
    return true;
  } catch (e) {
    return false;
  }
};

afterEach(() => {
  vi.useRealTimers();
});

describe('publiEventSchema', () => {
  const requiredValues: EventFormFields = {
    ...EVENT_INITIAL_VALUES,
    description: { ...EMPTY_MULTI_LANGUAGE_OBJECT, fi: 'Description' },
    eventTimes: [{ endTime: new Date(), id: '', startTime: new Date() }],
    isVerified: true,
    keywords: [TEST_KEYWORD_ID],
    location: TEST_PLACE_ID,
    mainCategories: [TEST_KEYWORD_ID],
    name: { ...EMPTY_MULTI_LANGUAGE_OBJECT, fi: 'Name' },
    publisher: TEST_PUBLISHER_ID,
    shortDescription: {
      ...EMPTY_MULTI_LANGUAGE_OBJECT,
      fi: 'Short description',
    },
  };

  const validOffer: OfferFields = {
    infoUrl: EMPTY_MULTI_LANGUAGE_OBJECT,
    description: EMPTY_MULTI_LANGUAGE_OBJECT,
    offerPriceGroups: [],
    price: { ...EMPTY_MULTI_LANGUAGE_OBJECT, fi: 'Price' },
  };
  const validPriceGroup = {
    id: 1,
    priceGroup: '1',
    price: '10.00',
    vatPercentage: '24.00',
  };

  it('should return correct errors for default initial values', async () => {
    try {
      await publicEventSchema.validate(EVENT_INITIAL_VALUES, {
        abortEarly: false,
      });
    } catch (e) {
      expect(yupToFormErrors(e)).toEqual({
        description: { fi: VALIDATION_MESSAGE_KEYS.STRING_REQUIRED },
        eventTimes: 'form.validation.eventTimesRequired',
        isVerified: 'form.validation.eventInfoVerified',
        keywords: 'form.validation.keywordRequired',
        location: VALIDATION_MESSAGE_KEYS.STRING_REQUIRED,
        mainCategories: 'form.validation.mainCategoryRequired',
        name: { fi: VALIDATION_MESSAGE_KEYS.STRING_REQUIRED },
        publisher: VALIDATION_MESSAGE_KEYS.STRING_REQUIRED,
        shortDescription: { fi: VALIDATION_MESSAGE_KEYS.STRING_REQUIRED },
      });
    }
  });

  it('should return correct errors for offers', async () => {
    const values = {
      ...requiredValues,
      hasPrice: false,
      offers: [{ ...getEmptyOffer(), infoUrl: { fi: 'invalid' } }],
    };

    try {
      await publicEventSchema.validate(values, { abortEarly: false });
    } catch (e) {
      expect(yupToFormErrors(e)).toEqual({
        offers: [{ infoUrl: { fi: 'form.validation.string.url' } }],
      });
    }
  });

  it('should return true is offer_price_group is valid', async () => {
    const values: EventFormFields = {
      ...requiredValues,
      hasPrice: true,
      isRegistrationPlanned: true,
      offers: [
        {
          ...validOffer,
          offerPriceGroups: [validPriceGroup],
        },
      ],
    };

    expect(await testPublicEventSchema(values)).toBeTruthy();
  });

  it('should return false is offer_price_group is invalid', async () => {
    const values: EventFormFields = {
      ...requiredValues,
      hasPrice: true,
      isRegistrationPlanned: true,
      offers: [
        {
          ...validOffer,
          offerPriceGroups: [{ ...validPriceGroup, price: '' }],
        },
      ],
    };

    expect(await testPublicEventSchema(values)).toBeFalsy();
  });

  it('should validate only first offer for free event', async () => {
    const values = {
      ...requiredValues,
      hasPrice: false,
      offers: [
        getEmptyOffer(),
        { ...getEmptyOffer(), infoUrl: { fi: 'invalid' } },
      ],
    };

    expect(
      await publicEventSchema.validate(values, { abortEarly: false })
    ).toEqual({
      ...values,
      audienceMaxAge: null,
      audienceMinAge: null,
      maximumAttendeeCapacity: null,
      minimumAttendeeCapacity: null,
    });
  });
});

describe('event time validation', () => {
  const validEventTime: EventTimeFormFields = {
    endDate: new Date('2022-11-09'),
    endTime: '15:00',
    startDate: new Date('2022-11-08'),
    startTime: '12:00',
  };

  beforeEach(() => {
    vi.setSystemTime('2022-11-07');
  });

  test('should return true if event time is valid', async () => {
    expect(await testEventTimeSchema(validEventTime)).toBe(true);
  });

  test('should return false if start date is missing', async () => {
    expect(
      await testEventTimeSchema({ ...validEventTime, startDate: null })
    ).toBe(false);
  });

  test('should return false if start time is missing', async () => {
    expect(
      await testEventTimeSchema({ ...validEventTime, startTime: '' })
    ).toBe(false);
  });

  test('should return false if end date is missing', async () => {
    expect(
      await testEventTimeSchema({ ...validEventTime, endDate: null })
    ).toBe(false);
  });

  test('should return false if end time is missing', async () => {
    expect(await testEventTimeSchema({ ...validEventTime, endTime: '' })).toBe(
      false
    );
  });

  test('should return false if end time is not in the future', async () => {
    expect(
      await testEventTimeSchema({
        endDate: new Date('2022-11-05'),
        endTime: '15:00',
        startDate: new Date('2022-11-04'),
        startTime: '12:00',
      })
    ).toBe(false);
  });

  test('should return false if end time is before start time', async () => {
    expect(
      await testEventTimeSchema({
        endDate: new Date('2022-11-11'),
        endTime: '15:00',
        startDate: new Date('2022-11-12'),
        startTime: '12:00',
      })
    ).toBe(false);
  });
});
