import { Formik } from 'formik';

import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import {
  mockedFreePriceGroupsResponse,
  priceGroupDescription,
} from '../../../../priceGroup/__mocks__/priceGroups';
import { REGISTRATION_INITIAL_VALUES } from '../../../constants';
import PriceGroupsSection from '../PriceGroupsSection';

configure({ defaultHidden: true });

const mocks = [mockedFreePriceGroupsResponse];

const renderComponent = () =>
  render(
    <Formik initialValues={REGISTRATION_INITIAL_VALUES} onSubmit={vi.fn()}>
      <PriceGroupsSection isEditingAllowed={true} />
    </Formik>,
    { mocks }
  );

const getDeletePriceGroupButtons = () =>
  screen.getAllByRole('button', { name: 'Poista asiakasryhmä' });

const getElement = (
  key:
    | 'addPriceGroupButton'
    | 'hasPriceCheckbox'
    | 'priceGroupSelectButton'
    | 'priceInput'
    | 'vatSelectButton'
) => {
  switch (key) {
    case 'addPriceGroupButton':
      return screen.getByRole('button', { name: 'Lisää uusi asiakasryhmä' });
    case 'hasPriceCheckbox':
      return screen.getByRole('checkbox', { name: 'Tapahtuma on maksullinen' });
    case 'priceGroupSelectButton':
      return screen.getByRole('button', { name: /Asiakasryhmä/ });
    case 'priceInput':
      return screen.getByRole('spinbutton', { name: 'Hinta (€) *' });
    case 'vatSelectButton':
      return screen.getByRole('button', { name: /ALV %/ });
  }
};

test('should not show add price groups button if event is free', async () => {
  renderComponent();

  const hasPriceCheckbox = getElement('hasPriceCheckbox');
  expect(hasPriceCheckbox).not.toBeChecked();

  expect(
    screen.queryByRole('button', { name: 'Lisää uusi asiakasryhmä' })
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

  await user.click(addPriceGroupButton);
  expect(screen.getAllByRole('button', { name: /Asiakasryhmä/ })).toHaveLength(
    2
  );

  await user.click(getDeletePriceGroupButtons()[1]);
  expect(screen.getAllByRole('button', { name: /Asiakasryhmä/ })).toHaveLength(
    1
  );
});

test('should disable price and vat fields if price group is free', async () => {
  const user = userEvent.setup();

  renderComponent();

  const hasPriceCheckbox = getElement('hasPriceCheckbox');
  expect(hasPriceCheckbox).not.toBeChecked();
  await user.click(hasPriceCheckbox);

  const addPriceGroupButton = getElement('addPriceGroupButton');
  await user.click(addPriceGroupButton);

  const priceGroupSelectButton = getElement('priceGroupSelectButton');
  const priceInput = getElement('priceInput');
  getElement('vatSelectButton');

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
