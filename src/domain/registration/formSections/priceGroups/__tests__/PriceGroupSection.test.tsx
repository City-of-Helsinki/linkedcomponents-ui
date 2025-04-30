import { Formik } from 'formik';

import { mockedEventResponse } from '../../../../../common/components/eventSelector/__mocks__/eventSelector';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import { TEST_EVENT_ID } from '../../../../event/constants';
import {
  accountOptions,
  accountPayload,
  mockedOrganizationAccountsResponse,
  mockedOrganizationMerchantsResponse,
} from '../../../../organization/__mocks__/organization';
import {
  mockedFreePriceGroupsResponse,
  mockedPublisherFreePriceGroupsResponse,
  priceGroupDescription,
} from '../../../../priceGroup/__mocks__/priceGroups';
import { REGISTRATION_INITIAL_VALUES } from '../../../constants';
import PriceGroupsSection from '../PriceGroupsSection';

configure({ defaultHidden: true });

const mocks = [
  mockedEventResponse,
  mockedFreePriceGroupsResponse,
  mockedPublisherFreePriceGroupsResponse,
  mockedOrganizationAccountsResponse,
  mockedOrganizationMerchantsResponse,
];

const renderComponent = () =>
  render(
    <Formik
      initialValues={{ ...REGISTRATION_INITIAL_VALUES, event: TEST_EVENT_ID }}
      onSubmit={vi.fn()}
    >
      <PriceGroupsSection isEditingAllowed={true} />
    </Formik>,
    { mocks }
  );

const getDeletePriceGroupButtons = () =>
  screen.getAllByRole('button', { name: 'Poista asiakasryhmä' });

const getElement = (
  key:
    | 'accountSelectButton'
    | 'addPriceGroupButton'
    | 'hasPriceCheckbox'
    | 'merchantSelectButton'
    | 'priceGroupSelectButton'
    | 'priceInput'
    | 'vatSelectButton'
) => {
  switch (key) {
    case 'accountSelectButton':
      return screen.getByRole('button', { name: 'Kirjanpitotili *' });
    case 'addPriceGroupButton':
      return screen.getByRole('button', { name: 'Lisää muita asiakasryhmiä' });
    case 'hasPriceCheckbox':
      return screen.getByRole('checkbox', { name: 'Tapahtuma on maksullinen' });
    case 'merchantSelectButton':
      return screen.getByRole('button', { name: 'Kauppias *' });
    case 'priceGroupSelectButton':
      return screen.getByRole('button', { name: /Asiakasryhmä/ });
    case 'priceInput':
      return screen.getByRole('spinbutton', { name: 'Hinta (€) *' });
    case 'vatSelectButton':
      return screen.getByRole('button', { name: /ALV %/ });
  }
};

const accountFields = [
  { name: 'SAP-yritystunnus *', value: accountPayload.companyCode },
  { name: 'Pääkirjatili *', value: accountPayload.mainLedgerAccount },
  {
    name: 'Tasetilin tulosyksikkö *',
    value: accountPayload.balanceProfitCenter,
  },
  { name: 'Sisäinen tilaus', value: accountPayload.internalOrder },
  { name: 'Tulosyksikkö', value: accountPayload.profitCenter },
  { name: 'Projekti', value: accountPayload.project },
  { name: 'SAP-toimintoalue', value: accountPayload.operationArea },
];

const selectAccount = async () => {
  const user = userEvent.setup();

  const hasPriceCheckbox = getElement('hasPriceCheckbox');
  await user.click(hasPriceCheckbox);

  const accountSelectButton = getElement('accountSelectButton');
  await user.click(accountSelectButton);
  const accountOption = await screen.findByRole('option', {
    name: accountOptions[0].label,
  });
  await user.click(accountOption);
};

test('should not show add price groups button if event is free', async () => {
  renderComponent();

  const hasPriceCheckbox = getElement('hasPriceCheckbox');
  expect(hasPriceCheckbox).not.toBeChecked();

  expect(
    screen.queryByRole('button', { name: 'Lisää muita asiakasryhmiä' })
  ).not.toBeInTheDocument();
});

test('should add and remove price group', async () => {
  const user = userEvent.setup();

  renderComponent();

  const hasPriceCheckbox = getElement('hasPriceCheckbox');
  expect(hasPriceCheckbox).not.toBeChecked();
  await user.click(hasPriceCheckbox);

  const addPriceGroupButton = getElement('addPriceGroupButton');
  await user.click(addPriceGroupButton);

  getElement('priceGroupSelectButton');
  getElement('priceInput');
  getElement('vatSelectButton');
  getElement('merchantSelectButton');
  getElement('accountSelectButton');

  await user.click(addPriceGroupButton);
  expect(screen.getAllByRole('button', { name: /Asiakasryhmä/ })).toHaveLength(
    2
  );

  await user.click(getDeletePriceGroupButtons()[1]);
  expect(screen.getAllByRole('button', { name: /Asiakasryhmä/ })).toHaveLength(
    1
  );
});

test('should disable price field if price group is free', async () => {
  const user = userEvent.setup();

  renderComponent();

  const hasPriceCheckbox = getElement('hasPriceCheckbox');
  expect(hasPriceCheckbox).not.toBeChecked();
  await user.click(hasPriceCheckbox);

  const addPriceGroupButton = getElement('addPriceGroupButton');
  await user.click(addPriceGroupButton);

  const priceGroupSelectButton = getElement('priceGroupSelectButton');
  const priceInput = getElement('priceInput');

  await user.type(priceInput, '10.00');
  expect(priceInput).toHaveValue(10);

  // Price is cleared after changing to a free price group
  await user.click(priceGroupSelectButton);
  const priceGroupOption = screen.getByRole('option', {
    name: priceGroupDescription,
  });
  await user.click(priceGroupOption);
  await waitFor(() => expect(priceInput).toHaveValue(0));
});

test('should should account override fields if account is selected', async () => {
  renderComponent();

  await selectAccount();

  for (const { name, value } of accountFields) {
    const el = await screen.findByRole('textbox', { name: name });
    expect(el).toHaveValue(value);
  }
});

test('should restore accounf fields default values', async () => {
  const user = userEvent.setup();

  renderComponent();

  await selectAccount();

  for (const { name } of accountFields) {
    const el = await screen.findByRole('textbox', { name: name });
    await user.clear(el);
    expect(el).toHaveValue('');
  }

  await user.click(
    screen.getByRole('button', { name: 'Palauta tilin oletusarvot' })
  );

  for (const { name, value } of accountFields) {
    const el = await screen.findByRole('textbox', { name: name });
    expect(el).toHaveValue(value);
  }
});
