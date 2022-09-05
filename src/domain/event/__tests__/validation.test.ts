import { yupToFormErrors } from 'formik';

import { EMPTY_MULTI_LANGUAGE_OBJECT } from '../../../constants';
import { VALIDATION_MESSAGE_KEYS } from '../../app/i18n/constants';
import { TEST_KEYWORD_ID } from '../../keyword/constants';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import { TEST_PLACE_ID } from '../../place/constants';
import { EVENT_INITIAL_VALUES } from '../constants';
import { EventFormFields } from '../types';
import { getEmptyOffer } from '../utils';
import { publicEventSchema } from '../validation';

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
