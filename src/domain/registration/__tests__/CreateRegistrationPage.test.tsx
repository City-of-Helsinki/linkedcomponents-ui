import { MockedResponse } from '@apollo/client/testing';
import { FormikState } from 'formik';
import { advanceTo, clear } from 'jest-date-mock';
import React from 'react';

import { FORM_NAMES } from '../../../constants';
import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  configure,
  getMockReduxStore,
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

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

beforeEach(() => clear());

const renderComponent = (mocks: MockedResponse[] = []) =>
  render(<CreateRegistrationPage />, { mocks, store });

beforeEach(() => {
  // values stored with FormikPersist will also be available in other tests unless you run
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

  jest.spyOn(sessionStorage, 'getItem').mockImplementation((key: string) => {
    switch (key) {
      case FORM_NAMES.REGISTRATION_FORM:
        return JSON.stringify(state);
      default:
        return '';
    }
  });
};

const getElement = (
  key: 'eventCombobox' | 'enrolmentStartTime' | 'saveButton'
) => {
  switch (key) {
    case 'eventCombobox':
      return screen.getByRole('combobox', {
        name: /tapahtuma/i,
      });
    case 'enrolmentStartTime':
      return screen.getByRole('textbox', {
        name: /Ilmoittautuminen alkaa/i,
      });
    case 'saveButton':
      return screen.getByRole('button', {
        name: /tallenna ilmoittautuminen/i,
      });
  }
};

test('should focus to first validation error when trying to save new registration', async () => {
  global.HTMLFormElement.prototype.submit = () => jest.fn();
  renderComponent([mockedUserResponse]);

  await loadingSpinnerIsNotInDocument();

  const eventCombobox = getElement('eventCombobox');
  const saveButton = getElement('saveButton');
  userEvent.click(saveButton);

  await waitFor(() => expect(eventCombobox).toHaveFocus());
});

test('should move to registration page after creating new registration', async () => {
  advanceTo('2020-07-05');
  setFormValues({
    ...REGISTRATION_INITIAL_VALUES,
    ...registrationValues,
  });

  const { history } = renderComponent([
    mockedCreateRegistrationResponse,
    mockedUserResponse,
  ]);

  await loadingSpinnerIsNotInDocument();

  const saveButton = getElement('saveButton');
  userEvent.click(saveButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(
      `/fi/registrations/completed/${registrationId}`
    )
  );
});

test('should show server errors', async () => {
  advanceTo('2020-07-05');
  setFormValues({
    ...REGISTRATION_INITIAL_VALUES,
    ...registrationValues,
  });

  const mocks = [mockedInvalidCreateRegistrationResponse, mockedUserResponse];
  renderComponent(mocks);

  await loadingSpinnerIsNotInDocument();

  const saveButton = getElement('saveButton');
  userEvent.click(saveButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Tämän kentän arvo ei voi olla "null"./i);
});
