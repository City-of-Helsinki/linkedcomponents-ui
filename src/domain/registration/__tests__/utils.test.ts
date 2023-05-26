/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';
import { advanceTo, clear } from 'jest-date-mock';

import { RegistrationQueryVariables } from '../../../generated/graphql';
import { fakeRegistration } from '../../../utils/mockDataUtils';
import { TEST_ENROLMENT_ID } from '../../enrolment/constants';
import { REGISTRATION_ACTIONS } from '../../registrations/constants';
import { REGISTRATION_INITIAL_VALUES } from '../constants';
import {
  getEditRegistrationWarning,
  getEnrolmentLink,
  getFreeAttendeeOrWaitingListCapacity,
  getRegistrationFields,
  getRegistrationInitialValues,
  getRegistrationPayload,
  getRegistrationWarning,
  isAttendeeCapacityUsed,
  isRegistrationOpen,
  registrationPathBuilder,
} from '../utils';

afterEach(() => {
  clear();
});

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

  it('should return warning if registration has enrolments', () => {
    expect(
      getEditRegistrationWarning({
        authenticated: true,
        registration: fakeRegistration({ currentAttendeeCount: 1 }),
        t: i18n.t.bind(i18n),
        userCanDoAction: true,
        action: REGISTRATION_ACTIONS.DELETE,
      })
    ).toBe('Ilmoittautumisia joilla on osallistujia ei voi poistaa.');
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
    expect(enrolmentEndTimeDate).toBe(null);
    expect(enrolmentEndTimeTime).toBe('');
    expect(enrolmentStartTimeDate).toBe(null);
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
      event: { atId: '' },
      instructions: null,
      mandatoryFields: ['name'],
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
      enrolmentEndTimeDate: new Date(enrolmentEndTime),
      enrolmentEndTimeTime: '15:15',
      enrolmentStartTimeDate: new Date(enrolmentStartTime),
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
      event: { atId: event },
      instructions,
      mandatoryFields: ['name'],
      maximumAttendeeCapacity,
      minimumAttendeeCapacity,
      waitingListCapacity,
    });
  });
});

describe('registrationPathBuilder function', () => {
  const cases: [RegistrationQueryVariables, string][] = [
    [{ id: 'hel:123' }, '/registration/hel:123/'],
    [
      { id: 'hel:123', include: 'event' },
      '/registration/hel:123/?include=event',
    ],
  ];

  it.each(cases)('should build correct path', (variables, expectedPath) =>
    expect(registrationPathBuilder({ args: variables })).toBe(expectedPath)
  );
});

describe('isRegistrationOpen', () => {
  it('should return false if enrolment_start_time is not defined', () => {
    expect(
      isRegistrationOpen(fakeRegistration({ enrolmentStartTime: '' }))
    ).toBe(false);
  });

  it('should return false if enrolment_start_time is not in the past', () => {
    advanceTo('2022-11-07');

    expect(
      isRegistrationOpen(
        fakeRegistration({
          enrolmentStartTime: new Date('2022-11-08').toISOString(),
        })
      )
    ).toBe(false);
  });

  it('should return false if enrolment_start_time is in the past and enrolment_start_time is in the past', () => {
    advanceTo('2022-11-07');

    expect(
      isRegistrationOpen(
        fakeRegistration({
          enrolmentEndTime: new Date('2022-11-06').toISOString(),
          enrolmentStartTime: new Date('2022-11-06').toISOString(),
        })
      )
    ).toBe(false);
  });

  it('should return true if enrolment_start_time is in the past and enrolment_start_time is not defined', () => {
    advanceTo('2022-11-07');

    expect(
      isRegistrationOpen(
        fakeRegistration({
          enrolmentEndTime: '',
          enrolmentStartTime: new Date('2022-11-06').toISOString(),
        })
      )
    ).toBe(true);
  });

  it('should return true if enrolment_start_time is in the past and enrolment_start_time is in the future', () => {
    advanceTo('2022-11-07');

    expect(
      isRegistrationOpen(
        fakeRegistration({
          enrolmentEndTime: new Date('2022-11-08').toISOString(),
          enrolmentStartTime: new Date('2022-11-06').toISOString(),
        })
      )
    ).toBe(true);
  });
});

describe('isAttendeeCapacityUsed', () => {
  it('should return false if maximum_attendee_capacity is not defined', () => {
    expect(
      isAttendeeCapacityUsed(
        fakeRegistration({ maximumAttendeeCapacity: null })
      )
    ).toBe(false);
  });

  it('should return false if current attendee count is less than maximum attendee capacity', () => {
    expect(
      isAttendeeCapacityUsed(
        fakeRegistration({
          currentAttendeeCount: 4,
          maximumAttendeeCapacity: 40,
        })
      )
    ).toBe(false);
  });

  it('should return true if current attendee count equals maximum attendee capacity', () => {
    expect(
      isAttendeeCapacityUsed(
        fakeRegistration({
          currentAttendeeCount: 40,
          maximumAttendeeCapacity: 40,
        })
      )
    ).toBe(true);
  });

  it('should return true if current attendee count is greater than maximum attendee capacity', () => {
    expect(
      isAttendeeCapacityUsed(
        fakeRegistration({
          currentAttendeeCount: 41,
          maximumAttendeeCapacity: 40,
        })
      )
    ).toBe(true);
  });
});

describe('getEnrolmentLink', () => {
  it('should get correct enrolment link', () => {
    expect(
      getEnrolmentLink(fakeRegistration({ id: TEST_ENROLMENT_ID }), 'fi')
    ).toEqual(
      expect.stringContaining(
        `/fi/registration/${TEST_ENROLMENT_ID}/enrolment/create`
      )
    );
  });
});

describe('getRegistrationWarning', () => {
  beforeEach(() => {
    advanceTo('2022-11-07');
  });

  const singleRegistrationOverrides = {
    enrolmentEndTime: new Date('2022-11-08').toISOString(),
    enrolmentStartTime: new Date('2022-11-06').toISOString(),
    maximumAttendeeCapacity: 10,
    waitingListCapacity: 10,
  };

  it('should return empty string if it is possible to enrol to the event', () => {
    expect(
      getRegistrationWarning(
        fakeRegistration({
          ...singleRegistrationOverrides,
          currentAttendeeCount: 0,
          remainingAttendeeCapacity: 10,
        }),
        i18n.t.bind(i18n)
      )
    ).toBe('');
  });

  it('should return correct warning if there is space in waiting list', () => {
    expect(
      getRegistrationWarning(
        fakeRegistration({
          ...singleRegistrationOverrides,
          currentAttendeeCount: 10,
          currentWaitingListCount: 0,
          remainingAttendeeCapacity: 0,
          remainingWaitingListCapacity: 10,
        }),
        i18n.t.bind(i18n)
      )
    ).toBe(
      'Ilmoittautuminen tähän tapahtumaan on vielä mahdollista, mutta jonopaikkoja on jäljellä vain 10 kpl.'
    );
  });

  it('should return empty string if maximum attendee capacity is not set', () => {
    expect(
      getRegistrationWarning(
        fakeRegistration({
          ...singleRegistrationOverrides,
          currentAttendeeCount: 10,
          maximumAttendeeCapacity: null,
          remainingAttendeeCapacity: null,
        }),
        i18n.t.bind(i18n)
      )
    ).toBe('');
  });

  it('should return correct warning if event is full and waiting list capacity is not set', () => {
    expect(
      getRegistrationWarning(
        fakeRegistration({
          ...singleRegistrationOverrides,
          currentAttendeeCount: 10,
          remainingAttendeeCapacity: 0,
          waitingListCapacity: null,
        }),
        i18n.t.bind(i18n)
      )
    ).toBe(
      'Ilmoittautuminen tähän tapahtumaan on vielä mahdollista, mutta vain jonopaikkoja on jäljellä.'
    );
  });
});

describe('getFreeAttendeeOrWaitingListCapacity function', () => {
  test('should return undefined if maximum attendee capacity is not set', () => {
    expect(
      getFreeAttendeeOrWaitingListCapacity(
        fakeRegistration({ maximumAttendeeCapacity: null })
      )
    ).toBe(undefined);
  });

  test('should return 0 if maximum attendee capacity is not used but all seats are reserved', () => {
    expect(
      getFreeAttendeeOrWaitingListCapacity(
        fakeRegistration({
          currentAttendeeCount: 3,
          maximumAttendeeCapacity: 10,
          remainingAttendeeCapacity: 0,
        })
      )
    ).toBe(0);
  });
  test('should return free capacity', () => {
    expect(
      getFreeAttendeeOrWaitingListCapacity(
        fakeRegistration({
          currentAttendeeCount: 3,
          maximumAttendeeCapacity: 10,
          remainingAttendeeCapacity: 7,
        })
      )
    ).toBe(7);
  });
  test('should return undefined if waiting list capacity is not set', () => {
    expect(
      getFreeAttendeeOrWaitingListCapacity(
        fakeRegistration({
          currentAttendeeCount: 10,
          maximumAttendeeCapacity: 10,
          remainingAttendeeCapacity: 0,
          waitingListCapacity: null,
        })
      )
    ).toBe(undefined);
  });

  test('should return remaining waiting list capacity', () => {
    expect(
      getFreeAttendeeOrWaitingListCapacity(
        fakeRegistration({
          currentAttendeeCount: 10,
          currentWaitingListCount: 3,
          maximumAttendeeCapacity: 10,
          remainingAttendeeCapacity: 0,
          remainingWaitingListCapacity: 7,
          waitingListCapacity: 10,
        })
      )
    ).toBe(7);
  });
});
