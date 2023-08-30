/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloError } from '@apollo/client';
import { MockedResponse } from '@apollo/client/testing';
import React from 'react';

import { ROUTES } from '../../../constants';
import {
  CreateSeatsReservationDocument,
  UpdateSeatsReservationDocument,
} from '../../../generated/graphql';
import { fakeAuthenticatedAuthContextValue } from '../../../utils/mockAuthContextValue';
import { fakeSeatsReservation } from '../../../utils/mockDataUtils';
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
  mockedRegistrationResponse,
  registration,
  registrationId,
} from '../../registration/__mocks__/registration';
import { TEST_SEATS_RESERVATION_CODE } from '../../reserveSeats/constants';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  mockedCreateSignupGroupResponse,
  mockedInvalidCreateSignupGroupResponse,
  signupValues,
} from '../__mocks__/createSignupGroupPage';
import CreateSignupGroupPage from '../CreateSignupGroupPage';

configure({ defaultHidden: true });

beforeEach(() => {
  // values stored in tests will also be available in other tests unless you run
  localStorage.clear();
  sessionStorage.clear();
});

const findElement = (key: 'firstNameInput' | 'submitButton') => {
  switch (key) {
    case 'firstNameInput':
      return screen.findByLabelText(/etunimi/i);
    case 'submitButton':
      return screen.findByRole('button', { name: /tallenna osallistuja/i });
  }
};

const getElement = (
  key:
    | 'cityInput'
    | 'confirmDeleteModal'
    | 'dateOfBirthInput'
    | 'emailCheckbox'
    | 'emailInput'
    | 'firstNameInput'
    | 'lastNameInput'
    | 'nativeLanguageButton'
    | 'participantAmountInput'
    | 'phoneCheckbox'
    | 'phoneInput'
    | 'serviceLanguageButton'
    | 'streetAddressInput'
    | 'submitButton'
    | 'updateParticipantAmountButton'
    | 'zipInput'
) => {
  switch (key) {
    case 'cityInput':
      return screen.getByLabelText(/kaupunki/i);
    case 'confirmDeleteModal':
      return screen.getByRole('dialog', {
        name: 'Vahvista osallistujan poistaminen',
      });
    case 'dateOfBirthInput':
      return screen.getByLabelText(/syntymäaika/i);
    case 'emailCheckbox':
      return screen.getByLabelText(/sähköpostilla/i);
    case 'emailInput':
      return screen.getByLabelText(/sähköpostiosoite/i);
    case 'firstNameInput':
      return screen.getByLabelText(/etunimi/i);
    case 'lastNameInput':
      return screen.getByLabelText(/sukunimi/i);
    case 'nativeLanguageButton':
      return screen.getByRole('button', { name: /äidinkieli/i });
    case 'participantAmountInput':
      return screen.getByRole('spinbutton', {
        name: /ilmoittautujien määrä \*/i,
      });
    case 'phoneCheckbox':
      return screen.getByLabelText(/tekstiviestillä/i);
    case 'phoneInput':
      return screen.getByLabelText(/puhelinnumero/i);
    case 'serviceLanguageButton':
      return screen.getByRole('button', { name: /asiointikieli/i });
    case 'streetAddressInput':
      return screen.getByLabelText(/katuosoite/i);
    case 'submitButton':
      return screen.getByRole('button', { name: /tallenna osallistuja/i });
    case 'updateParticipantAmountButton':
      return screen.getByRole('button', { name: /päivitä/i });
    case 'zipInput':
      return screen.getByLabelText(/postinumero/i);
  }
};

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

const defaultMocks = [
  mockedLanguagesResponse,
  mockedServiceLanguagesResponse,
  mockedOrganizationAncestorsResponse,
  mockedPlaceResponse,
  mockedRegistrationResponse,
  mockedUserResponse,
  mockedCreateSeatsReservation,
];

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
  const nameInput = await findElement('firstNameInput');
  return nameInput;
};

const enterFormValues = async () => {
  const user = userEvent.setup();

  const firstNameInput = await waitLoadingAndFindNameInput();
  const lastNameInput = getElement('lastNameInput');
  const streetAddressInput = getElement('streetAddressInput');
  const dateOfBirthInput = getElement('dateOfBirthInput');
  const zipInput = getElement('zipInput');
  const cityInput = getElement('cityInput');
  const emailInput = getElement('emailInput');
  const phoneInput = getElement('phoneInput');
  const nativeLanguageButton = getElement('nativeLanguageButton');
  const serviceLanguageButton = getElement('serviceLanguageButton');

  await user.type(firstNameInput, signupValues.firstName);
  await user.type(lastNameInput, signupValues.lastName);
  await user.type(streetAddressInput, signupValues.streetAddress);
  await user.type(dateOfBirthInput, signupValues.dateOfBirth);
  await user.type(zipInput, signupValues.zip);
  await user.type(cityInput, signupValues.city);
  await user.type(emailInput, signupValues.email);
  await user.type(phoneInput, signupValues.phone);
  await user.click(nativeLanguageButton);
  const nativeLanguageOption = await screen.findByRole('option', {
    name: /suomi/i,
  });
  await user.click(nativeLanguageOption);
  await user.click(serviceLanguageButton);
  const serviceLanguageOption = await screen.findByRole('option', {
    name: /suomi/i,
  });
  await user.click(serviceLanguageOption);
};

test('should validate signup group form and focus to invalid field and finally create signup group', async () => {
  const user = userEvent.setup();

  const { history } = renderComponent([
    ...defaultMocks,
    mockedCreateSignupGroupResponse,
  ]);

  const firstNameInput = await waitLoadingAndFindNameInput();
  const lastNameInput = getElement('lastNameInput');
  const streetAddressInput = getElement('streetAddressInput');
  const dateOfBirthInput = getElement('dateOfBirthInput');
  const zipInput = getElement('zipInput');
  const cityInput = getElement('cityInput');
  const emailInput = getElement('emailInput');
  const phoneInput = getElement('phoneInput');
  const nativeLanguageButton = getElement('nativeLanguageButton');
  const serviceLanguageButton = getElement('serviceLanguageButton');
  const submitButton = await findElement('submitButton');

  await user.type(firstNameInput, signupValues.firstName);
  await user.type(lastNameInput, signupValues.lastName);
  await user.type(streetAddressInput, signupValues.streetAddress);
  await user.type(dateOfBirthInput, signupValues.dateOfBirth);
  await user.type(zipInput, signupValues.zip);
  await user.type(cityInput, signupValues.city);
  await user.click(submitButton);

  await waitFor(() => expect(emailInput).toHaveFocus());
  expect(emailInput).toBeRequired();
  expect(phoneInput).not.toBeRequired();

  await user.type(emailInput, signupValues.email);
  await user.type(phoneInput, signupValues.phone);
  await user.click(submitButton);

  await waitFor(() => expect(nativeLanguageButton).toHaveFocus());

  await user.click(nativeLanguageButton);
  const nativeLanguageOption = await screen.findByRole('option', {
    name: /suomi/i,
  });
  await user.click(nativeLanguageOption);
  await user.click(serviceLanguageButton);
  const serviceLanguageOption = await screen.findByRole('option', {
    name: /suomi/i,
  });
  await user.click(serviceLanguageOption);
  await user.click(submitButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/${registration.id}/enrolments`
    )
  );
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedInvalidCreateSignupGroupResponse]);

  const submitButton = await findElement('submitButton');

  await enterFormValues();
  await user.click(submitButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Tämän kentän arvo ei voi olla "null"./i);
});

test('should add and delete participants', async () => {
  const user = userEvent.setup();

  renderComponent([
    ...defaultMocks,
    getUpdateSeatsReservationMock(reservationId, 1),
    getUpdateSeatsReservationMock(reservationId, 2),
  ]);

  await waitLoadingAndFindNameInput();

  const participantAmountInput = getElement('participantAmountInput');
  const updateParticipantAmountButton = getElement(
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
    getElement('confirmDeleteModal')
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

  const participantAmountInput = getElement('participantAmountInput');
  const updateParticipantAmountButton = getElement(
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

  const nameInput = await waitLoadingAndFindNameInput();
  const toggleButton = screen.getByRole('button', {
    name: 'Osallistuja 1',
  });

  await user.click(toggleButton);
  expect(nameInput).not.toBeInTheDocument();

  await user.click(toggleButton);
  getElement('firstNameInput');
});

test('should delete participants by clicking delete participant button', async () => {
  const user = userEvent.setup();

  renderComponent([
    ...defaultMocks,
    getUpdateSeatsReservationMock(reservationId, 1),
    getUpdateSeatsReservationMock(reservationId, 2),
  ]);

  await waitLoadingAndFindNameInput();

  const participantAmountInput = getElement('participantAmountInput');
  const updateParticipantAmountButton = getElement(
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
    getElement('confirmDeleteModal')
  ).getByRole('button', { name: 'Poista osallistuja' });
  await user.click(deleteParticipantButton);

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
    getUpdateSeatsReservationMock(reservationId, 3),
    getUpdateSeatsReservationErrorMock(reservationId, 2),
  ]);

  await waitLoadingAndFindNameInput();

  const participantAmountInput = getElement('participantAmountInput');
  const updateParticipantAmountButton = getElement(
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
