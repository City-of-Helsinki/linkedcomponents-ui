import { MockedResponse } from '@apollo/client/testing';

import {
  DeleteRegistrationDocument,
  EventDocument,
  RegistrationDocument,
  UpdateRegistrationDocument,
} from '../../../generated/graphql';
import { fakeEvent, fakeRegistration } from '../../../utils/mockDataUtils';
import { EVENT_INCLUDES, TEST_EVENT_ID } from '../../event/constants';
import { TEST_PUBLISHER_ID } from '../../organization/constants';
import { REGISTRATION_INCLUDES, TEST_REGISTRATION_ID } from '../constants';

const publisher = TEST_PUBLISHER_ID;
const registrationId = TEST_REGISTRATION_ID;

const registrationOverrides = {
  id: registrationId,
  audienceMaxAge: 18,
  audienceMinAge: 12,
  confirmationMessage: 'Confirmation message',
  enrolmentEndTime: '2020-09-30T16:00:00.000Z',
  enrolmentStartTime: '2020-09-27T15:00:00.000Z',
  event: TEST_EVENT_ID,
  instructions: 'Instructions',
  maximumAttendeeCapacity: 100,
  minimumAttendeeCapacity: 10,
  waitingListCapacity: 5,
};

const registration = fakeRegistration(registrationOverrides);
const registrationVariables = {
  createPath: undefined,
  id: registrationId,
  include: REGISTRATION_INCLUDES,
};
const registrationResponse = { data: { registration } };
const mockedRegistrationResponse: MockedResponse = {
  request: { query: RegistrationDocument, variables: registrationVariables },
  result: registrationResponse,
};

const event = fakeEvent({ id: TEST_EVENT_ID, publisher });
const eventVariables = {
  createPath: undefined,
  id: TEST_EVENT_ID,
  include: EVENT_INCLUDES,
};
const eventResponse = { data: { event: event } };
const mockedEventResponse = {
  request: { query: EventDocument, variables: eventVariables },
  result: eventResponse,
};

const mockedNotFoundRegistrationResponse: MockedResponse = {
  request: {
    query: RegistrationDocument,
    variables: { ...registrationVariables, id: 'not-exist' },
  },
  error: new Error(),
};

const deleteRegistrationVariables = { id: registrationId };
const deleteRegistrationResponse = { data: { deleteRegistration: null } };
const mockedDeleteRegistrationResponse: MockedResponse = {
  request: {
    query: DeleteRegistrationDocument,
    variables: deleteRegistrationVariables,
  },
  result: deleteRegistrationResponse,
};

const updatedLastModifiedTime = '2021-08-23T12:00:00.000Z';
const updateRegistrationVariables = { input: registrationOverrides };
const updatedRegistration = {
  ...registration,
  lastModifiedAt: updatedLastModifiedTime,
};
const updateRegistrationResponse = {
  data: { updateRegistration: updatedRegistration },
};
const updatedRegistrationResponse = {
  data: { registration: updatedRegistration },
};
const mockedUpdateRegistrationResponse: MockedResponse = {
  request: {
    query: UpdateRegistrationDocument,
    variables: updateRegistrationVariables,
  },
  result: updateRegistrationResponse,
};
const mockedUpdatedRegistationResponse: MockedResponse = {
  request: { query: RegistrationDocument, variables: registrationVariables },
  result: updatedRegistrationResponse,
};

const mockedInvalidUpdateRegistrationResponse: MockedResponse = {
  request: {
    query: UpdateRegistrationDocument,
    variables: updateRegistrationVariables,
  },
  error: {
    ...new Error(),
    result: {
      event: ['Tämän kentän arvo ei voi olla "null".'],
    },
  } as Error,
};

export {
  event,
  mockedDeleteRegistrationResponse,
  mockedEventResponse,
  mockedInvalidUpdateRegistrationResponse,
  mockedNotFoundRegistrationResponse,
  mockedRegistrationResponse,
  mockedUpdatedRegistationResponse,
  mockedUpdateRegistrationResponse,
  publisher,
  registration,
  registrationId,
  updatedLastModifiedTime,
};
