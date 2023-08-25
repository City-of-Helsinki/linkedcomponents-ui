import { MockedResponse } from '@apollo/client/testing';
import { Formik } from 'formik';
import React from 'react';
import { toast } from 'react-toastify';

import { SendRegistrationUserAccessInvitationDocument } from '../../../../../generated/graphql';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import { mockedServiceLanguagesResponse } from '../../../../language/__mocks__/language';
import {
  REGISTRATION_FIELDS,
  TEST_REGISTRATION_USER_ID,
} from '../../../constants';
import { RegistrationFormFields } from '../../../types';
import { registrationSchema } from '../../../validation';
import RegistrationUsersSection from '../RegistrationUserAccessesSection';

configure({ defaultHidden: true });

const defaultMocks = [mockedServiceLanguagesResponse];

const defaultInitialValue = {
  [REGISTRATION_FIELDS.REGISTRATION_USER_ACCESSES]: [],
};
const sendInvitationVariables = { id: TEST_REGISTRATION_USER_ID };
const mockedSendInvitationResponse: MockedResponse = {
  request: {
    query: SendRegistrationUserAccessInvitationDocument,
    variables: sendInvitationVariables,
  },
  result: { data: { sendRegistrationUserAccessInvitation: null } },
};
const mockedInvalidSendInvitationResponse: MockedResponse = {
  request: {
    query: SendRegistrationUserAccessInvitationDocument,
    variables: sendInvitationVariables,
  },
  error: new Error(),
};

const renderRegistrationUserAccessesSection = (
  initialValues?: Partial<RegistrationFormFields>,
  mocks: MockedResponse[] = defaultMocks
) =>
  render(
    <Formik
      initialValues={{
        ...defaultInitialValue,
        ...initialValues,
      }}
      onSubmit={jest.fn()}
      validationSchema={registrationSchema}
    >
      <RegistrationUsersSection isEditingAllowed={true} />
    </Formik>,
    { mocks }
  );

const getElement = (key: 'addButton') => {
  switch (key) {
    case 'addButton':
      return screen.getByRole('button', { name: 'Lisää käyttäjä' });
  }
};

test('should add and remove registration user assess', async () => {
  const user = userEvent.setup();
  renderRegistrationUserAccessesSection();

  const fields = ['Käyttäjän sähköpostiosoite*'];

  fields.forEach((name) => {
    expect(screen.queryByLabelText(name)).not.toBeInTheDocument();
  });

  const addButton = getElement('addButton');
  await user.click(addButton);

  await screen.findByLabelText(fields[0]);

  const toggleMenuButton = screen.getByRole('button', { name: /valinnat/i });
  await user.click(toggleMenuButton);
  const deleteButton = screen.getByRole('button', { name: /poista/i });
  await user.click(deleteButton);

  expect(screen.queryByLabelText(fields[0])).not.toBeInTheDocument();
});

test('should send invitation to registration user access', async () => {
  toast.success = jest.fn();
  const user = userEvent.setup();
  const email = 'user@email.com';
  renderRegistrationUserAccessesSection(
    { registrationUserAccesses: [{ email, id: 1, language: '' }] },
    [...defaultMocks, mockedSendInvitationResponse]
  );

  const toggleMenuButton = screen.getByRole('button', { name: /valinnat/i });
  await user.click(toggleMenuButton);
  const sendInvitationButton = screen.getByRole('button', {
    name: /lähetä kutsu uudelleen/i,
  });
  await user.click(sendInvitationButton);

  await waitFor(() =>
    expect(toast.success).toBeCalledWith(
      `Kutsu osallistujalistaan on lähetetty osoitteeseen ${email}.`
    )
  );
});

test('should show error message is sending invitation fails', async () => {
  toast.error = jest.fn();
  const user = userEvent.setup();
  const email = 'user@email.com';
  renderRegistrationUserAccessesSection(
    { registrationUserAccesses: [{ email, id: 1, language: '' }] },
    [...defaultMocks, mockedInvalidSendInvitationResponse]
  );

  const toggleMenuButton = screen.getByRole('button', { name: /valinnat/i });
  await user.click(toggleMenuButton);
  const sendInvitationButton = screen.getByRole('button', {
    name: /lähetä kutsu uudelleen/i,
  });
  await user.click(sendInvitationButton);

  await waitFor(() =>
    expect(toast.error).toBeCalledWith('Kutsun lähettäminen epäonnistui')
  );
});
