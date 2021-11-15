import i18n from 'i18next';

import { EnrolmentsQueryVariables } from '../../../generated/graphql';
import { fakeEnrolment, fakeRegistration } from '../../../utils/mockDataUtils';
import { ENROLMENT_EDIT_ACTIONS } from '../constants';
import {
  enrolmentsPathBuilder,
  getEditEnrolmentWarning,
  getEnrolmentFields,
} from '../utils';

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

describe('enrolmentsPathBuilder function', () => {
  const cases: [EnrolmentsQueryVariables, string][] = [
    [{ page: 2 }, '/enrolment/?page=2'],
    [{ pageSize: 10 }, '/enrolment/?page_size=10'],
    [
      { registration: 'registration:1' },
      '/enrolment/?registration=registration:1',
    ],
    [{ text: 'text' }, '/enrolment/?text=text'],
  ];

  it.each(cases)(
    'should create enrolments request path with args %p, result %p',
    (variables, expectedPath) =>
      expect(enrolmentsPathBuilder({ args: variables })).toBe(expectedPath)
  );
});
