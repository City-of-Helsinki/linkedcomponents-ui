import { MockedResponse } from '@apollo/client/testing';
import { Formik } from 'formik';

import { LE_DATA_LANGUAGES } from '../../../../../constants';
import { mockAuthenticatedLoginState } from '../../../../../utils/mockLoginHooks';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import { mockedFreePriceGroupsResponse } from '../../../../priceGroup/__mocks__/priceGroups';
import {
  mockedUserResponse,
  mockedUserWithoutOrganizationsResponse,
} from '../../../../user/__mocks__/user';
import { EVENT_FIELDS, EVENT_TYPE } from '../../../constants';
import { OfferFields } from '../../../types';
import { getEmptyOffer } from '../../../utils';
import { publicEventSchema } from '../../../validation';
import PriceSection from '../PriceSection';

configure({ defaultHidden: true });

beforeEach(() => {
  mockAuthenticatedLoginState();
});

const type = EVENT_TYPE.General;

afterEach(() => {
  vi.resetAllMocks();
});

beforeEach(() => {
  mockAuthenticatedLoginState();
});

type InitialValues = {
  [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: string[];
  [EVENT_FIELDS.HAS_PRICE]: boolean;
  [EVENT_FIELDS.IS_REGISTRATION_PLANNED]: boolean;
  [EVENT_FIELDS.OFFERS]: OfferFields[];
  [EVENT_FIELDS.TYPE]: string;
};

const defaultInitialValues: InitialValues = {
  [EVENT_FIELDS.EVENT_INFO_LANGUAGES]: [LE_DATA_LANGUAGES.FI],
  [EVENT_FIELDS.HAS_PRICE]: false,
  [EVENT_FIELDS.IS_REGISTRATION_PLANNED]: false,
  [EVENT_FIELDS.OFFERS]: [getEmptyOffer()],
  [EVENT_FIELDS.TYPE]: type,
};

const defaultMocks = [mockedFreePriceGroupsResponse, mockedUserResponse];

const renderPriceSection = ({
  initialValues,
  mocks = defaultMocks,
}: {
  initialValues?: Partial<InitialValues>;
  mocks?: MockedResponse[];
} = {}) =>
  render(
    <Formik
      initialValues={{ ...defaultInitialValues, ...initialValues }}
      onSubmit={vi.fn()}
      validationSchema={publicEventSchema}
    >
      <PriceSection isEditingAllowed={true} />
    </Formik>,
    { mocks }
  );

const findAddOfferButton = () =>
  screen.findByRole('button', { name: /lisää muita hintatietoja/i });

const queryElements = (
  key: 'deleteButtons' | 'instructions' | 'priceInputs'
) => {
  switch (key) {
    case 'deleteButtons':
      return screen.queryAllByRole('button', {
        name: 'Poista hintatieto',
      });
    case 'instructions':
      return screen.queryAllByText(
        /Hinta- ja hintatietojen kuvaus -kenttien tiedot menevät tapahtumailmoitukselle näkyviin./i
      );

    case 'priceInputs':
      return screen.queryAllByPlaceholderText(/syötä tapahtuman hinta/i);
  }
};

const getDeletePriceGroupButtons = () =>
  screen.getAllByRole('button', { name: 'Poista asiakasryhmä' });

const getElement = (
  key:
    | 'addPriceGroupButton'
    | 'hasPriceCheckbox'
    | 'heading'
    | 'isRegistrationPlannedCheckbox'
    | 'priceGroupSelectButton'
    | 'priceInput'
    | 'vatSelectButton'
) => {
  switch (key) {
    case 'addPriceGroupButton':
      return screen.getByRole('button', { name: 'Lisää muita asiakasryhmiä' });
    case 'hasPriceCheckbox':
      return screen.getByRole('checkbox', {
        name: /tapahtuma on maksullinen/i,
      });
    case 'heading':
      return screen.getByRole('heading', {
        name: /tapahtuman hintatiedot/i,
      });
    case 'isRegistrationPlannedCheckbox':
      return screen.getByRole('checkbox', {
        name: 'Tapahtumalle luodaan Linked Events -ilmoittautuminen',
      });
    case 'priceGroupSelectButton':
      return screen.getByRole('button', { name: /Asiakasryhmä/ });
    case 'priceInput':
      return screen.getByRole('spinbutton', { name: 'Hinta (€) *' });
    case 'vatSelectButton':
      return screen.getByRole('button', { name: /ALV %/ });
  }
};

test('should add and delete an offer', async () => {
  const user = userEvent.setup();
  renderPriceSection();

  await user.click(getElement('hasPriceCheckbox'));

  const placeholders = [
    /syötä tapahtuman hinta/i,
    /syötä lipunmyynnin tai ilmoittautumisen url/i,
    /syötä lisätietoa hinnasta/i,
  ];

  await waitFor(() =>
    expect(screen.queryAllByPlaceholderText(placeholders[0])).toHaveLength(1)
  );
  for (const placeholder of placeholders.slice(1)) {
    screen.getByPlaceholderText(placeholder);
  }

  const addOfferButton = await findAddOfferButton();
  await user.click(addOfferButton);

  await waitFor(() =>
    expect(screen.queryAllByPlaceholderText(placeholders[0])).toHaveLength(2)
  );

  const deleteButton = queryElements('deleteButtons')[0];
  await user.click(deleteButton);

  await waitFor(() =>
    expect(screen.queryAllByPlaceholderText(placeholders[0])).toHaveLength(1)
  );
});

test('should validate an offer', async () => {
  const user = userEvent.setup();
  renderPriceSection();

  await user.click(getElement('hasPriceCheckbox'));

  const priceInput = await screen.findByPlaceholderText(
    /syötä tapahtuman hinta/i
  );
  const urlInput = screen.getByPlaceholderText(
    /syötä lipunmyynnin tai ilmoittautumisen url/i
  );
  const descriptionInput = screen.getByPlaceholderText(
    /syötä lisätietoa hinnasta/i
  );
  await user.click(priceInput);
  await user.click(urlInput);
  await screen.findByText(/tämä kenttä on pakollinen/i);

  await user.type(urlInput, 'invalidurl.com');
  await user.click(descriptionInput);
  await screen.findByText(
    /kirjoita url osoite kokonaisena ja oikeassa muodossa/i
  );
});

test('should show instructions for each offer', async () => {
  const user = userEvent.setup();
  renderPriceSection({
    mocks: [
      mockedFreePriceGroupsResponse,
      mockedUserWithoutOrganizationsResponse,
    ],
  });

  getElement('heading');

  // Should not have instructions to free event
  expect(queryElements('instructions')).toHaveLength(0);

  await user.click(getElement('hasPriceCheckbox'));

  await waitFor(() => expect(queryElements('priceInputs')).toHaveLength(1));
  expect(queryElements('instructions')).toHaveLength(1);

  const addOfferButton = await findAddOfferButton();
  await user.click(addOfferButton);

  await waitFor(() => expect(queryElements('priceInputs')).toHaveLength(2));
  expect(queryElements('instructions')).toHaveLength(2);
});

test('should show add price group button only if registration is planned', async () => {
  const user = userEvent.setup();
  renderPriceSection({
    initialValues: { hasPrice: true, isRegistrationPlanned: false },
  });

  expect(
    screen.queryByRole('button', { name: 'Lisää muita asiakasryhmiä' })
  ).not.toBeInTheDocument();

  await user.click(getElement('isRegistrationPlannedCheckbox'));
  expect(getElement('addPriceGroupButton')).toBeInTheDocument();
});

test('should add and remove price group', async () => {
  const user = userEvent.setup();

  renderPriceSection({
    initialValues: { hasPrice: true, isRegistrationPlanned: true },
  });

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
