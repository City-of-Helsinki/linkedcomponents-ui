import { Formik, useFormikContext } from 'formik';

import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import { EVENT_FIELDS } from '../../../constants';
import { externalUserEventSchema } from '../../../validation';
import ExternalUserContact, {
  ExternalUserContactProps,
} from '../ExternalUserContact';

configure({ defaultHidden: true });

type InitialValues = {
  [EVENT_FIELDS.USER_NAME]: string;
  [EVENT_FIELDS.USER_EMAIL]: string;
  [EVENT_FIELDS.USER_PHONE_NUMBER]: string;
  [EVENT_FIELDS.USER_ORGANIZATION]: string;
  [EVENT_FIELDS.USER_CONSENT]: boolean;
};

const defaultInitialValues: InitialValues = {
  [EVENT_FIELDS.USER_NAME]: '',
  [EVENT_FIELDS.USER_EMAIL]: '',
  [EVENT_FIELDS.USER_PHONE_NUMBER]: '',
  [EVENT_FIELDS.USER_ORGANIZATION]: '',
  [EVENT_FIELDS.USER_CONSENT]: false,
};

const defaultProps: ExternalUserContactProps = {
  isEditingAllowed: true,
};

const renderComponent = (
  initialValues?: Partial<InitialValues>,
  props?: Partial<ExternalUserContactProps>
) =>
  render(
    <Formik
      initialValues={{ ...defaultInitialValues, ...initialValues }}
      onSubmit={vi.fn()}
      enableReinitialize={true}
      validationSchema={externalUserEventSchema}
    >
      <ExternalUserContact {...defaultProps} {...props} />
    </Formik>
  );

test('should render fields', async () => {
  renderComponent();

  expect(await screen.findByLabelText(/nimi/i)).toBeInTheDocument();
  expect(await screen.findByLabelText(/sähköpostiosoite/i)).toBeInTheDocument();
  expect(await screen.findByLabelText(/puhelinnumero/i)).toBeInTheDocument();
  expect(await screen.findByLabelText(/organisaatio/i)).toBeInTheDocument();
  expect(
    await screen.findByLabelText(
      /olen lukenut tietosuojaselosteen ja annan luvan tietojeni käyttöön/i
    )
  ).toBeInTheDocument();
});

test('should validate required fields', async () => {
  const user = userEvent.setup();

  renderComponent();

  const nameInput = await screen.findByLabelText(/nimi/i);

  await user.click(nameInput);
  await user.tab();
  await user.tab();
  await user.tab();
  await user.tab();
  await user.tab();

  expect(await screen.findAllByText('Tämä kenttä on pakollinen')).toHaveLength(
    4
  );
});

test('phone number should be optional if email address exists', async () => {
  const user = userEvent.setup();

  renderComponent({ [EVENT_FIELDS.USER_EMAIL]: 'test.test@test.com' });

  const phoneNumberInput = await screen.findByLabelText(/puhelinnumero/i);

  await user.click(phoneNumberInput);
  await user.tab();

  expect(
    screen.queryByText('Tämä kenttä on pakollinen')
  ).not.toBeInTheDocument();
});

test('email should be optional if phone number exists', async () => {
  const user = userEvent.setup();

  renderComponent({ [EVENT_FIELDS.USER_PHONE_NUMBER]: '+358441234567' });

  const emailInput = await screen.findByLabelText(/sähköposti/i);

  await user.click(emailInput);
  await user.tab();

  expect(
    screen.queryByText('Tämä kenttä on pakollinen')
  ).not.toBeInTheDocument();
});

const FormikValuesProbe = () => {
  const { values } = useFormikContext<Record<string, unknown>>();
  return (
    <div data-testid="formik-values">
      {JSON.stringify({ userConsent: values[EVENT_FIELDS.USER_CONSENT] })}
    </div>
  );
};

test('toggling userConsent stores a boolean when initial value is false', async () => {
  const user = userEvent.setup();

  render(
    <Formik
      initialValues={{ ...defaultInitialValues }}
      onSubmit={vi.fn()}
      enableReinitialize={true}
      validationSchema={externalUserEventSchema}
    >
      <>
        <ExternalUserContact {...defaultProps} />
        <FormikValuesProbe />
      </>
    </Formik>
  );

  const consentCheckbox = await screen.findByLabelText(
    /olen lukenut tietosuojaselosteen ja annan luvan tietojeni käyttöön/i
  );

  await user.click(consentCheckbox);

  expect(screen.getByTestId('formik-values')).toHaveTextContent(
    '{"userConsent":true}'
  );
});

test('toggling userConsent stores a boolean even when initial value is missing', async () => {
  const user = userEvent.setup();

  // Intentionally omit USER_CONSENT to simulate a stale FormikPersist snapshot
  // written before the external-user initial values were applied. Before the
  // fix, this made Formik's getValueForCheckbox fall back to the array branch
  // and produce ["on"] instead of a boolean.
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [EVENT_FIELDS.USER_CONSENT]: _omitted,
    ...initialValuesWithoutConsent
  } = defaultInitialValues;

  render(
    <Formik
      initialValues={initialValuesWithoutConsent}
      onSubmit={vi.fn()}
      enableReinitialize={true}
      validationSchema={externalUserEventSchema}
    >
      <>
        <ExternalUserContact {...defaultProps} />
        <FormikValuesProbe />
      </>
    </Formik>
  );

  const consentCheckbox = await screen.findByLabelText(
    /olen lukenut tietosuojaselosteen ja annan luvan tietojeni käyttöön/i
  );

  await user.click(consentCheckbox);

  expect(screen.getByTestId('formik-values')).toHaveTextContent(
    '{"userConsent":true}'
  );
});
