import { yupToFormErrors } from 'formik';
import { advanceTo, clear } from 'jest-date-mock';

import { EMPTY_MULTI_LANGUAGE_OBJECT } from '../../../constants';
import { VALIDATION_MESSAGE_KEYS } from '../../app/i18n/constants';
import { TEST_KEYWORD_ID } from '../../keyword/constants';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import { TEST_PLACE_ID } from '../../place/constants';
import { EVENT_INITIAL_VALUES } from '../constants';
import { EventFormFields, EventTimeFormFields } from '../types';
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

afterEach(() => {
  clear();
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

  test('should return true if event time is valid', async () => {
    advanceTo('2022-11-07');
    expect(await testEventTimeSchema(validEventTime)).toBe(true);
  });

  test('should return false if start date is missing', async () => {
    advanceTo('2022-11-07');
    expect(
      await testEventTimeSchema({ ...validEventTime, startDate: null })
    ).toBe(false);
  });

  test('should return false if start time is missing', async () => {
    advanceTo('2022-11-07');
    expect(
      await testEventTimeSchema({ ...validEventTime, startTime: '' })
    ).toBe(false);
  });

  test('should return false if end date is missing', async () => {
    advanceTo('2022-11-07');
    expect(
      await testEventTimeSchema({ ...validEventTime, endDate: null })
    ).toBe(false);
  });

  test('should return false if end time is missing', async () => {
    advanceTo('2022-11-07');
    expect(await testEventTimeSchema({ ...validEventTime, endTime: '' })).toBe(
      false
    );
  });

  test('should return false if end time is not in the future', async () => {
    advanceTo('2022-11-07');
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
    advanceTo('2022-11-07');
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
