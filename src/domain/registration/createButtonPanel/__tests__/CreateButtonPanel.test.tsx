import React from 'react';
import { vi } from 'vitest';

import { fakeAuthenticatedAuthContextValue } from '../../../../utils/mockAuthContextValue';
import {
  configure,
  render,
  screen,
  waitFor,
} from '../../../../utils/testUtils';
import { AuthContextProps } from '../../../auth/types';
import { mockedUserResponse } from '../../../user/__mocks__/user';
import CreateButtonPanel from '../CreateButtonPanel';

configure({ defaultHidden: true });

const mocks = [mockedUserResponse];

const renderComponent = (authContextValue?: AuthContextProps) =>
  render(<CreateButtonPanel onSave={vi.fn()} saving={null} />, {
    authContextValue,
    mocks,
  });

const getElement = (key: 'saveButton') => {
  switch (key) {
    case 'saveButton':
      return screen.getByRole('button', { name: 'Tallenna ilmoittautuminen' });
  }
};

test('button should be disabled when user is not authenticated', () => {
  renderComponent();

  const saveButton = getElement('saveButton');
  expect(saveButton).toBeDisabled();
});

test('button should be enabled when user is authenticated', async () => {
  const authContextValue = fakeAuthenticatedAuthContextValue();

  renderComponent(authContextValue);

  const saveButton = await getElement('saveButton');
  await waitFor(() => expect(saveButton).toBeEnabled());
});
