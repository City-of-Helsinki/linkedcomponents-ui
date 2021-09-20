import { AnyAction, Store } from '@reduxjs/toolkit';
import React from 'react';

import { defaultStoreState } from '../../../../constants';
import { StoreState } from '../../../../types';
import { fakeAuthenticatedStoreState } from '../../../../utils/mockStoreUtils';
import {
  configure,
  getMockReduxStore,
  render,
  screen,
} from '../../../../utils/testUtils';
import translations from '../../../app/i18n/fi.json';
import { mockedUserResponse } from '../../../registrations/__mocks__/registrationsPage';
import CreateButtonPanel from '../CreateButtonPanel';

configure({ defaultHidden: true });

const mocks = [mockedUserResponse];

const renderComponent = (store?: Store<StoreState, AnyAction>) =>
  render(<CreateButtonPanel onSave={jest.fn()} saving={null} />, {
    mocks,
    store,
  });

test('button should be disabled when user is not authenticated', () => {
  const store = getMockReduxStore(defaultStoreState);

  renderComponent(store);

  expect(
    screen.getByRole('button', {
      name: translations.registration.form.buttonPanel.warningNotAuthenticated,
    })
  ).toBeDisabled();
});

test('button should be enabled when user is authenticated', async () => {
  const storeState = fakeAuthenticatedStoreState();
  const store = getMockReduxStore(storeState);

  renderComponent(store);

  const saveButton = await screen.findByRole('button', {
    name: 'Tallenna ilmoittautuminen',
  });

  expect(saveButton).toBeEnabled();
});
