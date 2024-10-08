/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-named-as-default-member */
import { waitFor } from '@testing-library/react';
import i18n from 'i18next';

import {
  EMPTY_MULTI_LANGUAGE_OBJECT,
  FORM_NAMES,
  LE_DATA_LANGUAGES,
} from '../../../constants';
import {
  CreateRegistrationMutationInput,
  RegistrationQueryVariables,
} from '../../../generated/graphql';
import {
  fakePriceGroupDense,
  fakeRegistration,
  fakeRegistrationPriceGroup,
  fakeRegistrationUserAccess,
  getMockedSeatsReservationData,
  setSessionStorageValues,
} from '../../../utils/mockDataUtils';
import { PriceGroupOption } from '../../priceGroup/types';
import { TEST_SIGNUP_ID } from '../../signup/constants';
import {
  REGISTRATION_INITIAL_VALUES,
  TEST_REGISTRATION_ID,
} from '../constants';
import { RegistrationPriceGroupFormFields } from '../types';
import {
  copyRegistrationToSessionStorage,
  exportSignupsAsExcel,
  formatInstructions,
  getFreeAttendeeOrWaitingListCapacity,
  getMaxSeatsAmount,
  getPriceGroupOptionsForPriceGroup,
  getRegistrationFields,
  getRegistrationInitialValues,
  getRegistrationPayload,
  getRegistrationWarning,
  getSignupLink,
  isAttendeeCapacityUsed,
  isRegistrationOpen,
  isRegistrationPossible,
  isSignupEnded,
  omitSensitiveDataFromRegistrationPayload,
  registrationPathBuilder,
} from '../utils';

afterEach(() => {
  vi.useRealTimers();
});

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe('copyRegistrationToSessionStorage function', () => {
  it('should set price group ids to null ', () => {
    copyRegistrationToSessionStorage(
      fakeRegistration({
        registrationPriceGroups: [
          fakeRegistrationPriceGroup({
            id: 1,
            price: '10.00',
            priceGroup: fakePriceGroupDense({ id: 2 }),
          }),
        ],
      })
    );

    expect(
      JSON.parse(sessionStorage.getItem(FORM_NAMES.REGISTRATION_FORM) as string)
        .values.registrationPriceGroups
    ).toEqual([
      {
        id: null,
        price: '10.00',
        priceGroup: '2',
      },
    ]);
  });

  it('should set registration user accesses to an empty array ', () => {
    copyRegistrationToSessionStorage(
      fakeRegistration({
        registrationUserAccesses: [fakeRegistrationUserAccess()],
      })
    );

    expect(
      JSON.parse(sessionStorage.getItem(FORM_NAMES.REGISTRATION_FORM) as string)
        .values.registrationUserAccesses
    ).toEqual([]);
  });
});

describe('getRegistrationFields function', () => {
  it('should add Palvelukeskus info to description', () => {
    expect(
      formatInstructions({
        ar: 'Description ar',
        en: 'Description en',
        fi: 'Description fi',
        ru: 'Description ru',
        sv: 'Description sv',
        zhHans: 'Description zh hans',
      })
    ).toEqual({
      ar: 'Description ar',
      en: 'Description en\nFor technical problems with registration, please contact:\nPalvelukeskus Helsinki\n09 310 25280, service hours 8 a.m. to 6 p.m',
      fi: 'Description fi\nIlmoittautumisen teknisissä ongelmissa ole yhteydessä:\nPalvelukeskus Helsinki\n09 310 25280, palveluaika klo 8-18',
      ru: 'Description ru',
      sv: 'Description sv\nFör tekniska problem med registreringen, vänligen kontakta:\nPalvelukeskus Helsinki\n09 310 25280, servicetid 08.00 till 18.00',
      zhHans: 'Description zh hans',
    });
  });

  it('should add Palvelukeskus info to description if it already exists', () => {
    expect(
      formatInstructions({
        ar: 'Description ar',
        en: 'Palvelukeskus Helsinki',
        fi: 'Palvelukeskus Helsinki',
        ru: 'Description ru',
        sv: 'Palvelukeskus Helsinki',
        zhHans: 'Description zh hans',
      })
    ).toEqual({
      ar: 'Description ar',
      en: 'Palvelukeskus Helsinki',
      fi: 'Palvelukeskus Helsinki',
      ru: 'Description ru',
      sv: 'Palvelukeskus Helsinki',
      zhHans: 'Description zh hans',
    });
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
      lastModifiedTime,
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
        lastModifiedTime: '',
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
    expect(lastModifiedTime).toBe(null);
    expect(maximumAttendeeCapacity).toBe(null);
    expect(waitingListCapacity).toBe(null);
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
      registrationAccount,
      registrationMerchant,
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
    expect(registrationAccount).toEqual({
      account: '',
      balanceProfitCenter: '',
      companyCode: '',
      internalOrder: '',
      mainLedgerAccount: '',
      operationArea: '',
      profitCenter: '',
      project: '',
    });
    expect(registrationMerchant).toEqual({ merchant: '' });
    expect(registrationUserAccesses).toEqual([]);
    expect(waitingListCapacity).toBe('');
  });

  it('should return initial values', () => {
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
          registrationAccount: {
            account: 1,
            balanceProfitCenter: 'balance profic center',
            companyCode: 'company code',
            internalOrder: 'internal order',
            mainLedgerAccount: 'main ledger account',
            operationArea: 'operation code',
            profitCenter: 'profit center',
            project: 'project',
          },
          registrationMerchant: {
            merchant: 2,
          },
          registrationPriceGroups: [
            {
              id: 1,
              priceGroup: fakePriceGroupDense({ id: 123 }),
              price: '12.00',
              vatPercentage: '25.50',
            },
          ],
          registrationUserAccesses: [
            {
              email: 'user@email.com',
              id: 1,
              isSubstituteUser: true,
              language: 'fi',
            },
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
      hasPrice: true,
      infoLanguages: ['fi'],
      instructions: {
        ...EMPTY_MULTI_LANGUAGE_OBJECT,
        fi: 'Instructions fi',
      },
      mandatoryFields: ['city'],
      maximumAttendeeCapacity: 15,
      maximumGroupSize: '',
      minimumAttendeeCapacity: 5,
      priceGroupOptions: [],
      registrationAccount: {
        account: '1',
        balanceProfitCenter: 'balance profic center',
        companyCode: 'company code',
        internalOrder: 'internal order',
        mainLedgerAccount: 'main ledger account',
        operationArea: 'operation code',
        profitCenter: 'profit center',
        project: 'project',
      },
      registrationMerchant: {
        merchant: '2',
      },
      registrationPriceGroups: [
        {
          id: 1,
          priceGroup: '123',
          price: '12.00',
        },
      ],
      registrationPriceGroupsVatPercentage: '25.50',
      registrationUserAccesses: [
        {
          email: 'user@email.com',
          id: 1,
          isSubstituteUser: true,
          language: 'fi',
        },
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
        fi: 'Ilmoittautumisen teknisissä ongelmissa ole yhteydessä:\nPalvelukeskus Helsinki\n09 310 25280, palveluaika klo 8-18',
        ru: null,
        sv: null,
        zhHans: null,
      },
      mandatoryFields: ['first_name', 'last_name'],
      maximumAttendeeCapacity: null,
      maximumGroupSize: null,
      minimumAttendeeCapacity: null,
      registrationPriceGroups: [],
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
      registrationPriceGroups = [
        {
          id: 1,
          priceGroup: '123',
          price: '12.00',
        },
        {
          id: null,
          priceGroup: '123',
          price: '10.00',
        },
      ],
      registrationPriceGroupsVatPercentage = '25.50',
      registrationUserAccesses = [
        {
          email: 'user@email.com',
          id: null,
          isSubstituteUser: false,
          language: '',
        },
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
      hasPrice: true,
      instructions: {
        ...EMPTY_MULTI_LANGUAGE_OBJECT,
        fi: instructionsFi,
        en: instructionsEn,
      },
      infoLanguages: [LE_DATA_LANGUAGES.FI, LE_DATA_LANGUAGES.EN],
      maximumAttendeeCapacity,
      maximumGroupSize,
      minimumAttendeeCapacity,
      registrationAccount: {
        account: '1',
        balanceProfitCenter: 'balance profic center',
        companyCode: 'company code',
        internalOrder: 'internal order',
        mainLedgerAccount: 'main ledger account',
        operationArea: 'operation code',
        profitCenter: 'profit center',
        project: 'project',
      },
      registrationMerchant: {
        merchant: '2',
      },
      registrationPriceGroups,
      registrationPriceGroupsVatPercentage,
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
        en: 'Instructions en',
        fi: 'Instructions fi',
        ru: null,
        sv: null,
        zhHans: null,
      },
      mandatoryFields: ['first_name', 'last_name'],
      maximumAttendeeCapacity,
      maximumGroupSize,
      minimumAttendeeCapacity,
      registrationAccount: {
        account: 1,
        balanceProfitCenter: 'balance profic center',
        companyCode: 'company code',
        internalOrder: 'internal order',
        mainLedgerAccount: 'main ledger account',
        operationArea: 'operation code',
        profitCenter: 'profit center',
        project: 'project',
      },
      registrationMerchant: {
        merchant: 2,
      },
      registrationPriceGroups: [
        {
          id: 1,
          price: '12.00',
          priceGroup: 123,
          vatPercentage: '25.50',
        },
        {
          id: undefined,
          price: '10.00',
          priceGroup: 123,
          vatPercentage: '25.50',
        },
      ],
      registrationUserAccesses: [
        {
          email: 'user@email.com',
          id: null,
          isSubstituteUser: false,
          language: null,
        },
      ],
      waitingListCapacity,
    });
  });

  it("should return undefined for account and merchant if registration doesn't have price", () => {
    const { registrationAccount, registrationMerchant } =
      getRegistrationPayload({
        ...REGISTRATION_INITIAL_VALUES,

        hasPrice: false,
        registrationAccount: {
          account: '1',
          balanceProfitCenter: 'balance profic center',
          companyCode: 'company code',
          internalOrder: 'internal order',
          mainLedgerAccount: 'main ledger account',
          operationArea: 'operation code',
          profitCenter: 'profit center',
          project: 'project',
        },
        registrationMerchant: {
          merchant: '2',
        },
      });

    expect(registrationAccount).toBeUndefined();
    expect(registrationMerchant).toBeUndefined();
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
    vi.setSystemTime('2022-11-07');
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

describe('isSignupEnded', () => {
  beforeEach(() => {
    vi.setSystemTime('2022-11-07');
  });

  it('should return false if enrolment_start_time is not defined', () => {
    expect(isSignupEnded(fakeRegistration({ enrolmentEndTime: '' }))).toBe(
      false
    );
  });

  it('should return false if enrolment_start_time is in the future', () => {
    expect(
      isSignupEnded(
        fakeRegistration({
          enrolmentEndTime: new Date('2022-11-08').toISOString(),
        })
      )
    ).toBe(false);
  });

  it('should return true if enrolment_end_time is in the past', () => {
    expect(
      isSignupEnded(
        fakeRegistration({
          enrolmentEndTime: new Date('2022-11-06').toISOString(),
        })
      )
    ).toBe(true);
  });
});

describe('isRegistrationPossible', () => {
  it('should return false if registration is not open', () => {
    vi.setSystemTime('2022-11-07');

    expect(
      isRegistrationPossible({
        organizationAncestors: [],
        registration: fakeRegistration({
          enrolmentStartTime: new Date('2022-11-08').toISOString(),
          enrolmentEndTime: '',
        }),
      })
    ).toBe(false);
  });

  it('should return false if all seats are reserved', () => {
    expect(
      isRegistrationPossible({
        organizationAncestors: [],
        registration: fakeRegistration({
          enrolmentStartTime: '',
          enrolmentEndTime: '',
          currentAttendeeCount: 10,
          currentWaitingListCount: 10,
          maximumAttendeeCapacity: 10,
          waitingListCapacity: 10,
          remainingAttendeeCapacity: 0,
          remainingWaitingListCapacity: 0,
        }),
      })
    ).toBe(false);
  });

  it('should return true if all seats in event are not reserved', () => {
    expect(
      isRegistrationPossible({
        organizationAncestors: [],
        registration: fakeRegistration({
          enrolmentStartTime: '',
          enrolmentEndTime: '',
          currentAttendeeCount: 5,
          maximumAttendeeCapacity: 10,
          remainingAttendeeCapacity: 5,
        }),
      })
    ).toBe(true);
  });

  it('should return false if all seats in event are reserved', () => {
    expect(
      isRegistrationPossible({
        organizationAncestors: [],
        registration: fakeRegistration({
          enrolmentStartTime: '',
          enrolmentEndTime: '',
          currentAttendeeCount: 5,
          maximumAttendeeCapacity: 10,
          remainingAttendeeCapacity: 0,
        }),
      })
    ).toBe(false);
  });

  it('should return true if all seats in waiting list are not reserved', () => {
    expect(
      isRegistrationPossible({
        organizationAncestors: [],
        registration: fakeRegistration({
          enrolmentStartTime: '',
          enrolmentEndTime: '',
          currentAttendeeCount: 10,
          currentWaitingListCount: 5,
          maximumAttendeeCapacity: 10,
          waitingListCapacity: 10,
          remainingAttendeeCapacity: 0,
          remainingWaitingListCapacity: 5,
        }),
      })
    ).toBe(true);
  });

  it('should return false if all seats in waiting list are reserved', () => {
    expect(
      isRegistrationPossible({
        organizationAncestors: [],
        registration: fakeRegistration({
          enrolmentStartTime: '',
          enrolmentEndTime: '',
          currentAttendeeCount: 10,
          currentWaitingListCount: 5,
          maximumAttendeeCapacity: 10,
          waitingListCapacity: 10,
          remainingAttendeeCapacity: 0,
          remainingWaitingListCapacity: 0,
        }),
      })
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
      getSignupLink(fakeRegistration({ id: TEST_SIGNUP_ID }), 'fi')
    ).toEqual(
      expect.stringContaining(
        `/fi/registration/${TEST_SIGNUP_ID}/signup-group/create`
      )
    );
  });
});

describe('getRegistrationWarning', () => {
  beforeEach(() => {
    vi.setSystemTime('2022-11-07');
  });

  const singleRegistrationOverrides = {
    enrolmentStartTime: new Date('2022-11-06').toISOString(),
    enrolmentEndTime: new Date('2022-11-08').toISOString(),
    maximumAttendeeCapacity: 10,
    waitingListCapacity: 10,
  };

  it('should return empty string if it is possible to enrol to the event', () => {
    expect(
      getRegistrationWarning({
        organizationAncestors: [],
        registration: fakeRegistration({
          ...singleRegistrationOverrides,
          currentAttendeeCount: 0,
          remainingAttendeeCapacity: 10,
        }),
        t: i18n.t.bind(i18n),
      })
    ).toBe('');
  });

  it('should return correct warning if enrolment is not open', () => {
    expect(
      getRegistrationWarning({
        organizationAncestors: [],
        registration: fakeRegistration({
          ...singleRegistrationOverrides,
          enrolmentStartTime: new Date('2022-11-04').toISOString(),
          enrolmentEndTime: new Date('2022-11-06').toISOString(),
        }),
        t: i18n.t.bind(i18n),
      })
    ).toBe('Ilmoittautuminen tähän tapahtumaan avautuu 4.11.2022 klo 00.00.');

    expect(
      getRegistrationWarning({
        organizationAncestors: [],
        registration: fakeRegistration({
          ...singleRegistrationOverrides,
          enrolmentStartTime: '',
          enrolmentEndTime: new Date('2022-11-06').toISOString(),
        }),
        t: i18n.t.bind(i18n),
      })
    ).toBe(
      'Ilmoittautuminen tähän tapahtumaan on tällä hetkellä suljettu. Kokeile myöhemmin uudelleen.'
    );
  });

  it('should return correct warning if there is no available seats', () => {
    expect(
      getRegistrationWarning({
        organizationAncestors: [],
        registration: fakeRegistration({
          ...singleRegistrationOverrides,
          currentAttendeeCount: 10,
          currentWaitingListCount: 0,
          remainingAttendeeCapacity: 0,
          remainingWaitingListCapacity: 0,
        }),
        t: i18n.t.bind(i18n),
      })
    ).toBe(
      'Tapahtuman kaikki paikat ovat tällä hetkellä varatut. Kokeile myöhemmin uudelleen.'
    );
  });

  it('should return correct warning if there are free seats in waiting list', () => {
    expect(
      getRegistrationWarning({
        organizationAncestors: [],
        registration: fakeRegistration({
          ...singleRegistrationOverrides,
          currentAttendeeCount: 10,
          currentWaitingListCount: 0,
          remainingAttendeeCapacity: 0,
          remainingWaitingListCapacity: 10,
        }),
        t: i18n.t.bind(i18n),
      })
    ).toBe(
      'Ilmoittautuminen tähän tapahtumaan on vielä mahdollista, mutta jonopaikkoja on jäljellä vain 10 kpl.'
    );
  });

  it('should return empty string if maximum attendee capacity is not set', () => {
    expect(
      getRegistrationWarning({
        organizationAncestors: [],
        registration: fakeRegistration({
          ...singleRegistrationOverrides,
          currentAttendeeCount: 10,
          maximumAttendeeCapacity: null,
          remainingAttendeeCapacity: null,
        }),
        t: i18n.t.bind(i18n),
      })
    ).toBe('');
  });

  it('should return correct warning if event is full and waiting list capacity is not set', () => {
    expect(
      getRegistrationWarning({
        organizationAncestors: [],
        registration: fakeRegistration({
          ...singleRegistrationOverrides,
          currentAttendeeCount: 10,
          remainingAttendeeCapacity: 0,
          waitingListCapacity: null,
        }),
        t: i18n.t.bind(i18n),
      })
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

describe('omitSensitiveDataFromRegistrationPayload function', () => {
  it('should omit sensitive data from payload', () => {
    const audienceMaxAge = 18,
      audienceMinAge = 12,
      confirmationMessageFi = 'Confirmation message fi',
      confirmationMessageEn = 'Confirmation message en',
      enrolmentEndTime = '2020-01-01T15:15:00.000Z',
      enrolmentStartTime = '2020-01-01T09:15:00.000Z',
      event = 'event:1',
      instructionsFi = 'Instructions fi',
      instructionsEn = 'Instructions en',
      mandatoryFields = ['first_name', 'last_name'],
      maximumAttendeeCapacity = 10,
      maximumGroupSize = 2,
      minimumAttendeeCapacity = 5,
      registrationUserAccesses = [
        { email: 'user@email.com', id: null, language: null },
      ],
      waitingListCapacity = 3;

    const payload = {
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
      mandatoryFields,
      maximumAttendeeCapacity,
      maximumGroupSize,
      minimumAttendeeCapacity,
      registrationUserAccesses,
      waitingListCapacity,
    };

    const filteredPayload = omitSensitiveDataFromRegistrationPayload(
      payload
    ) as CreateRegistrationMutationInput;

    expect(filteredPayload).toEqual({
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
      mandatoryFields,
      maximumAttendeeCapacity,
      maximumGroupSize,
      minimumAttendeeCapacity,
      waitingListCapacity,
    });
    expect(filteredPayload.registrationUserAccesses).toBeUndefined();
  });
});

describe('exportSignupsAsExcel function', () => {
  const registration = fakeRegistration({ id: TEST_REGISTRATION_ID });

  it('should download signups as excel', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ blob: () => Promise.resolve({}), status: 200 })
    ) as any;
    const link: any = { click: vi.fn(), remove: vi.fn() };
    global.URL.createObjectURL = vi.fn(() => 'https://test.com');
    global.URL.revokeObjectURL = vi.fn();
    const createElement = document.createElement;
    document.createElement = vi.fn().mockImplementation(() => link);

    exportSignupsAsExcel({
      addNotification: vi.fn(),
      apiToken: 'api-token',
      registration,
      uiLanguage: 'fi',
    });
    await waitFor(() =>
      expect(link.download).toBe(`registered_persons_${TEST_REGISTRATION_ID}`)
    );
    expect(link.href).toBe('https://test.com');
    expect(link.click).toHaveBeenCalledTimes(1);
    // Restore original createElement to avoid unexpected side effects
    document.createElement = createElement;
  });

  const errorsCases: [number, string][] = [
    [401, 'Kirjaudu sisään suorittaaksesi tämän toiminnon.'],
    [403, 'Sinulla ei ole lupaa suorittaa tätä toimintoa.'],
    [500, 'Virhe palvelimella.'],
  ];

  it.each(errorsCases)(
    'should show correct correct error, %p returns %p',
    async (status, error) => {
      const addNotification = vi.fn();
      global.fetch = vi.fn(() =>
        Promise.resolve({
          blob: () => Promise.resolve({}),
          status: status,
        })
      ) as any;
      exportSignupsAsExcel({
        addNotification,
        apiToken: 'api-token',
        registration,
        uiLanguage: 'fi',
      });

      await waitFor(() =>
        expect(addNotification).toBeCalledWith({ label: error, type: 'error' })
      );
    }
  );
});

describe('getPriceGroupOptionsForPriceGroup function', () => {
  const priceGroup1: RegistrationPriceGroupFormFields = {
    id: 1,
    price: '1.00',
    priceGroup: '1',
  };
  const priceGroup2: RegistrationPriceGroupFormFields = {
    id: 2,
    price: '2.00',
    priceGroup: '2',
  };
  const priceGroupOption1: PriceGroupOption = {
    isFree: false,
    label: 'Price group 1',
    value: '1',
  };
  const priceGroupOption2: PriceGroupOption = {
    isFree: false,
    label: 'Price group 2',
    value: '2',
  };
  const priceGroupOption3: PriceGroupOption = {
    isFree: false,
    label: 'Price group 3',
    value: '3',
  };
  const priceGroupOption4: PriceGroupOption = {
    isFree: false,
    label: 'Price group 4',
    value: '4',
  };
  const priceGroupOptions: PriceGroupOption[] = [
    priceGroupOption1,
    priceGroupOption2,
    priceGroupOption3,
    priceGroupOption4,
  ];

  it.each([
    [
      priceGroup1,
      [priceGroup1, priceGroup2],
      [priceGroupOption1, priceGroupOption3, priceGroupOption4],
    ],
    [
      priceGroup2,
      [priceGroup1, priceGroup2],
      [priceGroupOption2, priceGroupOption3, priceGroupOption4],
    ],
  ])(
    'should download signups as excel',
    async (currentPriceGroup, selectedPriceGroups, expectedOptions) => {
      expect(
        getPriceGroupOptionsForPriceGroup({
          priceGroupOptions: priceGroupOptions,
          currentPriceGroup,
          selectedPriceGroups,
        })
      ).toEqual(expectedOptions);
    }
  );
});
