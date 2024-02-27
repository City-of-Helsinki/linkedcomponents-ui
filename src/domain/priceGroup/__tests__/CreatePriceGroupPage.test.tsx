import { MockedResponse } from '@apollo/client/testing';

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
  mockedOrganizationResponse,
  organizationName,
} from '../../organization/__mocks__/organization';
import { mockedOrganizationAncestorsResponse } from '../../organization/__mocks__/organizationAncestors';
import { mockedFinancialAdminUserResponse } from '../../user/__mocks__/user';
import {
  mockedCreatePriceGroupResponse,
  mockedInvalidCreatePriceGroupResponse,
  priceGroupValues,
} from '../__mocks__/createPriceGroupPage';
import CreatePriceGroupPage from '../CreatePriceGroupPage';

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
  mockedFinancialAdminUserResponse,
];

const renderComponent = (mocks: MockedResponse[] = []) =>
  render(<CreatePriceGroupPage />, { mocks });

const getElement = (
  key:
    | 'descriptionInput'
    | 'publisherInput'
    | 'publisherToggleButton'
    | 'saveButton'
) => {
  switch (key) {
    case 'descriptionInput':
      return screen.getByLabelText(/kuvaus \(suomeksi\)/i);
    case 'publisherInput':
      return screen.getByRole('combobox', { name: /julkaisija/i });
    case 'publisherToggleButton':
      return screen.getByRole('button', { name: /julkaisija: valikko/i });
    case 'saveButton':
      return screen.getByRole('button', { name: /tallenna/i });
  }
};

const fillInputValues = async () => {
  const user = userEvent.setup();
  const publisherToggleButton = getElement('publisherToggleButton');
  await user.click(publisherToggleButton);
  const option = await screen.findByRole('option', { name: organizationName });
  await user.click(option);

  const descriptionInput = getElement('descriptionInput');
  await user.type(descriptionInput, priceGroupValues.description);
};

test('applies expected metadata', async () => {
  renderComponent(defaultMocks);

  await shouldApplyExpectedMetaData({
    expectedDescription: 'Lisää uusi hintaryhmä Linked Eventsiin.',
    expectedKeywords:
      'lisää, uusi, hintaryhmä, linked, events, tapahtuma, hallinta, api, admin, Helsinki, Suomi',
    expectedTitle: 'Lisää hintaryhmä - Linked Events',
  });
});

test('should focus to first validation error when trying to save new place', async () => {
  global.HTMLFormElement.prototype.submit = () => vi.fn();
  const user = userEvent.setup();
  renderComponent(defaultMocks);

  await loadingSpinnerIsNotInDocument();

  const publisherToggleButton = getElement('publisherToggleButton');
  const saveButton = getElement('saveButton');

  await user.click(saveButton);
  await waitFor(() => expect(publisherToggleButton).toHaveFocus());
});

test('should move to price groups page after creating new price group', async () => {
  const user = userEvent.setup();
  const { history } = renderComponent([
    ...defaultMocks,
    mockedCreatePriceGroupResponse,
  ]);

  await loadingSpinnerIsNotInDocument();

  await fillInputValues();

  const saveButton = getElement('saveButton');
  await user.click(saveButton);

  await waitFor(() =>
    expect(history.location.pathname).toBe(`/fi/administration/price-groups`)
  );
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  renderComponent([...defaultMocks, mockedInvalidCreatePriceGroupResponse]);

  await loadingSpinnerIsNotInDocument();

  await fillInputValues();

  const saveButton = getElement('saveButton');
  await user.click(saveButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
  screen.getByText(/Tämän kentän arvo ei voi olla "null"./i);
});
