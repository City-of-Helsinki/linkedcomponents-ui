import { MockedResponse } from '@apollo/client/testing';
import { Formik } from 'formik';
import React from 'react';
import { toast } from 'react-toastify';

import { SendRegistrationUserInvitationDocument } from '../../../../../generated/graphql';
import {
  configure,
  render,
  screen,
  userEvent,
  waitFor,
} from '../../../../../utils/testUtils';
import {
  REGISTRATION_FIELDS,
  TEST_REGISTRATION_USER_ID,
} from '../../../constants';
import { RegistrationFormFields } from '../../../types';
import { registrationSchema } from '../../../validation';
import RegistrationUsersSection from '../RegistrationUsersSection';

configure({ defaultHidden: true });

const defaultInitialValue = {
  [REGISTRATION_FIELDS.REGISTRATION_USERS]: [],
};
const sendInvitationVariables = { id: TEST_REGISTRATION_USER_ID };
const mockedSendInvitationResponse: MockedResponse = {
  request: {
    query: SendRegistrationUserInvitationDocument,
    variables: sendInvitationVariables,
  },
  result: { data: { sendRegistrationUserInvitation: null } },
};
const mockedInvalidSendInvitationResponse: MockedResponse = {
  request: {
    query: SendRegistrationUserInvitationDocument,
    variables: sendInvitationVariables,
  },
  error: new Error(),
};

const renderRegistrationUsersSection = (
  initialValues?: Partial<RegistrationFormFields>,
  mocks: MockedResponse[] = []
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

test('should add and remove registration user', async () => {
  const user = userEvent.setup();
  renderRegistrationUsersSection();

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

test('should send invitation to registration user', async () => {
  toast.success = jest.fn();
  const user = userEvent.setup();
  const email = 'user@email.com';
  renderRegistrationUsersSection({ registrationUsers: [{ email, id: 1 }] }, [
    mockedSendInvitationResponse,
  ]);

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
  renderRegistrationUsersSection({ registrationUsers: [{ email, id: 1 }] }, [
    mockedInvalidSendInvitationResponse,
  ]);

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
