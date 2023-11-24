/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloError } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { ROUTES } from '../../../constants';
import {
  CreateSeatsReservationDocument,
  UpdateSeatsReservationDocument,
} from '../../../generated/graphql';
import formatDate from '../../../utils/formatDate';
import { fakeAuthenticatedAuthContextValue } from '../../../utils/mockAuthContextValue';
import {
  fakeSeatsReservation,
  getMockedSeatsReservationData,
  setSignupGroupFormSessionStorageValues,
} from '../../../utils/mockDataUtils';
import {
  actWait,
  configure,
  loadingSpinnerIsNotInDocument,
  renderWithRoute,
  screen,
  userEvent,
  waitFor,
  within,
} from '../../../utils/testUtils';
import {
  mockedLanguagesResponse,
  mockedServiceLanguagesResponse,
} from '../../language/__mocks__/language';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import { mockedPlaceResponse } from '../../place/__mocks__/place';
import {
  mockedPastRegistrationResponse,
  mockedRegistrationResponse,
  registration,
  registrationId,
} from '../../registration/__mocks__/registration';
import { TEST_SEATS_RESERVATION_CODE } from '../../seatsReservation/constants';
import { mockedRegistrationUserResponse } from '../../user/__mocks__/user';
import {
  contactPersonValues,
  mockedCreateSignupGroupResponse,
  mockedCreateSignupResponse,
  mockedInvalidCreateSignupGroupResponse,
  mockedInvalidCreateSignupResponse,
  signupGroupValues,
  signupGroupWithSingleSignupValues,
  signupValues,
} from '../__mocks__/createSignupGroupPage';
import CreateSignupGroupPage from '../CreateSignupGroupPage';
import { findFirstNameInputs, getSignupFormElement } from './testUtils';

configure({ defaultHidden: true });

beforeEach(() => {
  // values stored in tests will also be available in other tests unless you run
  localStorage.clear();
  sessionStorage.clear();
});

const findCreateButton = () =>
  screen.findByRole('button', { name: /lähetä ilmoittautuminen/i });

const authContextValue = fakeAuthenticatedAuthContextValue();

const code = TEST_SEATS_RESERVATION_CODE;

const seatsReservation = fakeSeatsReservation({ code });

const getCreateSeatsReservationMock = (seats: number): MockedResponse => {
  const createSeatsReservationPayload = {
    registration: registration.id,
    seats,
  };
  const createSeatsReservationVariables = {
    input: createSeatsReservationPayload,
  };

  const createSeatsReservationResponse = {
    data: {
      createSeatsReservation: {
        ...seatsReservation,
        seats,
        seatsAtEvent: seats,
      },
    },
  };

  return {
    request: {
      query: CreateSeatsReservationDocument,
      variables: createSeatsReservationVariables,
    },
    result: createSeatsReservationResponse,
  };
};

const getUpdateSeatsReservationMock = (
  id: string,
  seats: number
): MockedResponse => {
  const updateSeatsReservationPayload = {
    code,
    registration: registration.id,
    seats,
  };

  const updateSeatsReservationVariables = {
    id,
    input: updateSeatsReservationPayload,
  };

  const updateSeatsReservationResponse = {
    data: {
      updateSeatsReservation: {
        ...seatsReservation,
        seats,
      },
    },
  };

  return {
    request: {
      query: UpdateSeatsReservationDocument,
      variables: updateSeatsReservationVariables,
    },
    result: updateSeatsReservationResponse,
  };
};

const getUpdateSeatsReservationErrorMock = (
  id: string,
  seats: number
): MockedResponse => {
  const updateSeatsReservationPayload = {
    code,
    registration: registration.id,
    seats,
  };
  const updateSeatsReservationVariables = {
    id,
    input: updateSeatsReservationPayload,
  };

  const error = new ApolloError({
    networkError: {
      result: 'Not enough seats available. Capacity left: 0.',
    } as any,
  });

  return {
    request: {
      query: UpdateSeatsReservationDocument,
      variables: updateSeatsReservationVariables,
    },
    error,
  };
};

const mockedCreateSeatsReservation = getCreateSeatsReservationMock(1);
const reservationId = (mockedCreateSeatsReservation?.result as any).data
  ?.createSeatsReservation.id;

const baseMocks = [
  mockedLanguagesResponse,
  mockedServiceLanguagesResponse,
  mockedOrganizationAncestorsResponse,
  mockedPlaceResponse,
  mockedRegistrationUserResponse,
  mockedCreateSeatsReservation,
];

const defaultMocks = [...baseMocks, mockedRegistrationResponse];

const route = ROUTES.CREATE_SIGNUP_GROUP.replace(
  ':registrationId',
  registrationId
);

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  renderWithRoute(<CreateSignupGroupPage />, {
    authContextValue,
    mocks,
    routes: [route],
    path: ROUTES.CREATE_SIGNUP_GROUP,
  });

const waitLoadingAndFindNameInput = async () => {
  await loadingSpinnerIsNotInDocument();
  const nameInput = (await findFirstNameInputs())[0];
  return nameInput;
};

test('should validate signup group form fields', async () => {
  const user = userEvent.setup();

  renderComponent();

  const firstNameInput = await waitLoadingAndFindNameInput();
  const lastNameInput = getSignupFormElement('lastNameInput');
  const streetAddressInput = getSignupFormElement('streetAddressInput');
  const dateOfBirthInput = getSignupFormElement('dateOfBirthInput');
  const zipInput = getSignupFormElement('zipInput');
  const cityInput = getSignupFormElement('cityInput');
  const emailInput = getSignupFormElement('emailInput');
  const phoneInput = getSignupFormElement('phoneInput');
  const nativeLanguageButton = getSignupFormElement('nativeLanguageButton');
  const createButton = await findCreateButton();

  await user.type(firstNameInput, signupValues.firstName);
  await user.type(lastNameInput, signupValues.lastName);
  await user.type(streetAddressInput, signupValues.streetAddress);
  await user.type(dateOfBirthInput, formatDate(signupValues.dateOfBirth));
  await user.type(zipInput, signupValues.zipcode);
  await user.type(cityInput, signupValues.city);
  await user.click(createButton);

  await waitFor(() => expect(emailInput).toHaveFocus());
  expect(emailInput).toBeRequired();
  expect(phoneInput).not.toBeRequired();

  await user.type(emailInput, contactPersonValues.email);
  await user.type(phoneInput, contactPersonValues.phoneNumber);
  await user.click(createButton);

  await waitFor(() => expect(nativeLanguageButton).toHaveFocus());
});

test('should route to signup list page after creating a signup', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedCreateSignupResponse,
  ]);

  setSignupGroupFormSessionStorageValues({
    registrationId: registration.id as string,
    seatsReservation: getMockedSeatsReservationData(1000),
    signupGroupFormValues: signupGroupWithSingleSignupValues,
  });

  await loadingSpinnerIsNotInDocument();

  const createButton = await findCreateButton();
  await user.click(createButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registration.id}/signups`
    )
  );
});

test('should route to signup list page after creating a signup group', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedCreateSignupGroupResponse,
  ]);

  setSignupGroupFormSessionStorageValues({
    registrationId: registration.id as string,
    seatsReservation: getMockedSeatsReservationData(1000),
    signupGroupFormValues: signupGroupValues,
  });

  await loadingSpinnerIsNotInDocument();

  const createButton = await findCreateButton();
  await user.click(createButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registration.id}/signups`
    )
  );
});

test('should show server errors if creating signup fails', async () => {
  const user = userEvent.setup();

  setSignupGroupFormSessionStorageValues({
    registrationId: registration.id as string,
    seatsReservation: getMockedSeatsReservationData(1000),
    signupGroupFormValues: signupGroupWithSingleSignupValues,
  });

  renderComponent([...defaultMocks, mockedInvalidCreateSignupResponse]);

  await loadingSpinnerIsNotInDocument();

  const createButton = await findCreateButton();
  await user.click(createButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Tämän kentän arvo ei voi olla "null"./i);
});

test('should show server errors if creating signup group fails', async () => {
  const user = userEvent.setup();

  setSignupGroupFormSessionStorageValues({
    registrationId: registration.id as string,
    seatsReservation: getMockedSeatsReservationData(1000),
    signupGroupFormValues: signupGroupValues,
  });

  renderComponent([...defaultMocks, mockedInvalidCreateSignupGroupResponse]);

  await loadingSpinnerIsNotInDocument();

  const createButton = await findCreateButton();
  await user.click(createButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Tämän kentän arvo ei voi olla "null"./i);
});

test('should show signup is closed text if enrolment end date is in the past', async () => {
  renderComponent([...baseMocks, mockedPastRegistrationResponse]);

  await loadingSpinnerIsNotInDocument();

  await screen.findByText(/ilmoittautuminen tapahtumaan on päättynyt/i);
});

test('should add and delete participants', async () => {
  const user = userEvent.setup();

  renderComponent([
    ...defaultMocks,
    getUpdateSeatsReservationMock(reservationId, 1),
    getUpdateSeatsReservationMock(reservationId, 2),
  ]);

  await waitLoadingAndFindNameInput();

  const participantAmountInput = getSignupFormElement('participantAmountInput');
  const updateParticipantAmountButton = getSignupFormElement(
    'updateParticipantAmountButton'
  );

  expect(
    screen.queryByRole('button', { name: 'Osallistuja 2' })
  ).not.toBeInTheDocument();

  await user.clear(participantAmountInput);
  await user.type(participantAmountInput, '2');
  await user.click(updateParticipantAmountButton);

  await screen.findByRole('button', { name: 'Osallistuja 2' });

  await user.clear(participantAmountInput);
  await user.type(participantAmountInput, '1');
  await user.click(updateParticipantAmountButton);

  const confirmDeleteButton = within(
    getSignupFormElement('confirmDeleteModal')
  ).getByRole('button', { name: 'Poista osallistuja' });
  await user.click(confirmDeleteButton);

  await waitFor(() =>
    expect(
      screen.queryByRole('button', { name: 'Osallistuja 2' })
    ).not.toBeInTheDocument()
  );
  await actWait(100);
});

test('should show server errors when updating seats reservation fails', async () => {
  const user = userEvent.setup();

  renderComponent([
    ...defaultMocks,
    getUpdateSeatsReservationErrorMock(reservationId, 2),
  ]);

  await waitLoadingAndFindNameInput();

  const participantAmountInput = getSignupFormElement('participantAmountInput');
  const updateParticipantAmountButton = getSignupFormElement(
    'updateParticipantAmountButton'
  );

  await waitFor(() =>
    expect(
      screen.queryByRole('button', { name: 'Osallistuja 2' })
    ).not.toBeInTheDocument()
  );

  await user.clear(participantAmountInput);
  await user.type(participantAmountInput, '2');
  await user.click(updateParticipantAmountButton);

  await screen.findByText(
    'Paikkoja ei ole riittävästi jäljellä. Paikkoja jäljellä: 0.'
  );
});

test('should show and hide participant specific fields', async () => {
  const user = userEvent.setup();

  renderComponent();

  await waitLoadingAndFindNameInput();
  const toggleButton = screen.getByRole('button', {
    name: 'Osallistuja 1',
  });

  await user.click(toggleButton);
  expect(
    screen.queryByRole('group', { name: /ilmoittautujan perustiedot/i })
  ).not.toBeInTheDocument();

  await user.click(toggleButton);
  expect(
    screen.getByRole('group', { name: /ilmoittautujan perustiedot/i })
  ).toBeInTheDocument();
});

test('should delete participants by clicking delete participant button', async () => {
  const user = userEvent.setup();

  renderComponent([
    ...defaultMocks,
    getUpdateSeatsReservationMock(reservationId, 1),
    getUpdateSeatsReservationMock(reservationId, 2),
  ]);

  await waitLoadingAndFindNameInput();

  const participantAmountInput = getSignupFormElement('participantAmountInput');
  const updateParticipantAmountButton = getSignupFormElement(
    'updateParticipantAmountButton'
  );

  expect(
    screen.queryByRole('button', { name: 'Osallistuja 2' })
  ).not.toBeInTheDocument();

  await user.clear(participantAmountInput);
  await user.type(participantAmountInput, '2');
  await user.click(updateParticipantAmountButton);

  await screen.findByRole('button', { name: 'Osallistuja 2' });

  const deleteButton = screen.getAllByRole('button', {
    name: /poista osallistuja/i,
  })[1];
  await user.click(deleteButton);

  const deleteParticipantButton = within(
    getSignupFormElement('confirmDeleteModal')
  ).getByRole('button', { name: 'Poista osallistuja' });
  await user.click(deleteParticipantButton);

  await waitFor(() =>
    expect(
      screen.queryByRole('button', { name: 'Osallistuja 2' })
    ).not.toBeInTheDocument()
  );
  expect(participantAmountInput).toHaveValue(1);
});

test('should show server errors when updating seats reservation fails', async () => {
  const user = userEvent.setup();

  renderComponent([
    ...defaultMocks,
    getUpdateSeatsReservationMock(reservationId, 3),
    getUpdateSeatsReservationErrorMock(reservationId, 2),
  ]);

  await waitLoadingAndFindNameInput();

  const participantAmountInput = getSignupFormElement('participantAmountInput');
  const updateParticipantAmountButton = getSignupFormElement(
    'updateParticipantAmountButton'
  );

  await user.clear(participantAmountInput);
  await user.type(participantAmountInput, '3');
  await user.click(updateParticipantAmountButton);

  await screen.findByRole('button', { name: 'Osallistuja 3' });

  const deleteButton = screen.getAllByRole('button', {
    name: /poista osallistuja/i,
  })[1];
  await user.click(deleteButton);

  const dialog = screen.getByRole('dialog', {
    name: 'Vahvista osallistujan poistaminen',
  });
  const deleteParticipantButton = within(dialog).getByRole('button', {
    name: 'Poista osallistuja',
  });
  await user.click(deleteParticipantButton);

  await screen.findByText(
    'Paikkoja ei ole riittävästi jäljellä. Paikkoja jäljellä: 0.'
  );
});
