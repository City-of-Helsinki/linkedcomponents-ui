import { Formik } from 'formik';
import { clear } from 'jest-date-mock';
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
  [EVENT_FIELDS.EMAIL]: string;
  [EVENT_FIELDS.PHONE_NUMBER]: string;
  [EVENT_FIELDS.ORGANIZATION]: string;
  [EVENT_FIELDS.REGISTRATION_LINK]: string;
  [EVENT_FIELDS.USER_CONSENT]: boolean;
};

const defaultInitialValues: InitialValues = {
  [EVENT_FIELDS.USER_NAME]: '',
  [EVENT_FIELDS.EMAIL]: '',
  [EVENT_FIELDS.PHONE_NUMBER]: '',
  [EVENT_FIELDS.ORGANIZATION]: '',
  [EVENT_FIELDS.REGISTRATION_LINK]: '',
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
      onSubmit={jest.fn()}
      enableReinitialize={true}
      validationSchema={getExternalUserEventSchema(PublicationStatus.Draft)}
    >
      <ExternalUserContact {...defaultProps} {...props} />
    </Formik>
  );

afterAll(() => {
  clear();
});

test('should render fields', async () => {
  renderComponent();

  expect(await screen.findByLabelText(/nimi/i)).toBeInTheDocument();
  expect(await screen.findByLabelText(/sähköpostiosoite/i)).toBeInTheDocument();
  expect(await screen.findByLabelText(/puhelinnumero/i)).toBeInTheDocument();
  expect(await screen.findByLabelText(/organisaatio/i)).toBeInTheDocument();
  expect(
    await screen.findByLabelText(/matkailun rekisteriselosteen url/i)
  ).toBeInTheDocument();
  expect(
    await screen.findByLabelText(/annan suostumukseni tietojeni käyttöön/i)
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
  await user.tab();

  expect(await screen.findAllByText('Tämä kenttä on pakollinen')).toHaveLength(
    5
  );
});

test('phone number should be optional if email address exists', async () => {
  const user = userEvent.setup();

  renderComponent({ [EVENT_FIELDS.EMAIL]: 'test.test@test.com' });

  const phoneNumberInput = await screen.findByLabelText(/puhelinnumero/i);

  await user.click(phoneNumberInput);
  await user.tab();

  expect(
    screen.queryByText('Tämä kenttä on pakollinen')
  ).not.toBeInTheDocument();
});

test('email should be optional if phone number exists', async () => {
  const user = userEvent.setup();

  renderComponent({ [EVENT_FIELDS.PHONE_NUMBER]: '+358441234567' });

  const emailInput = await screen.findByLabelText(/sähköposti/i);

  await user.click(emailInput);
  await user.tab();

  expect(
    screen.queryByText('Tämä kenttä on pakollinen')
  ).not.toBeInTheDocument();
});
