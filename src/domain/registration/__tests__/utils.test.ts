/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next';
import { advanceTo, clear } from 'jest-date-mock';

import {
  EMPTY_MULTI_LANGUAGE_OBJECT,
  LE_DATA_LANGUAGES,
} from '../../../constants';
import { RegistrationQueryVariables } from '../../../generated/graphql';
import {
  fakeRegistration,
  getMockedSeatsReservationData,
  setSessionStorageValues,
} from '../../../utils/mockDataUtils';
import { TEST_ENROLMENT_ID } from '../../enrolment/constants';
import { REGISTRATION_ACTIONS } from '../../registrations/constants';
import {
  REGISTRATION_INITIAL_VALUES,
  TEST_REGISTRATION_ID,
} from '../constants';
import {
  getEditRegistrationWarning,
  getFreeAttendeeOrWaitingListCapacity,
  getMaxSeatsAmount,
  getRegistrationFields,
  getRegistrationInitialValues,
  getRegistrationPayload,
  getRegistrationWarning,
  getSignupLink,
  isAttendeeCapacityUsed,
  isRegistrationOpen,
  isRegistrationPossible,
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
      registrationUserAccesses,
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
    expect(confirmationMessage).toEqual({
      ar: '',
      en: '',
      fi: '',
      ru: '',
      sv: '',
      zhHans: '',
    });
    expect(enrolmentEndTimeDate).toBe(null);
    expect(enrolmentEndTimeTime).toBe('');
    expect(enrolmentStartTimeDate).toBe(null);
    expect(enrolmentStartTimeTime).toBe('');
    expect(instructions).toEqual({
      ar: '',
      en: '',
      fi: '',
      ru: '',
      sv: '',
      zhHans: '',
    });
    expect(maximumAttendeeCapacity).toBe('');
    expect(minimumAttendeeCapacity).toBe('');
    expect(registrationUserAccesses).toEqual([]);
    expect(waitingListCapacity).toBe('');
  });

  it('should return initial values if value is not set', () => {
    expect(
      getRegistrationInitialValues(
        fakeRegistration({
          audienceMaxAge: 15,
          audienceMinAge: 8,
          confirmationMessage: {
            ...EMPTY_MULTI_LANGUAGE_OBJECT,
            fi: 'Confirmation message fi',
          },
          enrolmentEndTime: '2021-06-15T12:00:00.000Z',
          enrolmentStartTime: '2021-06-13T12:00:00.000Z',
          instructions: {
            ...EMPTY_MULTI_LANGUAGE_OBJECT,
            fi: 'Instructions fi',
          },
          mandatoryFields: ['city'],
          maximumAttendeeCapacity: 15,
          minimumAttendeeCapacity: 5,
          registrationUserAccesses: [
            { email: 'user@email.com', id: 1, language: 'fi' },
          ],
          waitingListCapacity: 5,
        })
      )
    ).toEqual({
      audienceMaxAge: 15,
      audienceMinAge: 8,
      confirmationMessage: {
        ...EMPTY_MULTI_LANGUAGE_OBJECT,
        fi: 'Confirmation message fi',
      },
      enrolmentEndTimeDate: new Date('2021-06-15T12:00:00.000Z'),
      enrolmentEndTimeTime: '12:00',
      enrolmentStartTimeDate: new Date('2021-06-13T12:00:00.000Z'),
      enrolmentStartTimeTime: '12:00',
      event: '',
      infoLanguages: ['fi'],
      instructions: {
        ...EMPTY_MULTI_LANGUAGE_OBJECT,
        fi: 'Instructions fi',
      },
      mandatoryFields: ['city'],
      maximumAttendeeCapacity: 15,
      maximumGroupSize: '',
      minimumAttendeeCapacity: 5,
      registrationUserAccesses: [
        { email: 'user@email.com', id: 1, language: 'fi' },
      ],
      waitingListCapacity: 5,
    });
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
      confirmationMessage: {
        ar: null,
        en: null,
        fi: '',
        ru: null,
        sv: null,
        zhHans: null,
      },
      enrolmentEndTime: null,
      enrolmentStartTime: null,
      event: { atId: '' },
      instructions: {
        ar: null,
        en: null,
        fi: '',
        ru: null,
        sv: null,
        zhHans: null,
      },
      mandatoryFields: ['first_name', 'last_name'],
      maximumAttendeeCapacity: null,
      maximumGroupSize: null,
      minimumAttendeeCapacity: null,
      registrationUserAccesses: [],
      waitingListCapacity: null,
    });

    const audienceMaxAge = 18,
      audienceMinAge = 12,
      confirmationMessageFi = 'Confirmation message fi',
      confirmationMessageEn = 'Confirmation message en',
      enrolmentEndTime = '2020-01-01T15:15:00.000Z',
      enrolmentStartTime = '2020-01-01T09:15:00.000Z',
      event = 'event:1',
      instructionsFi = 'Instructions fi',
      instructionsEn = 'Instructions en',
      maximumAttendeeCapacity = 10,
      maximumGroupSize = 2,
      minimumAttendeeCapacity = 5,
      registrationUserAccesses = [
        { email: 'user@email.com', id: null, language: '' },
      ],
      waitingListCapacity = 3;
    const payload = getRegistrationPayload({
      ...REGISTRATION_INITIAL_VALUES,
      audienceMaxAge,
      audienceMinAge,
      confirmationMessage: {
        ...EMPTY_MULTI_LANGUAGE_OBJECT,
        fi: confirmationMessageFi,
        en: confirmationMessageEn,
      },
      enrolmentEndTimeDate: new Date(enrolmentEndTime),
      enrolmentEndTimeTime: '15:15',
      enrolmentStartTimeDate: new Date(enrolmentStartTime),
      enrolmentStartTimeTime: '09:15',
      event,
      instructions: {
        ...EMPTY_MULTI_LANGUAGE_OBJECT,
        fi: instructionsFi,
        en: instructionsEn,
      },
      infoLanguages: [LE_DATA_LANGUAGES.FI, LE_DATA_LANGUAGES.EN],
      maximumAttendeeCapacity,
      maximumGroupSize,
      minimumAttendeeCapacity,
      registrationUserAccesses,
      waitingListCapacity,
    });

    expect(payload).toEqual({
      audienceMaxAge,
      audienceMinAge,
      confirmationMessage: {
        ar: null,
        en: confirmationMessageEn,
        fi: confirmationMessageFi,
        ru: null,
        sv: null,
        zhHans: null,
      },
      enrolmentEndTime,
      enrolmentStartTime,
      event: { atId: event },
      instructions: {
        ar: null,
        en: instructionsEn,
        fi: instructionsFi,
        ru: null,
        sv: null,
        zhHans: null,
      },
      mandatoryFields: ['first_name', 'last_name'],
      maximumAttendeeCapacity,
      maximumGroupSize,
      minimumAttendeeCapacity,
      registrationUserAccesses: [
        { email: 'user@email.com', id: null, language: null },
      ],
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
  beforeEach(() => {
    advanceTo('2022-11-07');
  });

  it('should return true if enrolment_start_time is not defined', () => {
    expect(
      isRegistrationOpen(
        fakeRegistration({ enrolmentStartTime: '', enrolmentEndTime: '' })
      )
    ).toBe(true);
  });

  it('should return false if enrolment_start_time is in the future', () => {
    expect(
      isRegistrationOpen(
        fakeRegistration({
          enrolmentStartTime: new Date('2022-11-08').toISOString(),
          enrolmentEndTime: '',
        })
      )
    ).toBe(false);
  });

  it('should return true if enrolment_start_time is in the past and enrolment_start_time is in the future', () => {
    expect(
      isRegistrationOpen(
        fakeRegistration({
          enrolmentEndTime: new Date('2022-11-08').toISOString(),
          enrolmentStartTime: new Date('2022-11-06').toISOString(),
        })
      )
    ).toBe(true);
  });

  it('should return false if enrolment_end_time is in the past', () => {
    expect(
      isRegistrationOpen(
        fakeRegistration({
          enrolmentStartTime: '',
          enrolmentEndTime: new Date('2022-11-06').toISOString(),
        })
      )
    ).toBe(false);
  });
});

describe('isRegistrationPossible', () => {
  it('should return false if registration is not open', () => {
    advanceTo('2022-11-07');

    expect(
      isRegistrationPossible(
        fakeRegistration({
          enrolmentStartTime: new Date('2022-11-08').toISOString(),
          enrolmentEndTime: '',
        })
      )
    ).toBe(false);
  });

  it('should return false if all seats are reserved', () => {
    expect(
      isRegistrationPossible(
        fakeRegistration({
          enrolmentStartTime: '',
          enrolmentEndTime: '',
          currentAttendeeCount: 10,
          currentWaitingListCount: 10,
          maximumAttendeeCapacity: 10,
          waitingListCapacity: 10,
          remainingAttendeeCapacity: 0,
          remainingWaitingListCapacity: 0,
        })
      )
    ).toBe(false);
  });

  it('should return true if all seats in event are not reserved', () => {
    expect(
      isRegistrationPossible(
        fakeRegistration({
          enrolmentStartTime: '',
          enrolmentEndTime: '',
          currentAttendeeCount: 5,
          maximumAttendeeCapacity: 10,
          remainingAttendeeCapacity: 5,
        })
      )
    ).toBe(true);
  });

  it('should return false if all seats in event are reserved', () => {
    expect(
      isRegistrationPossible(
        fakeRegistration({
          enrolmentStartTime: '',
          enrolmentEndTime: '',
          currentAttendeeCount: 5,
          maximumAttendeeCapacity: 10,
          remainingAttendeeCapacity: 0,
        })
      )
    ).toBe(false);
  });

  it('should return true if all seats in waiting list are not reserved', () => {
    expect(
      isRegistrationPossible(
        fakeRegistration({
          enrolmentStartTime: '',
          enrolmentEndTime: '',
          currentAttendeeCount: 10,
          currentWaitingListCount: 5,
          maximumAttendeeCapacity: 10,
          waitingListCapacity: 10,
          remainingAttendeeCapacity: 0,
          remainingWaitingListCapacity: 5,
        })
      )
    ).toBe(true);
  });

  it('should return false if all seats in waiting list are reserved', () => {
    expect(
      isRegistrationPossible(
        fakeRegistration({
          enrolmentStartTime: '',
          enrolmentEndTime: '',
          currentAttendeeCount: 10,
          currentWaitingListCount: 5,
          maximumAttendeeCapacity: 10,
          waitingListCapacity: 10,
          remainingAttendeeCapacity: 0,
          remainingWaitingListCapacity: 0,
        })
      )
    ).toBe(false);
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

describe('getSignupLink', () => {
  it('should get correct signup link', () => {
    expect(
      getSignupLink(fakeRegistration({ id: TEST_ENROLMENT_ID }), 'fi')
    ).toEqual(
      expect.stringContaining(
        `/fi/registration/${TEST_ENROLMENT_ID}/signup-group/create`
      )
    );
  });
});

describe('getRegistrationWarning', () => {
  beforeEach(() => {
    advanceTo('2022-11-07');
  });

  const singleRegistrationOverrides = {
    enrolmentStartTime: new Date('2022-11-06').toISOString(),
    enrolmentEndTime: new Date('2022-11-08').toISOString(),
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

  it('should return correct warning if enrolment is not open', () => {
    expect(
      getRegistrationWarning(
        fakeRegistration({
          ...singleRegistrationOverrides,
          enrolmentStartTime: new Date('2022-11-04').toISOString(),
          enrolmentEndTime: new Date('2022-11-06').toISOString(),
        }),
        i18n.t.bind(i18n)
      )
    ).toBe(
      'Ilmoittautuminen tähän tapahtumaan on tällä hetkellä suljettu. Kokeile myöhemmin uudelleen.'
    );
  });

  it('should return correct warning if there is no available seats', () => {
    expect(
      getRegistrationWarning(
        fakeRegistration({
          ...singleRegistrationOverrides,
          currentAttendeeCount: 10,
          currentWaitingListCount: 0,
          remainingAttendeeCapacity: 0,
          remainingWaitingListCapacity: 0,
        }),
        i18n.t.bind(i18n)
      )
    ).toBe(
      'Tapahtuman kaikki paikat ovat tällä hetkellä varatut. Kokeile myöhemmin uudelleen.'
    );
  });

  it('should return correct warning if there are free seats in waiting list', () => {
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

describe('getMaxSeatsAmount function', () => {
  test('should return undefined if maximum attendee capacity maximum group size is not set', () => {
    expect(
      getMaxSeatsAmount(
        fakeRegistration({
          maximumAttendeeCapacity: null,
          maximumGroupSize: null,
        })
      )
    ).toBe(undefined);
  });

  test('should return maximum group size if maximum attendee capacity is not defined', () => {
    expect(
      getMaxSeatsAmount(
        fakeRegistration({
          maximumAttendeeCapacity: null,
          maximumGroupSize: 4,
        })
      )
    ).toBe(4);
  });

  test('should return free capacity if maximum group size is not defined', () => {
    expect(
      getMaxSeatsAmount(
        fakeRegistration({
          currentAttendeeCount: 3,
          maximumAttendeeCapacity: 10,
          maximumGroupSize: null,
          remainingAttendeeCapacity: 7,
        })
      )
    ).toBe(7);
  });

  test('should return free capacity if maximum group size is greated than free capacity', () => {
    expect(
      getMaxSeatsAmount(
        fakeRegistration({
          currentAttendeeCount: 3,
          maximumAttendeeCapacity: 10,
          maximumGroupSize: 8,
          remainingAttendeeCapacity: 7,
        })
      )
    ).toBe(7);
  });

  test('should return maximum group size if maximum group size is less that free capacity', () => {
    expect(
      getMaxSeatsAmount(
        fakeRegistration({
          currentAttendeeCount: 3,
          maximumAttendeeCapacity: 10,
          maximumGroupSize: 6,
          remainingAttendeeCapacity: 7,
        })
      )
    ).toBe(6);
  });

  test('should return correct free capacity if seats reservation is stored to session storage', () => {
    const reservation = getMockedSeatsReservationData(1000);
    reservation.seats = 5;
    const registration = fakeRegistration({
      currentAttendeeCount: 2,
      id: TEST_REGISTRATION_ID,
      maximumAttendeeCapacity: 15,
      maximumGroupSize: null,
      remainingAttendeeCapacity: 7,
    });
    setSessionStorageValues(reservation, registration);

    expect(getMaxSeatsAmount(registration)).toBe(12);
  });
});
