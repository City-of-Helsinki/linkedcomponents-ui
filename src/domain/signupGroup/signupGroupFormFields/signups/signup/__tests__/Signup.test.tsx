import { Formik } from 'formik';

import {
  fakeLocalisedObject,
  fakePriceGroupDense,
  fakeRegistration,
  fakeRegistrationPriceGroup,
} from '../../../../../../utils/mockDataUtils';
import {
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
} from '../../../../../../utils/testUtils';
import {
  registration,
  registrationOverrides,
} from '../../../../../registration/__mocks__/registration';
import { REGISTRATION_MANDATORY_FIELDS } from '../../../../../registration/constants';
import { SIGNUP_INITIAL_VALUES } from '../../../../constants';
import { SignupGroupFormProvider } from '../../../../signupGroupFormContext/SignupGroupFormContext';
import Signup, { SignupProps } from '../Signup';

configure({ defaultHidden: true });

const TEST_REGISTRATION_PRICE_GROUP_ID = 1;
const registrationWithSignupGroup = fakeRegistration({
  registrationPriceGroups: [
    fakeRegistrationPriceGroup({
      id: TEST_REGISTRATION_PRICE_GROUP_ID,
      price: '10.00',
      priceGroup: fakePriceGroupDense({
        description: fakeLocalisedObject('Price group 1'),
      }),
    }),
  ],
});

const defaultProps: SignupProps = {
  disabled: false,
  index: 0,
  isEditingMode: false,
  onDelete: vi.fn(),
  registration,
  showDelete: false,
  signup: SIGNUP_INITIAL_VALUES,
  signupPath: 'signup[0]',
};

const renderComponent = (props?: Partial<SignupProps>) =>
  render(
    <Formik initialValues={{}} onSubmit={vi.fn()}>
      <SignupGroupFormProvider registration={registration}>
        <Signup {...defaultProps} {...props} />
      </SignupGroupFormProvider>
    </Formik>
  );

test('should use default name in accordion label', async () => {
  renderComponent();
  await loadingSpinnerIsNotInDocument();

  expect(
    screen.getByRole('region', { name: 'Osallistuja 1' })
  ).toBeInTheDocument();
});

test('should shown name in accordion label', async () => {
  renderComponent({
    signup: { ...SIGNUP_INITIAL_VALUES, firstName: 'First', lastName: 'Last' },
  });
  await loadingSpinnerIsNotInDocument();

  expect(
    screen.getByRole('region', { name: 'First Last' })
  ).toBeInTheDocument();
});

test('should show price group name in the accordion label', async () => {
  renderComponent({
    registration: registrationWithSignupGroup,
    signup: {
      ...SIGNUP_INITIAL_VALUES,
      priceGroup: TEST_REGISTRATION_PRICE_GROUP_ID.toString(),
    },
  });
  await loadingSpinnerIsNotInDocument();

  expect(
    screen.getByRole('region', {
      name: 'Osallistuja 1 — Price group 1 10,00 €',
    })
  ).toBeInTheDocument();
});

test('price group button should be disabled in editing mode', async () => {
  renderComponent({
    isEditingMode: true,
    registration: registrationWithSignupGroup,
    signup: {
      ...SIGNUP_INITIAL_VALUES,
      priceGroup: TEST_REGISTRATION_PRICE_GROUP_ID.toString(),
    },
  });
  await loadingSpinnerIsNotInDocument();

  expect(screen.getByRole('button', { name: 'Hintaryhmä *' })).toBeDisabled();
});

test('should display all mandatory fields', () => {
  renderComponent();
  screen.getByLabelText(/etunimi/i);
  screen.getByLabelText(/sukunimi/i);
  screen.getByLabelText(/puhelinnumero/i);
  screen.getByLabelText(/katuosoite/i);
  screen.getByLabelText(/postinumero/i);
  screen.getByLabelText(/kaupunki/i);
});

test.each([
  [REGISTRATION_MANDATORY_FIELDS.FIRST_NAME, /etunimi/i],
  [REGISTRATION_MANDATORY_FIELDS.LAST_NAME, /sukunimi/i],
  [REGISTRATION_MANDATORY_FIELDS.PHONE_NUMBER, /puhelinnumero/i],
  [REGISTRATION_MANDATORY_FIELDS.STREET_ADDRESS, /katuosoite/i],
  [REGISTRATION_MANDATORY_FIELDS.ZIPCODE, /postinumero/i],
  [REGISTRATION_MANDATORY_FIELDS.CITY, /kaupunki/i],
])(
  'should hide not mandatory field, %s',
  (mandatoryField, hiddenFieldLabel) => {
    renderComponent({
      registration: fakeRegistration({
        ...registrationOverrides,
        mandatoryFields: registrationOverrides.mandatoryFields.filter(
          (i) => i !== mandatoryField
        ),
      }),
    });
    expect(screen.queryByLabelText(hiddenFieldLabel)).not.toBeInTheDocument();
  }
);
