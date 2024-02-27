import { MockedResponse } from '@apollo/client/testing';

import { ROUTES } from '../../../constants';
import { mockAuthenticatedLoginState } from '../../../utils/mockLoginHooks';
import {
  configure,
  loadingSpinnerIsNotInDocument,
  renderWithRoute,
  screen,
  userEvent,
  waitFor,
  within,
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

const findDeleteButton = () =>
  screen.findByRole('button', { name: /poista hintaryhmä/i });
const findDescriptionInput = () =>
  screen.findByLabelText(/kuvaus \(suomeksi\)/i);
const getSaveButton = () => screen.getByRole('button', { name: /tallenna/i });

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
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedDeletePriceGroupResponse,
  ]);

  await loadingSpinnerIsNotInDocument();

  const deleteButton = await findDeleteButton();
  await user.click(deleteButton);

  const withinModal = within(screen.getByRole('dialog'));
  const confirmDeleteButton = withinModal.getByRole('button', {
    name: 'Poista hintaryhmä',
  });
  await user.click(confirmDeleteButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/places`)
  );
  await screen.findByRole('alert', { name: 'Hintaryhmä on poistettu' });
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
  await screen.findByRole('alert', { name: 'Hintaryhmä on tallennettu' });
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
