/* eslint-disable max-len */
import { MockedResponse } from '@apollo/client/testing';
import { FormikState } from 'formik';
import React from 'react';

import { mockedEventResponse } from '../../../common/components/eventSelector/__mocks__/eventSelector';
import { mockedRegistrationEventSelectorEventsResponse } from '../../../common/components/formFields/registrationEventSelectorField/__mocks__/registrationEventSelectorField';
import { DATE_FORMAT, FORM_NAMES } from '../../../constants';
import formatDate from '../../../utils/formatDate';
import { fakeAuthenticatedAuthContextValue } from '../../../utils/mockAuthContextValue';
import {
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  mockedCreateRegistrationResponse,
  mockedInvalidCreateRegistrationResponse,
  registrationValues,
} from '../__mocks__/createRegistrationPage';
import { registrationId } from '../__mocks__/editRegistrationPage';
import { REGISTRATION_INITIAL_VALUES } from '../constants';
import CreateRegistrationPage from '../CreateRegistrationPage';
import { RegistrationFormFields } from '../types';

configure({ defaultHidden: true });

const authContextValue = fakeAuthenticatedAuthContextValue();

beforeEach(() => {
  vi.useRealTimers();
});

const commonMocks = [
  mockedEventResponse,
  mockedRegistrationEventSelectorEventsResponse,
  mockedUserResponse,
];

const renderComponent = (mocks: MockedResponse[] = commonMocks) =>
  render(<CreateRegistrationPage />, { authContextValue, mocks });

beforeEach(() => {
  // values stored in tests will also be available in other tests unless you run
  localStorage.clear();
  sessionStorage.clear();
});

const setFormValues = (values: RegistrationFormFields) => {
  const state: FormikState<RegistrationFormFields> = {
    errors: {},
    isSubmitting: false,
    isValidating: false,
    submitCount: 0,
    touched: {},
    values,
  };
  sessionStorage.setItem(FORM_NAMES.REGISTRATION_FORM, JSON.stringify(state));
};

const findElement = (key: 'saveButton') => {
  switch (key) {
    case 'saveButton':
      return screen.findByRole('button', {
        name: /tallenna ilmoittautuminen/i,
      });
  }
};

const getElement = (
  key: 'eventCombobox' | 'enrolmentStartTime' | 'saveButton'
) => {
  switch (key) {
    case 'eventCombobox':
      return screen.getByRole('combobox', { name: /tapahtuma/i });
    case 'enrolmentStartTime':
      return screen.getByRole('textbox', { name: 'Ilmoittautuminen alkaa *' });
    case 'saveButton':
      return screen.getByRole('button', { name: /tallenna ilmoittautuminen/i });
  }
};

const waitLoadingAndGetSaveButton = async () => {
  await loadingSpinnerIsNotInDocument();

  return await findElement('saveButton');
};

test('should focus to first validation error when trying to save new registration', async () => {
  global.HTMLFormElement.prototype.submit = () => vi.fn();
  const user = userEvent.setup();
  renderComponent();

  const saveButton = await waitLoadingAndGetSaveButton();
  const eventCombobox = getElement('eventCombobox');

  await user.click(saveButton);

  await waitFor(() => expect(eventCombobox).toHaveFocus());
});

test('should move to registration completed page after creating new registration', async () => {
  vi.setSystemTime('2020-07-05');
  setFormValues({
    ...REGISTRATION_INITIAL_VALUES,
    ...registrationValues,
  });

  const user = userEvent.setup();
  const { history } = renderComponent([
    ...commonMocks,
    mockedCreateRegistrationResponse,
  ]);

  const saveButton = await waitLoadingAndGetSaveButton();
  const startTimeInput = getElement('enrolmentStartTime');

  const expectedValue = formatDate(
    registrationValues.enrolmentStartTimeDate,
    DATE_FORMAT
  );
  await waitFor(() => expect(startTimeInput).toHaveValue(expectedValue));

  await waitFor(() => expect(saveButton).toBeEnabled());
  await user.click(saveButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/completed/${registrationId}`
    )
  );
});

test('should show server errors', async () => {
  vi.setSystemTime('2020-07-05');
  setFormValues({
    ...REGISTRATION_INITIAL_VALUES,
    ...registrationValues,
  });

  const mocks = [
    ...commonMocks,
    mockedInvalidCreateRegistrationResponse,
    mockedUserResponse,
  ];
  const user = userEvent.setup();
  renderComponent(mocks);

  const saveButton = await waitLoadingAndGetSaveButton();
  const startTimeInput = getElement('enrolmentStartTime');

  const expectedValue = formatDate(
    registrationValues.enrolmentStartTimeDate,
    DATE_FORMAT
  );
  await waitFor(() => expect(startTimeInput).toHaveValue(expectedValue));

  await waitFor(() => expect(saveButton).toBeEnabled());
  await user.click(saveButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Tämän kentän arvo ei voi olla "null"./i);
});
