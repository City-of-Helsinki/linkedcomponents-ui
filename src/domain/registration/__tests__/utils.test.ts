import i18n from 'i18next';

import { fakeRegistration } from '../../../utils/mockDataUtils';
import { REGISTRATION_EDIT_ACTIONS } from '../../registrations/constants';
import { REGISTRATION_INITIAL_VALUES } from '../constants';
import {
  getEditRegistrationWarning,
  getRegistrationInitialValues,
  getRegistrationPayload,
} from '../utils';

describe('getEditRegistrationWarning function', () => {
  it('should return correct warning if user is not authenticated', () => {
    const allowedActions = [
      REGISTRATION_EDIT_ACTIONS.COPY,
      REGISTRATION_EDIT_ACTIONS.SHOW_ENROLMENTS,
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
      REGISTRATION_EDIT_ACTIONS.DELETE,
      REGISTRATION_EDIT_ACTIONS.UPDATE,
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
        action: REGISTRATION_EDIT_ACTIONS.UPDATE,
      })
    ).toBe('Sinulla ei ole oikeuksia muokata tätä ilmoittautumista.');
  });
});

describe('getRegistrationInitialValues function', () => {
  it('should return default values if value is not set', () => {
    const {
      audienceMaxAge,
      audienceMinAge,
      confirmationMessage,
      enrolmentEndTime,
      enrolmentStartTime,
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
    expect(enrolmentEndTime).toBe(null);
    expect(enrolmentStartTime).toBe(null);
    expect(instructions).toBe('');
    expect(maximumAttendeeCapacity).toBe('');
    expect(minimumAttendeeCapacity).toBe('');
    expect(waitingListCapacity).toBe('');
  });
});

describe('getEventPayload function', () => {
  it('should return single event as payload', () => {
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
      enrolmentEndTime: new Date(enrolmentEndTime),
      enrolmentStartTime: new Date(enrolmentStartTime),
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
