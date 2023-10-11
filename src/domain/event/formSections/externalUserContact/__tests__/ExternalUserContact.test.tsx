import { Formik } from 'formik';
import React from 'react';

import { PublicationStatus } from '../../../../../generated/graphql';
import {
  configure,
  render,
  screen,
  userEvent,
} from '../../../../../utils/testUtils';
import { EVENT_FIELDS } from '../../../constants';
import { getExternalUserEventSchema } from '../../../validation';
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
      validationSchema={getExternalUserEventSchema(PublicationStatus.Draft)}
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
