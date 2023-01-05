import { Formik } from 'formik';
import React from 'react';

import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
import { configure, render, screen } from '../../../../utils/testUtils';
import { AuthContextProps } from '../../../auth/types';
import { organizationId } from '../../../organization/__mocks__/organization';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import { EVENT_FIELDS, EVENT_TYPE } from '../../constants';
import ButtonPanel from '../CreateButtonPanel';

configure({ defaultHidden: true });

const mocks = [mockedUserResponse];

const renderComponent = (authContextValue?: AuthContextProps) =>
  render(
    <Formik
      initialValues={{ [EVENT_FIELDS.TYPE]: EVENT_TYPE.General }}
      onSubmit={jest.fn()}
    >
      <ButtonPanel
        onSubmit={jest.fn()}
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

test('buttons should be enabled when user is authenticated', async () => {
  const authContextValue = fakeAuthenticatedAuthContextValue();

  renderComponent(authContextValue);

  const buttonSaveDraft = await screen.findByRole('button', {
    name: /tallenna luonnos/i,
  });
  const buttonPublish = screen.getByRole('button', {
    name: /julkaise tapahtuma/i,
  });
  const buttons = [buttonSaveDraft, buttonPublish];

  for (const button of buttons) {
    expect(button).toBeEnabled();
  }
});
