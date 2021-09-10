import i18n from 'i18next';

import { fakeRegistration } from '../../../utils/mockDataUtils';
import { REGISTRATION_EDIT_ACTIONS } from '../../registrations/constants';
import {
  getEditRegistrationWarning,
  getRegistrationInitialValues,
} from '../utils';

describe('getEditRegistrationWarning function', () => {
  it('should return correct warning if user is not authenticated', () => {
    const allowedActions = [
      REGISTRATION_EDIT_ACTIONS.COPY,
      REGISTRATION_EDIT_ACTIONS.SHOW_PARTICIPANTS,
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
      waitingAttendeeCapacity,
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
        waitingAttendeeCapacity: null,
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
    expect(waitingAttendeeCapacity).toBe('');
  });
});
