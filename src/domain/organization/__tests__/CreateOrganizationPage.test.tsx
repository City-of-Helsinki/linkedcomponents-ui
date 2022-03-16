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

const defaultMocks = [mockedUserResponse];

const renderComponent = (mocks: MockedResponse[] = []) =>
  render(<CreateOrganizationPage />, { mocks, store });

const getElement = (
  key: 'dataSourceInput' | 'nameInput' | 'originIdInput' | 'saveButton'
) => {
  switch (key) {
    case 'dataSourceInput':
      return screen.getByRole('textbox', { name: /datan lähde/i });
    case 'nameInput':
      return screen.getByRole('textbox', { name: /nimi/i });
    case 'originIdInput':
      return screen.getByRole('textbox', { name: /lähdetunniste/i });
    case 'saveButton':
      return screen.getByRole('button', { name: /tallenna/i });
  }
};

const fillInputValues = async () => {
  userEvent.type(getElement('dataSourceInput'), organizationValues.dataSource);
  userEvent.type(getElement('originIdInput'), organizationValues.originId);
  userEvent.type(getElement('nameInput'), organizationValues.name);
};

test('should focus to first validation error when trying to save new registration', async () => {
  renderComponent(defaultMocks);

  await loadingSpinnerIsNotInDocument();

  const saveButton = getElement('saveButton');
  userEvent.click(saveButton);

  const dataSourceInput = getElement('dataSourceInput');
  await waitFor(() => expect(dataSourceInput).toHaveFocus());
  userEvent.type(dataSourceInput, organizationValues.originId);
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
