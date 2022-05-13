import { MockedResponse } from '@apollo/client/testing';

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
  const user = userEvent.setup();
  const dataSourceToggleButton = getElement('dataSourceToggleButton');
  await act(async () => await user.click(dataSourceToggleButton));

  const option = await screen.findByRole('option', { name: dataSourceName });
  await act(async () => await user.click(option));
};

const fillClassificationField = async () => {
  const user = userEvent.setup();
  const classificationToggleButton = getElement('classificationToggleButton');
  await act(async () => await user.click(classificationToggleButton));

  const option = await screen.findByRole('option', {
    name: organizationClassName,
  });
  await act(async () => await user.click(option));
};

const fillInputValues = async () => {
  const user = userEvent.setup();
  await fillDataSourceField();
  await act(
    async () =>
      await user.type(getElement('originIdInput'), organizationValues.originId)
  );
  await act(
    async () =>
      await user.type(getElement('nameInput'), organizationValues.name)
  );
  await fillClassificationField();
};

test('should focus to first validation error when trying to save new organization', async () => {
  const user = userEvent.setup();
  renderComponent(defaultMocks);

  await loadingSpinnerIsNotInDocument();

  const saveButton = getElement('saveButton');
  await act(async () => await user.click(saveButton));

  const dataSourceInput = getElement('dataSourceInput');
  await waitFor(() => expect(dataSourceInput).toHaveFocus());
  await fillDataSourceField();
  await act(async () => await user.click(saveButton));

  const originIdInput = getElement('originIdInput');
  await waitFor(() => expect(originIdInput).toHaveFocus());
  await act(
    async () => await user.type(originIdInput, organizationValues.originId)
  );
  await act(async () => await user.click(saveButton));

  const nameInput = getElement('nameInput');
  await act(async () => await user.click(saveButton));

  await waitFor(() => expect(nameInput).toHaveFocus());
});

test('should move to organizations page after creating new organization', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedCreateOrganizationResponse,
  ]);

  await loadingSpinnerIsNotInDocument();

  await fillInputValues();

  await act(async () => await user.click(getElement('saveButton')));

  await waitFor(
    () => expect(history.location.pathname).toBe(`/fi/admin/organizations`),
    { timeout: 10000 }
  );
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedInvalidCreateOrganizationResponse]);

  await loadingSpinnerIsNotInDocument();

  await fillInputValues();

  const saveButton = getElement('saveButton');
  await act(async () => await user.click(saveButton));

  await screen.findByText(/lomakkeella on seuraavat virheet/i, undefined, {
    timeout: 10000,
  });
  screen.getByText(/Tämän kentän arvo ei voi olla "null"./i);
});
