import { MockedResponse } from '@apollo/client/testing';

import { ROUTES } from '../../../constants';
import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  loadingSpinnerIsNotInDocument,
  renderWithRoute,
  screen,
  shouldApplyExpectedMetaData,
  shouldDeleteInstance,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import { mockedOrganizationResponse } from '../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import { mockedFinancialAdminUserResponse } from '../../user/__mocks__/user';
import {
  mockedDeletePriceGroupResponse,
  mockedInvalidUpdatePriceGroupResponse,
  mockedPriceGroupResponse,
  mockedUpdatePriceGroupResponse,
  priceGroup,
} from '../__mocks__/editPriceGoupPage';
import EditPriceGroupPage from '../EditPriceGroupPage';

configure({ defaultHidden: true });

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const defaultMocks = [
  mockedOrganizationResponse,
  mockedOrganizationAncestorsResponse,
  mockedPriceGroupResponse,
  mockedFinancialAdminUserResponse,
];

const route = ROUTES.EDIT_PRICE_GROUP.replace(':id', priceGroup.id.toString());

const renderComponent = (mocks: MockedResponse[] = defaultMocks) =>
  renderWithRoute(<EditPriceGroupPage />, {
    mocks,
    routes: [route],
    path: ROUTES.EDIT_PRICE_GROUP,
  });

const findDescriptionInput = () =>
  screen.findByLabelText(/kuvaus \(suomeksi\)/i);
const getSaveButton = () => screen.getByRole('button', { name: /tallenna/i });

test('applies expected metadata', async () => {
  renderComponent();

  await shouldApplyExpectedMetaData({
    expectedDescription: 'Muokkaa Linked Eventsiin tallennettua asiakasryhmää.',
    expectedKeywords:
      'asiakasryhmä, muokkaa, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    expectedTitle: 'Muokkaa asiakasryhmää - Linked Events',
  });
});

test('should scroll to first validation error input field', async () => {
  const user = userEvent.setup();
  renderComponent();

  await loadingSpinnerIsNotInDocument();
  const descriptionInput = await findDescriptionInput();
  const saveButton = getSaveButton();

  await user.clear(descriptionInput);
  await user.click(saveButton);

  await waitFor(() => expect(descriptionInput).toHaveFocus());
});

test('should delete price group', async () => {
  const { history } = renderComponent([
    ...defaultMocks,
    mockedDeletePriceGroupResponse,
  ]);

  await shouldDeleteInstance({
    confirmDeleteButtonLabel: 'Poista asiakasryhmä',
    deleteButtonLabel: 'Poista asiakasryhmä',
    expectedNotificationText: 'Asiakasryhmä on poistettu',
    expectedUrl: '/fi/administration/price-groups',
    history,
  });
});

test('should update price group', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedUpdatePriceGroupResponse,
  ]);

  await loadingSpinnerIsNotInDocument();

  const submitButton = getSaveButton();
  await user.click(submitButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/price-groups`)
  );
  await screen.findByRole('alert', { name: 'Asiakasryhmä on tallennettu' });
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedInvalidUpdatePriceGroupResponse]);

  await loadingSpinnerIsNotInDocument();

  const submitButton = getSaveButton();
  await user.click(submitButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/The description must be specified./i);
});
