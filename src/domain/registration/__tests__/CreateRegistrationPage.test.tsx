/* eslint-disable no-console */

import { FormikState } from 'formik';
import { advanceTo, clear } from 'jest-date-mock';
import React from 'react';
import { toast } from 'react-toastify';

import { FORM_NAMES } from '../../../constants';
import { fakeAuthenticatedStoreState } from '../../../utils/mockStoreUtils';
import {
  act,
  configure,
  getMockReduxStore,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import { REGISTRATION_INITIAL_VALUES } from '../constants';
import CreateRegistrationPage from '../CreateRegistrationPage';
import { RegistrationFormFields } from '../types';

configure({ defaultHidden: true });

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

beforeEach(() => clear());

const renderComponent = () => render(<CreateRegistrationPage />, { store });

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

const getElement = (key: 'enrolmentStartTime' | 'saveButton') => {
  switch (key) {
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
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  const enrolmentStartTimeTextbox = getElement('enrolmentStartTime');
  const saveButton = getElement('saveButton');

  act(() => userEvent.click(saveButton));

  await waitFor(() => expect(enrolmentStartTimeTextbox).toHaveFocus());
});

test('should show alert toast message when trying to save registration', async () => {
  advanceTo('2020-07-05');
  toast.error = jest.fn();
  setFormValues({
    ...REGISTRATION_INITIAL_VALUES,
    enrolmentEndTime: new Date('2020-12-31T21:00:00.000Z'),
    enrolmentStartTime: new Date('2020-12-31T18:00:00.000Z'),
  });

  renderComponent();

  await loadingSpinnerIsNotInDocument();

  const saveButton = getElement('saveButton');

  userEvent.click(saveButton);

  await waitFor(() =>
    expect(toast.error).toBeCalledWith(
      'TODO: Save registration when API is available'
    )
  );
});
