import i18n from 'i18next';

import { ROUTES } from '../../../constants';
import { fakeEnrolment, fakeRegistration } from '../../../utils/mockDataUtils';
import { ENROLMENT_EDIT_ACTIONS, ENROLMENT_SEARCH_PARAMS } from '../constants';
import { EnrolmentSearchParam, EnrolmentSearchParams } from '../types';
import {
  addParamsToEnrolmentQueryString,
  getEditEnrolmentWarning,
  getEnrolmentFields,
  getEnrolmentParamValue,
} from '../utils';

describe('addParamsToEnrolmentQueryString function', () => {
  const cases: [Partial<EnrolmentSearchParams>, string][] = [
    [{ page: 3 }, '?page=3'],
    [{ returnPath: `/fi${ROUTES.SEARCH}` }, '?returnPath=%2Fsearch'],
    [{ text: 'search' }, '?text=search'],
  ];

  it.each(cases)(
    'should add %p params to search, returns %p',
    (params, expectedResult) => {
      expect(addParamsToEnrolmentQueryString('', params)).toBe(expectedResult);
    }
  );
});

describe('getEnrolmentFields function', () => {
  it('should return default values if value is not set', () => {
    const { email, id, name, phoneNumber } = getEnrolmentFields({
      enrolment: fakeEnrolment({
        email: null,
        name: null,
        id: null,
        phoneNumber: null,
      }),
      language: 'fi',
      registration: fakeRegistration(),
    });

    expect(email).toBe('');
    expect(id).toBe('');
    expect(name).toBe('');
    expect(phoneNumber).toBe('');
  });
});

describe('getEnrolmentParamValue function', () => {
  it('should get returnPath without locale', () => {
    expect(
      getEnrolmentParamValue({
        param: ENROLMENT_SEARCH_PARAMS.RETURN_PATH,
        value: `/fi${ROUTES.REGISTRATION_ENROLMENTS}`,
      })
    ).toBe(ROUTES.REGISTRATION_ENROLMENTS);
  });

  it('should throw an error when trying to add unsupported param', () => {
    expect(() =>
      getEnrolmentParamValue({
        param: 'unsupported' as EnrolmentSearchParam,
        value: 'value',
      })
    ).toThrowError();
  });
});

describe('getEditRegistrationWarning function', () => {
  it('should return correct warning if user is not authenticated', () => {
    const allowedActions = [ENROLMENT_EDIT_ACTIONS.EDIT];

    const commonProps = {
      authenticated: false,
      t: i18n.t.bind(i18n),
      userCanDoAction: false,
    };

    allowedActions.forEach((action) => {
      expect(getEditEnrolmentWarning({ action, ...commonProps })).toBe('');
    });

    const deniedActions = [
      ENROLMENT_EDIT_ACTIONS.CANCEL,
      ENROLMENT_EDIT_ACTIONS.SEND_MESSAGE,
    ];

    deniedActions.forEach((action) => {
      expect(getEditEnrolmentWarning({ action, ...commonProps })).toBe(
        'Sinulla ei ole oikeuksia muokata osallistujia.'
      );
    });
  });

  it('should return correct warning if user cannot do action', () => {
    expect(
      getEditEnrolmentWarning({
        authenticated: true,
        t: i18n.t.bind(i18n),
        userCanDoAction: false,
        action: ENROLMENT_EDIT_ACTIONS.CANCEL,
      })
    ).toBe('Sinulla ei ole oikeuksia muokata tätä osallistujaa.');
  });
});
