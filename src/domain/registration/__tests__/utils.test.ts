/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';

import {
  RegistrationFieldsFragment,
  RegistrationQueryVariables,
} from '../../../generated/graphql';
import { fakeRegistration } from '../../../utils/mockDataUtils';
import { REGISTRATION_ACTIONS } from '../../registrations/constants';
import { registrationsResponse } from '../__mocks__/registration';
import { REGISTRATION_INITIAL_VALUES } from '../constants';
import {
  getEditRegistrationWarning,
  getRegistrationFields,
  getRegistrationInitialValues,
  getRegistrationPayload,
  getRegistrationWarning,
  registrationPathBuilder,
} from '../utils';

describe('getEditRegistrationWarning function', () => {
  it('should return correct warning if user is not authenticated', () => {
    const allowedActions = [
      REGISTRATION_ACTIONS.COPY,
      REGISTRATION_ACTIONS.COPY_LINK,
      REGISTRATION_ACTIONS.EDIT,
    ];

    const commonProps = {
      authenticated: false,
      t: i18n.t.bind(i18n),
      userCanDoAction: false,
    };

    allowedActions.forEach((action) => {
      expect(
        getEditRegistrationWarning({
          action,
          ...commonProps,
        })
      ).toBe('');
    });

    const deniedActions = [
      REGISTRATION_ACTIONS.DELETE,
      REGISTRATION_ACTIONS.SHOW_ENROLMENTS,
      REGISTRATION_ACTIONS.UPDATE,
    ];

    deniedActions.forEach((action) => {
      expect(
        getEditRegistrationWarning({
          action,
          ...commonProps,
        })
      ).toBe('Sinulla ei ole oikeuksia muokata ilmoittautumisia.');
    });
  });

  it('should return correct warning if user cannot do action', () => {
    expect(
      getEditRegistrationWarning({
        authenticated: true,
        t: i18n.t.bind(i18n),
        userCanDoAction: false,
        action: REGISTRATION_ACTIONS.UPDATE,
      })
    ).toBe('Sinulla ei ole oikeuksia muokata tätä ilmoittautumista.');
  });
});

describe('getRegistrationFields function', () => {
  it('should return default values if value is not set', () => {
    const {
      atId,
      createdBy,
      currentAttendeeCount,
      currentWaitingListCount,
      enrolmentEndTime,
      enrolmentStartTime,
      id,
      lastModifiedAt,
      maximumAttendeeCapacity,
      waitingListCapacity,
    } = getRegistrationFields(
      fakeRegistration({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        atId: null as any,
        createdBy: null,
        currentAttendeeCount: null,
        currentWaitingListCount: null,
        enrolmentEndTime: '',
        enrolmentStartTime: '',
        id: null,
        lastModifiedAt: '',
        maximumAttendeeCapacity: null,
        waitingListCapacity: null,
      }),
      'fi'
    );

    expect(atId).toBe('');
    expect(createdBy).toBe('');
    expect(currentAttendeeCount).toBe(0);
    expect(currentWaitingListCount).toBe(0);
    expect(enrolmentEndTime).toBe(null);
    expect(enrolmentStartTime).toBe(null);
    expect(id).toBe('');
    expect(lastModifiedAt).toBe(null);
    expect(maximumAttendeeCapacity).toBe(0);
    expect(waitingListCapacity).toBe(0);
  });
});

describe('getRegistrationInitialValues function', () => {
  it('should return default values if value is not set', () => {
    const {
      audienceMaxAge,
      audienceMinAge,
      confirmationMessage,
      enrolmentEndTimeDate,
      enrolmentEndTimeTime,
      enrolmentStartTimeDate,
      enrolmentStartTimeTime,
      instructions,
      maximumAttendeeCapacity,
      minimumAttendeeCapacity,
      waitingListCapacity,
    } = getRegistrationInitialValues(
      fakeRegistration({
        audienceMaxAge: null,
        audienceMinAge: null,
        confirmationMessage: null,
        enrolmentEndTime: '',
        enrolmentStartTime: '',
        instructions: null,
        maximumAttendeeCapacity: null,
        minimumAttendeeCapacity: null,
        waitingListCapacity: null,
      })
    );

    expect(audienceMaxAge).toBe('');
    expect(audienceMinAge).toBe('');
    expect(confirmationMessage).toBe('');
    expect(enrolmentEndTimeDate).toBe('');
    expect(enrolmentEndTimeTime).toBe('');
    expect(enrolmentStartTimeDate).toBe('');
    expect(enrolmentStartTimeTime).toBe('');
    expect(instructions).toBe('');
    expect(maximumAttendeeCapacity).toBe('');
    expect(minimumAttendeeCapacity).toBe('');
    expect(waitingListCapacity).toBe('');
  });
});

describe('getRegistrationPayload function', () => {
  it('should return single registration as payload', () => {
    expect(
      getRegistrationPayload({
        ...REGISTRATION_INITIAL_VALUES,
      })
    ).toEqual({
      audienceMaxAge: null,
      audienceMinAge: null,
      confirmationMessage: null,
      enrolmentEndTime: null,
      enrolmentStartTime: null,
      event: '',
      instructions: null,
      maximumAttendeeCapacity: null,
      minimumAttendeeCapacity: null,
      waitingListCapacity: null,
    });

    const audienceMaxAge = 18,
      audienceMinAge = 12,
      confirmationMessage = 'Confirmation message',
      enrolmentEndTime = '2020-01-01T15:15:00.000Z',
      enrolmentStartTime = '2020-01-01T09:15:00.000Z',
      event = 'event:1',
      instructions = 'Instructions',
      maximumAttendeeCapacity = 10,
      minimumAttendeeCapacity = 5,
      waitingListCapacity = 3;
    const payload = getRegistrationPayload({
      ...REGISTRATION_INITIAL_VALUES,
      audienceMaxAge,
      audienceMinAge,
      confirmationMessage,
      enrolmentEndTimeDate: '1.1.2020',
      enrolmentEndTimeTime: '15:15',
      enrolmentStartTimeDate: '1.1.2020',
      enrolmentStartTimeTime: '09:15',
      event,
      instructions,
      maximumAttendeeCapacity,
      minimumAttendeeCapacity,
      waitingListCapacity,
    });

    expect(payload).toEqual({
      audienceMaxAge,
      audienceMinAge,
      confirmationMessage,
      enrolmentEndTime,
      enrolmentStartTime,
      event,
      instructions,
      maximumAttendeeCapacity,
      minimumAttendeeCapacity,
      waitingListCapacity,
    });
  });
});

describe('registrationPathBuilder function', () => {
  const cases: [RegistrationQueryVariables, string][] = [
    [{ id: 'hel:123' }, '/registration/hel:123/'],
  ];

  it.each(cases)('should build correct path', (variables, expectedPath) =>
    expect(registrationPathBuilder({ args: variables })).toBe(expectedPath)
  );
});

describe('getRegistrationWarning', () => {
  it('should return empty string if it is possible to enrol to the event', () => {
    expect(
      getRegistrationWarning(
        registrationsResponse.data[0] as RegistrationFieldsFragment,
        i18n.t.bind(i18n)
      )
    ).toBe('');
  });

  it('should return correct warning if there is space in waiting list', () => {
    expect(
      getRegistrationWarning(
        registrationsResponse.data[1] as RegistrationFieldsFragment,
        i18n.t.bind(i18n)
      )
    ).toBe(
      'Ilmoittautuminen tähän tapahtumaan on vielä mahdollista, mutta jonopaikkoja on jäljellä vain 10 kpl.'
    );
  });

  it('should return correct warning if all spaces are gone and there are no waiting list', () => {
    expect(
      getRegistrationWarning(
        registrationsResponse.data[2] as RegistrationFieldsFragment,
        i18n.t.bind(i18n)
      )
    ).toBe(
      'Ilmoittautuminen tähän tapahtumaan on tällä hetkellä suljettu. Kokeile myöhemmin uudelleen.'
    );
  });
  it('should return correct warning if it is not possible to enrol to the event', () => {
    expect(
      getRegistrationWarning(
        registrationsResponse.data[3] as RegistrationFieldsFragment,
        i18n.t.bind(i18n)
      )
    ).toBe(
      'Ilmoittautuminen tähän tapahtumaan on tällä hetkellä suljettu. Kokeile myöhemmin uudelleen.'
    );
  });

  it('should return empty string if maximum attendee capacity is not set', () => {
    expect(
      getRegistrationWarning(
        registrationsResponse.data[4] as RegistrationFieldsFragment,
        i18n.t.bind(i18n)
      )
    ).toBe('');
  });
});
