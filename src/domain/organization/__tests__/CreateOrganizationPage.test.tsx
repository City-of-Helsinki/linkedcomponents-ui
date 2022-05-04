import { MockedResponse } from '@apollo/client/testing';

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
import {
  dataSourceName,
  mockedDataSourceResponse,
  mockedDataSourcesResponse,
} from '../../dataSource/__mocks__/dataSource';
import {
  mockedOrganizationClassesResponse,
  mockedOrganizationClassResponse,
  organizationClassName,
} from '../../organizationClass/__mocks__/organizationClass';
import { mockedUserResponse } from '../../user/__mocks__/user';
import {
  mockedCreateOrganizationResponse,
  mockedInvalidCreateOrganizationResponse,
  organizationValues,
} from '../__mocks__/createOrganizationPage';
import CreateOrganizationPage from '../CreateOrganizationPage';

configure({ defaultHidden: true });

const state = fakeAuthenticatedStoreState();
const store = getMockReduxStore(state);

const defaultMocks = [
  mockedDataSourceResponse,
  mockedDataSourcesResponse,
  mockedOrganizationClassResponse,
  mockedOrganizationClassesResponse,
  mockedUserResponse,
];

const renderComponent = (mocks: MockedResponse[] = []) =>
  render(<CreateOrganizationPage />, { mocks, store });

const getElement = (
  key:
    | 'classificationInput'
    | 'classificationToggleButton'
    | 'dataSourceInput'
    | 'dataSourceToggleButton'
    | 'nameInput'
    | 'originIdInput'
    | 'saveButton'
) => {
  switch (key) {
    case 'classificationInput':
      return screen.getByRole('combobox', { name: /luokittelu/i });
    case 'classificationToggleButton':
      return screen.getByRole('button', { name: /luokittelu: valikko/i });
    case 'dataSourceInput':
      return screen.getByRole('combobox', { name: /datan lähde/i });
    case 'dataSourceToggleButton':
      return screen.getByRole('button', { name: /datan lähde: valikko/i });
    case 'nameInput':
      return screen.getByRole('textbox', { name: /nimi/i });
    case 'originIdInput':
      return screen.getByRole('textbox', { name: /lähdetunniste/i });
    case 'saveButton':
      return screen.getByRole('button', { name: /tallenna/i });
  }
};

const fillDataSourceField = async () => {
  const dataSourceToggleButton = getElement('dataSourceToggleButton');
  userEvent.click(dataSourceToggleButton);

  const option = await screen.findByRole('option', { name: dataSourceName });
  userEvent.click(option);
};

const fillClassificationField = async () => {
  const classificationToggleButton = getElement('classificationToggleButton');
  userEvent.click(classificationToggleButton);

  const option = await screen.findByRole('option', {
    name: organizationClassName,
  });
  userEvent.click(option);
};

const fillInputValues = async () => {
  await fillDataSourceField();
  userEvent.type(getElement('originIdInput'), organizationValues.originId);
  userEvent.type(getElement('nameInput'), organizationValues.name);
  await fillClassificationField();
};

test('should focus to first validation error when trying to save new organization', async () => {
  renderComponent(defaultMocks);

  await loadingSpinnerIsNotInDocument();

  const saveButton = getElement('saveButton');
  userEvent.click(saveButton);

  const dataSourceInput = getElement('dataSourceInput');
  await waitFor(() => expect(dataSourceInput).toHaveFocus());
  await fillDataSourceField();
  userEvent.click(saveButton);

  const originIdInput = getElement('originIdInput');
  await waitFor(() => expect(originIdInput).toHaveFocus());
  userEvent.type(originIdInput, organizationValues.originId);
  userEvent.click(saveButton);

  const nameInput = getElement('nameInput');
  userEvent.click(saveButton);

  await waitFor(() => expect(nameInput).toHaveFocus());
});

test('should move to organizations page after creating new organization', async () => {
  const { history } = renderComponent([
    ...defaultMocks,
    mockedCreateOrganizationResponse,
  ]);

  await loadingSpinnerIsNotInDocument();

  await fillInputValues();

  userEvent.click(getElement('saveButton'));

  await waitFor(
    () => expect(history.location.pathname).toBe(`/fi/admin/organizations`),
    { timeout: 10000 }
  );
});

test('should show server errors', async () => {
  renderComponent([...defaultMocks, mockedInvalidCreateOrganizationResponse]);

  await loadingSpinnerIsNotInDocument();

  await fillInputValues();

  const saveButton = getElement('saveButton');
  userEvent.click(saveButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i, undefined, {
    timeout: 10000,
  });
  screen.getByText(/Tämän kentän arvo ei voi olla "null"./i);
});
