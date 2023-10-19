import { MockedResponse } from '@apollo/client/testing';
import { Formik } from 'formik';
import React from 'react';

import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
import { configure, render, screen } from '../../../../utils/testUtils';
import { AuthContextProps } from '../../../auth/types';
import { organizationId } from '../../../organization/__mocks__/organization';
import {
  mockedUserResponse,
  mockedUserWithoutOrganizationsResponse,
} from '../../../user/__mocks__/user';
import { EVENT_FIELDS, EVENT_TYPE } from '../../constants';
import ButtonPanel from '../CreateButtonPanel';

configure({ defaultHidden: true });

const renderComponent = (
  authContextValue?: AuthContextProps,
  mocks?: MockedResponse[]
) =>
  render(
    <Formik
      initialValues={{ [EVENT_FIELDS.TYPE]: EVENT_TYPE.General }}
      onSubmit={vi.fn()}
    >
      <ButtonPanel
        onSubmit={vi.fn()}
        publisher={organizationId}
        saving={null}
      />
    </Formik>,
    { authContextValue, mocks }
  );

test('publish should be disabled when user is not authenticated', () => {
  renderComponent();

  const buttons = ['Julkaise tapahtuma'];

  buttons.forEach((name) => {
    expect(screen.getByRole('button', { name })).toBeDisabled();
  });
});

test('buttons should be enabled when external user is authenticated', async () => {
  const authContextValue = fakeAuthenticatedAuthContextValue();
  const mocks = [mockedUserWithoutOrganizationsResponse];

  renderComponent(authContextValue, mocks);

  const buttonSaveDraft = await screen.findByRole('button', {
    name: /tallenna luonnos/i,
  });

  expect(buttonSaveDraft).toBeEnabled();
});

test('buttons should be enabled when regular user is authenticated', async () => {
  const authContextValue = fakeAuthenticatedAuthContextValue();
  const mocks = [mockedUserResponse];

  renderComponent(authContextValue, mocks);

  const buttonSaveDraft = await screen.findByRole('button', {
    name: /tallenna luonnos/i,
  });

  const buttons = [buttonSaveDraft];

  for (const button of buttons) {
    expect(button).toBeEnabled();
  }
});
