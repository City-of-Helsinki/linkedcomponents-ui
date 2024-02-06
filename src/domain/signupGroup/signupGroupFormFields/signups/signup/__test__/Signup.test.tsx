import { Formik } from 'formik';

import { fakeRegistration } from '../../../../../../utils/mockDataUtils';
import { configure, render, screen } from '../../../../../../utils/testUtils';
import {
  registration,
  registrationOverrides,
} from '../../../../../registration/__mocks__/registration';
import { REGISTRATION_MANDATORY_FIELDS } from '../../../../../registration/constants';
import { SIGNUP_INITIAL_VALUES } from '../../../../constants';
import { SignupGroupFormProvider } from '../../../../signupGroupFormContext/SignupGroupFormContext';
import Signup, { SignupProps } from '../Signup';

configure({ defaultHidden: true });

const defaultProps: SignupProps = {
  index: 0,
  isEditingMode: false,
  onDelete: vi.fn(),
  registration: registration,
  signup: SIGNUP_INITIAL_VALUES,
  signupPath: 'signup[0]',
  showDelete: true,
};

const renderComponent = (props?: Partial<SignupProps>) => {
  render(
    <Formik initialValues={[]} onSubmit={vi.fn()}>
      <SignupGroupFormProvider
        registration={props?.registration ?? defaultProps.registration}
      >
        <Signup {...defaultProps} {...props} />
      </SignupGroupFormProvider>
    </Formik>
  );
};

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
