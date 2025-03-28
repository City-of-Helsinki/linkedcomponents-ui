/* eslint-disable max-len */
import { MockedResponse } from '@apollo/client/testing';
import { FormikState } from 'formik';

import { mockedEventResponse } from '../../../common/components/eventSelector/__mocks__/eventSelector';
import { mockedRegistrationEventSelectorEventsResponse } from '../../../common/components/formFields/registrationEventSelectorField/__mocks__/registrationEventSelectorField';
import { DATE_FORMAT, FORM_NAMES } from '../../../constants';
import formatDate from '../../../utils/formatDate';
import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import { mockedOrganizationAccountsResponse } from '../../organization/__mocks__/organization';
import {
  mockedDefaultPriceGroupsResponse,
  mockedPublisherPriceGroupsResponse,
} from '../../priceGroup/__mocks__/priceGroups';
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

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  vi.useRealTimers();
  localStorage.clear();
  sessionStorage.clear();
  mockAuthenticatedLoginState();
});

const commonMocks = [
  mockedDefaultPriceGroupsResponse,
  mockedPublisherPriceGroupsResponse,
  mockedEventResponse,
  mockedRegistrationEventSelectorEventsResponse,
  mockedOrganizationAccountsResponse,
  mockedUserResponse,
];

const renderComponent = (mocks: MockedResponse[] = commonMocks) =>
  render(<CreateRegistrationPage />, { mocks });

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

const findSaveButton = () =>
  screen.findByRole('button', {
    name: /tallenna ilmoittautuminen/i,
  });

const getElement = (
  key: 'eventCombobox' | 'enrolmentStartTime' | 'saveButton'
) => {
  switch (key) {
    case 'eventCombobox':
      return screen.getByRole('button', { name: /tapahtuma/i });
    case 'enrolmentStartTime':
      return screen.getByRole('textbox', { name: 'Ilmoittautuminen alkaa *' });
    case 'saveButton':
      return screen.getByRole('button', { name: /tallenna ilmoittautuminen/i });
  }
};

const waitLoadingAndGetSaveButton = async () => {
  await loadingSpinnerIsNotInDocument();

  return await findSaveButton();
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
