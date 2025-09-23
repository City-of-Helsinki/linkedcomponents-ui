import { MockedResponse } from '@apollo/client/testing';

import getValue from '../../../utils/getValue';
import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  shouldApplyExpectedMetaData,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import {
  mockedOrganizationClassesResponse,
  mockedOrganizationClassResponse,
  organizationClassName,
} from '../../organizationClass/__mocks__/organizationClass';
import {
  mockedOrganizationsResponse,
  organizations,
} from '../../organizations/__mocks__/organizationsPage';
import {
  mockedSuperuserResponse,
  mockedUserResponse,
  mockedUsersResponse,
} from '../../user/__mocks__/user';
import {
  mockedCreateOrganizationResponse,
  mockedInvalidCreateOrganizationResponse,
  organizationValues,
} from '../__mocks__/createOrganizationPage';
import CreateOrganizationPage from '../CreateOrganizationPage';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultMocks = [
  mockedOrganizationsResponse,
  mockedOrganizationClassResponse,
  mockedOrganizationClassesResponse,
  mockedSuperuserResponse,
  mockedUsersResponse,
];

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  render(<CreateOrganizationPage />, { mocks });

const getElement = (
  key:
    | 'adminUsersInput'
    | 'classificationToggleButton'
    | 'dissolutionDateInput'
    | 'foundingDateInput'
    | 'internalTypeToggleButton'
    | 'nameInput'
    | 'originIdInput'
    | 'parentInput'
    | 'registrationAdminUsersInput'
    | 'regularUsersInput'
    | 'replacedByInput'
    | 'saveButton'
) => {
  switch (key) {
    case 'adminUsersInput':
      return screen.getByRole('combobox', { name: /Pääkäyttäjät/ });
    case 'classificationToggleButton':
      return screen.getByRole('combobox', { name: /luokittelu/i });
    case 'dissolutionDateInput':
      return screen.getByLabelText(/Lakkautuspäivä/i);
    case 'foundingDateInput':
      return screen.getByLabelText(/Perustuspäivä/i);
    case 'internalTypeToggleButton':
      return screen.getByRole('combobox', { name: /sisäinen tyyppi/i });
    case 'nameInput':
      return screen.getByLabelText(/nimi/i);
    case 'originIdInput':
      return screen.getByLabelText(/lähdetunniste/i);
    case 'parentInput':
      return screen.getByRole('combobox', { name: /pääorganisaatio/i });
    case 'registrationAdminUsersInput':
      return screen.getByRole('combobox', {
        name: /Ilmoittautumisen pääkäyttäjät/,
      });
    case 'regularUsersInput':
      return screen.getByRole('combobox', {
        name: /Peruskäyttäjät/,
      });
    case 'replacedByInput':
      return screen.getByRole('combobox', { name: /Korvaava organisaatio/i });
    case 'saveButton':
      return screen.getByRole('button', { name: /tallenna/i });
  }
};

const fillClassificationField = async () => {
  const user = userEvent.setup();
  const classificationToggleButton = getElement('classificationToggleButton');
  await user.click(classificationToggleButton);

  const option = await screen.findByRole('option', {
    name: organizationClassName,
  });
  await user.click(option);
};

const fillParentField = async () => {
  const user = userEvent.setup();

  await user.click(getElement('parentInput'));

  const organizationOption = await screen.findByRole('option', {
    name: getValue(organizations.data[0]?.name, ''),
  });
  await user.click(organizationOption);
};

const fillInputValues = async () => {
  const user = userEvent.setup();
  await user.type(getElement('originIdInput'), organizationValues.originId);
  await user.type(getElement('nameInput'), organizationValues.name);
  await fillClassificationField();
  await fillParentField();
};

test('shows all fields', async () => {
  renderComponent(defaultMocks);
  await loadingSpinnerIsNotInDocument();

  getElement('originIdInput');
  getElement('nameInput');
  getElement('adminUsersInput');
  getElement('registrationAdminUsersInput');
  getElement('regularUsersInput');
  getElement('internalTypeToggleButton');
  getElement('foundingDateInput');
  getElement('dissolutionDateInput');
  getElement('parentInput');
  getElement('replacedByInput');
});

test('applies expected metadata', async () => {
  renderComponent(defaultMocks);

  await shouldApplyExpectedMetaData({
    expectedDescription: 'Lisää uusi organisaatio Linked Eventsiin.',
    expectedKeywords:
      'lisää, uusi, organisaatio, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    expectedTitle: 'Lisää organisaatio - Linked Events',
  });

  await loadingSpinnerIsNotInDocument();
});

test('should focus to first validation error when trying to save new organization', async () => {
  const user = userEvent.setup();
  renderComponent(defaultMocks);

  await loadingSpinnerIsNotInDocument();

  const originIdInput = getElement('originIdInput');
  const nameInput = getElement('nameInput');
  const parentInput = getElement('parentInput');
  const saveButton = getElement('saveButton');

  await user.click(saveButton);

  await waitFor(() => expect(originIdInput).toHaveFocus());

  await user.type(originIdInput, organizationValues.originId);
  await user.type(nameInput, organizationValues.name);
  await user.click(saveButton);

  await waitFor(() => expect(parentInput).toHaveFocus());
});

test('should move to organizations page after creating new organization', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedCreateOrganizationResponse,
    mockedOrganizationsResponse,
  ]);

  await loadingSpinnerIsNotInDocument();

  await fillInputValues();

  await user.click(getElement('saveButton'));

  await waitFor(
    () =>
      expect(history.location.pathname).toBe(
        `/fi/administration/organizations`
      ),
    { timeout: 10000 }
  );
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedInvalidCreateOrganizationResponse]);

  await loadingSpinnerIsNotInDocument();

  await fillInputValues();

  const saveButton = getElement('saveButton');
  await user.click(saveButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i, undefined, {
    timeout: 10000,
  });
  screen.getByText(/Tämän kentän arvo ei voi olla "null"./i);
});

test('should not allow non-superuser to edit merchants', async () => {
  renderComponent([
    mockedOrganizationsResponse,
    mockedOrganizationClassResponse,
    mockedOrganizationClassesResponse,
    mockedUserResponse,
    mockedUsersResponse,
  ]);

  await loadingSpinnerIsNotInDocument();
  await waitFor(() =>
    expect(
      screen.queryAllByText(
        'Vain järjestelmän pääkäyttäjät ja taloushallinnon pääkäyttäjät voivat muokata kauppiaita tai tilejä.'
      )
    ).toHaveLength(2)
  );
});
